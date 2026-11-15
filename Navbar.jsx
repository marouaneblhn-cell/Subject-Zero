import { motion } from 'framer-motion';

const links = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
];

const scrollTo = (id) => {
  if (id === '#top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-24"
      style={{ backgroundColor: 'rgba(15,17,21,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <button
        onClick={() => scrollTo('#top')}
        className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity"
      >
        MAROUANE<span className="text-[#00df8f]">.</span>
      </button>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <li key={link.href}>
            <button
              onClick={() => scrollTo(link.href)}
              className="text-xs font-semibold tracking-widest text-gray-400 uppercase hover:text-[#00df8f] transition-colors duration-300"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Action button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => scrollTo('#contact')}
        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00df8f]/60 transition-colors"
        title="Contact"
      >
        <span className="w-2 h-2 rounded-full bg-[#00df8f] animate-pulse" />
      </motion.button>
    </motion.nav>
  );
}
