import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  const constraintsRef = useRef(null);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
      style={{ backgroundColor: '#0d1116' }}
    >
      {/* Massive background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[20vw] font-black tracking-tighter text-white leading-none"
          style={{ opacity: 0.02 }}
        >
          DESIGN
        </span>
      </div>

      {/* Glowing orb */}
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,223,143,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">

          {/* Left column */}
          <div className="flex flex-col gap-8">
            {/* Sub-label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-[#00df8f] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                UX/UI Designer
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black tracking-tighter leading-[0.9]">
                <span className="text-white block">DIGITAL</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '2px #00df8f',
                    color: 'transparent',
                  }}
                >
                  EXPERIENCES
                </span>
                <span className="text-[#00df8f]">.</span>
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-gray-400 leading-relaxed max-w-md text-base md:text-lg"
            >
              Crafting purposeful digital experiences that balance beauty with function.
              Specialising in interface design that feels intuitive, alive, and unforgettable.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('#work')}
                className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #00df8f, #00b373)',
                  boxShadow: '0 0 30px rgba(0,223,143,0.35)',
                }}
              >
                View My Work
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                  <ArrowRight size={14} />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#00df8f' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('#contact')}
                className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/20 transition-colors"
                style={{ backgroundColor: '#14181f' }}
              >
                Contact Me
                <span className="w-2 h-2 rounded-full bg-[#00df8f]" />
              </motion.button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-8 pt-4 border-t border-white/10"
            >
              {[
                { num: '5+', label: 'Years Experience' },
                { num: '80+', label: 'Projects Shipped' },
                { num: '20+', label: 'Awards Won' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-white">{s.num}</div>
                  <div className="text-xs text-gray-500 tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — Draggable ID card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div ref={constraintsRef} className="relative flex items-center justify-center w-full h-[520px]">

              {/* Lanyard */}
              <div
                className="absolute top-0 left-1/2 z-10 pointer-events-none"
                style={{ transform: 'translateX(-50%)', width: '4px', height: '80px', background: 'linear-gradient(180deg, transparent, #00df8f60, #00df8f)' }}
              />
              <div
                className="absolute top-0 left-1/2 z-10 pointer-events-none"
                style={{ transform: 'translateX(-1px)', width: '2px', height: '80px', background: 'linear-gradient(180deg, transparent, rgba(0,223,143,0.3))' }}
              />

              <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                animate={{
                  y: [0, -15, 0],
                  rotateZ: [-1, 1, -1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileDrag={{ scale: 1.03, rotateZ: 0 }}
                className="relative cursor-grab active:cursor-grabbing select-none"
                style={{ zIndex: 20 }}
              >
                {/* ID Card */}
                <div
                  className="w-64 sm:w-72 rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, #1e242e, #14181f)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
                  }}
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-xs font-black tracking-widest text-[#00df8f]">MAROUANE<span className="text-white">.</span></span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00df8f] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* Portrait */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src="/profile.png"
                      alt="Portrait"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 35%', transform: 'scale(0.9)' }}
                      draggable={false}
                    />
                    {/* Gradient overlay on portrait */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(0deg, #14181f 0%, transparent 60%)' }}
                    />
                    {/* Name over portrait */}
                    <div className="absolute bottom-3 left-5 right-5">
                      <div className="text-lg font-black tracking-tight text-white">Marouane<span className="text-[#00df8f]">.</span></div>
                      <div className="text-xs text-gray-400 tracking-wide">Lead UX/UI Designer</div>
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex gap-1.5">
                      {['UI', 'UX', 'Dev'].map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#00df8f]" style={{ background: 'rgba(0,223,143,0.1)', border: '1px solid rgba(0,223,143,0.2)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">ID-2024</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest text-gray-600 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#00df8f] to-transparent"
        />
      </motion.div>
    </section>
  );
}
