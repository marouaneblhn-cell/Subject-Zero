# Row-Level Security (RLS) Protocol Specification

## 1. Overview & Objective

Row-Level Security (RLS) is an access control mechanism implemented at the database tier (PostgreSQL / Supabase) that restricts which rows in a table can be returned or modified by a given database user or application context.

This protocol establishes defense-in-depth for application data, ensuring that regardless of API surface bugs, client tampering, or query parameter injection, **unauthorized users can never view, mutate, or delete data belonging to other entities.**

---

## 2. Core Protocol Principles

### 2.1 Default Deny
- By default, tables in PostgreSQL allow unrestricted access to table owners and superusers, while granting standard table-level permissions to other roles.
- Under this RLS protocol, **every single application table MUST have RLS explicitly enabled**:
  ```sql
  ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
  ```
- If RLS is enabled on a table and no policies exist, **all operations for non-superusers evaluate to false (access denied)**.

### 2.2 Table Owner Enforcement (`FORCE ROW LEVEL SECURITY`)
- In standard PostgreSQL, the table owner (e.g., migration user or role) bypasses RLS by default.
- For sensitive tables that must never leak rows even during scripts or accidental execution under owner credentials:
  ```sql
  ALTER TABLE <table_name> FORCE ROW LEVEL SECURITY;
  ```

### 2.3 Principle of Least Privilege
- Application connections should use an unprivileged or authenticated role (e.g., `authenticated` or `anon` in Supabase) rather than a superuser or `postgres` role.
- Service roles (`service_role`) should only be utilized in isolated, trusted server-side environments (such as webhooks or administrative batch processes) and must never be exposed to the client.

### 2.4 Contextual Identity Propagation
- User identity must be cryptographically validated via signed JWTs before queries are executed.
- Policies evaluate user identity through built-in context accessors (e.g., `auth.uid()` or session variables via `current_setting('app.current_user_id', true)`).
- Never trust client-supplied user IDs in query bodies without verifying equality against `auth.uid()`.

---

## 3. Policy Classification & Operation Types

Each policy operates on one or more SQL commands:
1. **`SELECT`**: Evaluated when retrieving rows (`USING` expression). If false, the row is omitted from query results without returning an error.
2. **`INSERT`**: Evaluated on row insertion (`WITH CHECK` expression). If false, the insert operation throws an error.
3. **`UPDATE`**: 
   - `USING` expression: Evaluated against the *existing* row state to determine if the user can target it.
   - `WITH CHECK` expression: Evaluated against the *proposed new* row state to ensure modified fields conform to policy (e.g., preventing changing ownership).
4. **`DELETE`**: Evaluated against the row to be deleted (`USING` expression).

### 3.1 Permissive vs Restrictive Policies
- **Permissive (`AS PERMISSIVE`)**: Default mode. Multiple permissive policies are joined with a logical `OR`. If any permissive policy passes, access is granted.
- **Restrictive (`AS RESTRICTIVE`)**: Joined with logical `AND`. Used for global guardrails (e.g., ensuring a tenant is active, account is not suspended, or user email is verified) across all permissive policies.

---

## 4. Threat Model & Mitigation Matrix

| Threat Vector | Description | RLS Mitigation |
|---|---|---|
| **Horizontal Privilege Escalation (BOLA/IDOR)** | User A modifies `id=user_b_id` in request to fetch or edit User B's profile. | Policy enforces `auth.uid() = user_id`. Attempting to access User B's row returns 0 rows or raises access denied. |
| **Vertical Privilege Escalation** | Regular user sends payload with `role = 'admin'`. | `WITH CHECK` condition prevents updating the `role` column or restricts modification to authorized admins only. |
| **Data Leakage in Public APIs** | Draft/unpublished portfolio items or contact inquiries leaked via list queries. | `SELECT` policy enforces `is_published = true` for anonymous callers; drafts visible only to author or admin. |
| **SQL Injection (SQLi) Defense in Depth** | Flaw in client query builder or parameter interpolation. | Even if an attacker injects `OR 1=1`, PostgreSQL applies RLS filters on top of the query plan, confining results to authorized rows. |
| **Search Path Hijacking** | Malicious schemas spoofing functions called in policies. | Custom security functions (e.g., `is_admin()`) must specify `SET search_path = public` and execute with `SECURITY DEFINER`. |

---

## 5. Standard Policy Patterns

### Pattern A: Public Read, Authenticated Author Mutation
*Used for: Published articles, public portfolio projects, public reviews.*
```sql
-- Allow anyone to read published records
CREATE POLICY "Public items are readable by all"
ON projects FOR SELECT
USING (is_published = true);

-- Allow authenticated owners to read their own unpublished items
CREATE POLICY "Owners can view own drafts"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = created_by);

-- Allow owners to modify their own records
CREATE POLICY "Owners can update own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
```

### Pattern B: Isolated Private Data (Strict Ownership)
*Used for: User profiles, private settings, drafts.*
```sql
CREATE POLICY "Users can only access own profile"
ON profiles FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### Pattern C: Public Blind Insert, Admin-Only Read
*Used for: Contact forms, quote inquiries, lead captures.*
```sql
-- Anyone (including anon) can submit a contact inquiry
CREATE POLICY "Anyone can submit contact inquiry"
ON contact_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only verified admins can read or manage contact inquiries
CREATE POLICY "Admins can view and manage inquiries"
ON contact_inquiries FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
```

---

## 6. Audit & Verification Checklist

- [ ] Every table created has `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`.
- [ ] No public read access exists for tables containing sensitive PII (emails, hashes, messages).
- [ ] Functions used inside policies use `SECURITY DEFINER` and `SET search_path = public`.
- [ ] Indexes exist on foreign keys used in RLS checks (e.g., `CREATE INDEX ON table (user_id);`) to prevent table scans during policy evaluation.
- [ ] Tested operations with both `anon` and `authenticated` roles to verify negative authorization (queries correctly return empty sets rather than unauthorized data).
