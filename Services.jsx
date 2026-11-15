import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const stages = [
  {
    number: '01',
    title: 'BRIEFING',
    content:
      'We begin with a deep dive into your goals, audience, and competitive landscape. This phase establishes a shared vision — aligning business objectives with creative direction before a single pixel is drawn.',
  },
  {
    number: '02',
    title: 'ANALYTICS',
    content:
      'Data-driven decisions underpin every great design. We analyse user behaviour, study heatmaps, and conduct competitive audits to surface the insights that guide the creative strategy.',
  },
  {
    number: '03',
    title: 'PROTOTYPING',
    content:
      'Low and high fidelity prototypes bring ideas to life quickly. Rapid iteration cycles let us test assumptions, gather real feedback, and refine the experience before committing to final production.',
  },
  {
    number: '04',
    title: 'DESIGN',
    content:
      'This is where the magic happens. A bespoke visual language, crafted motion system, and pixel-perfect components come together to form a cohesive, living design system.',
  },
  {
    number: '05',
    title: 'ADAPTIVE',
    content:
      'Every design is engineered to perform flawlessly across all viewports and devices. Responsive layouts, accessible components, and performant code ensure a consistent experience for every user.',
  },
  {
    number: '06',
    title: 'THE FINAL',
    content:
      'A rigorous QA process, final stakeholder reviews, and a smooth handoff. We don\'t just deliver files — we deliver confidence, documentation, and ongoing support to ensure a launch that exceeds expectations.',
  },
];

export default function Services() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="py-32 relative" style={{ backgroundColor: '#0d1116' }}>
      {/* Subtle background orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,223,143,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-[#00df8f]" />
            <span className="text-xs font-semibold tracking-widest text-[#00df8f] uppercase">Process</span>
            <span className="w-8 h-px bg-[#00df8f]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight">
            STAGES OF WEBSITE{' '}
            <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.25)', color: 'transparent', display: 'inline-block' }}>
              DEVELOPMENT
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {stages.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center gap-6 py-7 text-left group"
              >
                {/* Number */}
                <span
                  className="text-xs font-mono font-bold tracking-widest flex-shrink-0 transition-colors duration-300"
                  style={{ color: openIdx === i ? '#00df8f' : 'rgba(255,255,255,0.2)' }}
                >
                  {stage.number}
                </span>

                {/* Title */}
                <span
                  className="flex-1 text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300"
                  style={{ color: openIdx === i ? '#ffffff' : 'rgba(255,255,255,0.7)' }}
                >
                  {stage.title}
                </span>

                {/* Toggle icon */}
                <motion.span
                  animate={{ rotate: openIdx === i ? 0 : 0 }}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300"
                  style={{
                    background: openIdx === i ? 'rgba(0,223,143,0.15)' : 'rgba(255,255,255,0.05)',
                    border: openIdx === i ? '1px solid rgba(0,223,143,0.35)' : '1px solid rgba(255,255,255,0.1)',
                    color: openIdx === i ? '#00df8f' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {openIdx === i ? <Minus size={14} /> : <Plus size={14} />}
                </motion.span>
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pl-14 text-gray-400 leading-relaxed text-sm sm:text-base max-w-xl">
                      {stage.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
