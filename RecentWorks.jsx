import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 0,
    category: 'Mobile Application',
    title: 'Neon Arcade — Gaming UI Kit',
    description:
      'A comprehensive design system built for next-gen gaming platforms. Featuring micro-interactions, particle effects, and a dark cyberpunk aesthetic that pushes visual boundaries.',
    tags: ['Figma', 'UI Kit', 'Design System', 'Gaming'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 1,
    category: 'Web Platform',
    title: 'Solaris — Architecture Studio',
    description:
      'A sleek, minimalist digital presence for an award-winning architecture firm. The site balances breathtaking imagery with typographic precision and fluid page transitions.',
    tags: ['React', 'Framer Motion', 'GSAP', 'Three.js'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    category: 'Brand Identity',
    title: 'Aeris — Luxury Travel App',
    description:
      'Crafting a premium travel experience from the ground up. Full product design including brand identity, illustration system, and a native iOS application.',
    tags: ['iOS', 'Branding', 'Illustration', 'UX Research'],
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    category: 'Dashboard',
    title: 'Prism — Analytics Platform',
    description:
      'A data-heavy analytics dashboard reinvented with clarity in mind. Complex datasets brought to life through elegant data visualizations and a refined component library.',
    tags: ['Dashboard', 'Data Viz', 'Tailwind', 'React'],
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop',
  },
];

const CARD_PERSPECTIVE = 1000;

export default function RecentWorks() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleCardClick = (projectIdx) => {
    if (projectIdx === activeIdx) {
      // Cycle active to back
      setActiveIdx((prev) => (prev + 1) % projects.length);
    } else {
      // Pull clicked to front
      setActiveIdx(projectIdx);
    }
  };

  // Build display order: active first, then rest in order
  const orderedProjects = [
    projects[activeIdx],
    ...projects.filter((_, i) => i !== activeIdx),
  ];

  return (
    <section id="work" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#0d1116' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#00df8f]" />
              <span className="text-xs font-semibold tracking-widest text-[#00df8f] uppercase">Portfolio</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
              RECENT<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)', color: 'transparent' }}>
                WORKS
              </span>
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white border border-white/20 hover:border-[#00df8f]/50 transition-colors self-start sm:self-auto"
          >
            View All Projects
            <ArrowUpRight size={15} />
          </motion.button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left — 3D stacked cards */}
          <div className="lg:col-span-7">
            {/* Stack container */}
            <div
              className="relative h-[340px] sm:h-[450px] md:h-[500px] cursor-pointer"
              style={{ perspective: `${CARD_PERSPECTIVE}px` }}
            >
              {orderedProjects.map((project, displayIdx) => {
                const diff = displayIdx; // 0 = front
                const isActive = diff === 0;

                return (
                  <motion.div
                    key={project.id}
                    onClick={() => handleCardClick(project.id)}
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{ transformOrigin: 'top center' }}
                    animate={{
                      y: diff * 28,
                      scale: 1 - diff * 0.04,
                      rotateX: diff * 3,
                      zIndex: projects.length - diff,
                      filter: `brightness(${1 - diff * 0.15})`,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <div
                      className="w-full h-full rounded-3xl overflow-hidden relative"
                      style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: isActive
                          ? '0 30px 80px rgba(0,0,0,0.6)'
                          : '0 10px 30px rgba(0,0,0,0.4)',
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      {/* Dark overlay */}
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(0deg, rgba(13,17,22,0.7) 0%, transparent 50%)' }}
                      />
                      {/* Card label bottom */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="absolute bottom-5 left-5 right-5 flex items-end justify-between"
                        >
                          <div>
                            <div className="text-xs text-[#00df8f] font-semibold tracking-widest uppercase mb-1">
                              {project.category}
                            </div>
                            <div className="text-white font-bold text-xl leading-tight">
                              {project.title}
                            </div>
                          </div>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(0,223,143,0.2)', border: '1px solid rgba(0,223,143,0.4)' }}
                          >
                            <ArrowUpRight size={16} className="text-[#00df8f]" />
                          </div>
                        </motion.div>
                      )}

                      {/* Click hint on back cards */}
                      {!isActive && diff <= 2 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 text-xs font-medium">Tap to view</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(i)}
                  className="transition-all duration-300"
                >
                  <motion.span
                    animate={{
                      width: i === activeIdx ? 24 : 8,
                      backgroundColor: i === activeIdx ? '#00df8f' : 'rgba(255,255,255,0.2)',
                    }}
                    className="block h-2 rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Description panel */}
          <div className="lg:col-span-5 lg:pt-0 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Index */}
                <span className="text-[80px] font-black leading-none text-white/5 select-none">
                  0{activeIdx + 1}
                </span>

                {/* Category */}
                <div className="text-xs font-semibold tracking-widest text-[#00df8f] uppercase -mt-4 mb-3">
                  {projects[activeIdx].category}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight mb-5">
                  {projects[activeIdx].title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-sm mb-6">
                  {projects[activeIdx].description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[activeIdx].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1.5 rounded-full text-gray-300"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #00df8f, #00b373)',
                    boxShadow: '0 0 20px rgba(0,223,143,0.25)',
                  }}
                >
                  Explore Project
                  <ArrowUpRight size={16} />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
