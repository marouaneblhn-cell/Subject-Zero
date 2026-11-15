import { motion } from 'framer-motion';

const skills = [
  'UI/UX Design', 'Figma', 'React.js', 'Framer Motion', 'Tailwind CSS',
  'Prototyping', 'Design Systems', 'Three.js', 'TypeScript', 'GSAP',
  'Next.js', 'User Research', 'Wireframing', 'Motion Design', 'Accessibility',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function About() {
  return (
    <section id="about" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#0d1116' }}>
      {/* Section accent line */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="w-8 h-px bg-[#00df8f]" />
          <span className="text-xs font-semibold tracking-widest text-[#00df8f] uppercase">About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left column */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-10"
            >
              DESIGNING<br />
              WITH<br />
              <span className="text-[#00df8f]">PURPOSE.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-5"
            >
              <p className="text-gray-400 leading-relaxed">
                I'm a multidisciplinary designer and developer who bridges the gap between
                stunning visuals and seamless functionality. With over five years in the field,
                I've helped startups and global brands craft products that resonate with users
                on an emotional level.
              </p>
              <p className="text-gray-400 leading-relaxed">
                My process is rooted in empathy — understanding not just what users do, but
                why they do it. Every pixel, every interaction, every line of code is deliberate.
                The result is always a digital experience that feels effortless.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex gap-8 mt-12 pt-8 border-t border-white/10"
            >
              <div>
                <div className="text-3xl font-black text-white">20<span className="text-[#00df8f]">+</span></div>
                <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Awards</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white">100<span className="text-[#00df8f]">%</span></div>
                <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Commitment</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white">5<span className="text-[#00df8f]">+</span></div>
                <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Years</div>
              </div>
            </motion.div>
          </div>

          {/* Right column — Skill chips card */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">
                My Toolkit
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="flex flex-wrap gap-3"
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.08,
                      borderColor: '#00df8f',
                      color: '#00df8f',
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 cursor-default transition-shadow"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    whileHover_shadow="0 0 15px rgba(0,223,143,0.3)"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>

              {/* Bottom accent */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#00df8f] animate-pulse" />
                <span className="text-xs text-gray-500 tracking-wide">Available for freelance & full-time opportunities</span>
              </div>
            </motion.div>

            {/* Experience card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-4 rounded-3xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(0,223,143,0.08), rgba(0,223,143,0.02))',
                border: '1px solid rgba(0,223,143,0.15)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,223,143,0.15)' }}>
                  <span className="text-[#00df8f] text-sm">✦</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Currently open to work</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Looking for exciting challenges in product design, creative direction, and front-end development.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
