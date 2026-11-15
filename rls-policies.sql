-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) PRODUCTION POLICIES & SCHEMA
-- Compatible with PostgreSQL 13+ and Supabase Database Engine
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SCHEMA DEFINITION FOR PORTFOLIO PLATFORM
-- ------------------------------------------------------------------------------

-- 2.1 User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Portfolio Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'web',
    description TEXT,
    content TEXT,
    image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Contact Form Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    ip_hash TEXT,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'replied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Analytics / Visitor Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR PERFORMANCE (Critical for RLS policy evaluation speed)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- 4. SECURITY DEFINER HELPER FUNCTIONS
-- Explicitly declare search_path = public to prevent schema search-path hijacking
-- ------------------------------------------------------------------------------

-- Helper: Check if current authenticated user has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
$$;

-- Helper: Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger for profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for projects
DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. ROW-LEVEL SECURITY ENFORCEMENT
-- Enable RLS on every table (Default Deny)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Optional: Force RLS for table owners (prevents accidental owner bypass)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries FORCE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events FORCE ROW LEVEL SECURITY;

-- 6. POLICIES SPECIFICATION
-- ------------------------------------------------------------------------------

-- ------------------------------------------------------------------------------
-- 6.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------

-- Public read: Anyone can view author public profile details
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (true);

-- User update: Users can only modify their own profile data, cannot change role to admin
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
);

-- Admin update: Admins have full update rights over profiles (including role assignment)
CREATE POLICY "Admins have full profile management"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Insert profile: Trigger or authenticated user inserting their own record
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 6.2 PROJECTS POLICIES
-- ------------------------------------------------------------------------------

-- Public read: Anyone can read published projects
CREATE POLICY "Published projects are viewable by everyone"
ON public.projects FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Author read: Authenticated users can view their own draft projects
CREATE POLICY "Users can view own draft projects"
ON public.projects FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Admin read: Admins can view all projects (drafts & published)
CREATE POLICY "Admins can view all projects"
ON public.projects FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Insert: Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (created_by = auth.uid() OR public.is_admin(auth.uid()))
);

-- Update: Authors can update their own projects; Admins can update any project
CREATE POLICY "Authors and admins can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (created_by = auth.uid() OR public.is_admin(auth.uid()));

-- Delete: Authors can delete own projects; Admins can delete any project
CREATE POLICY "Authors and admins can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 6.3 CONTACT INQUIRIES POLICIES
-- ------------------------------------------------------------------------------

-- Anyone (including unauthenticated visitors) can submit a contact message
CREATE POLICY "Anyone can submit contact inquiry"
ON public.contact_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (
    length(sender_name) > 0 AND 
    length(sender_email) > 3 AND 
    length(message) > 0
);

-- Only Admins can view submitted inquiries (Confidentiality protection)
CREATE POLICY "Admins can view contact inquiries"
ON public.contact_inquiries FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only Admins can update status (e.g. mark as read or replied)
CREATE POLICY "Admins can update contact inquiries"
ON public.contact_inquiries FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only Admins can delete inquiries
CREATE POLICY "Admins can delete contact inquiries"
ON public.contact_inquiries FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 6.4 ANALYTICS EVENTS POLICIES
-- ------------------------------------------------------------------------------

-- Public write: Anonymous tracking events can be appended
CREATE POLICY "Public can record analytics events"
ON public.analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin read: Only admins can inspect telemetry data
CREATE POLICY "Admins can inspect analytics events"
ON public.analytics_events FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- 7. AUDIT & VERIFICATION SCRIPTS
-- ==============================================================================

-- Verification query 1: Check that RLS is enabled on all target tables
-- Expected result: rowsecurity = true for all tables
/*
SELECT 
    schemaname, 
    tablename, 
    rowsecurity, 
    forcerowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'projects', 'contact_inquiries', 'analytics_events');
*/

-- Verification query 2: List all active policies
/*
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE schemaname = 'public';
*/
