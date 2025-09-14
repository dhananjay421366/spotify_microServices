import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

// LinkedIn-style opening animation (inspired — not an exact copy)
// Usage: import LinkedInOpenAnimation from './linkedin-style-open-animation'
// <LinkedInOpenAnimation onComplete={() => console.log('done')} />

export default function LinkedInOpenAnimation({
  width = 360,
  height = 360,
  duration = 2.4,
  onComplete = () => {},
}) {
  const controls = useAnimation();

  useEffect(() => {
    async function seq() {
      // orchestrate a short timeline using framer-motion controls
      await controls.start("bgIn");
      await controls.start("logoDraw");
      await controls.start("logoScale");
      await controls.start("revealText");
      // small pause then finish
      await new Promise((r) => setTimeout(r, 350));
      controls.start("fadeOut");
      // call onComplete after the whole timeline
      setTimeout(onComplete, 450);
    }
    seq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const svgVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = {
    bgIn: { scale: [1.06, 1], transition: { duration: 0.45 } },
    fadeOut: { opacity: 0, transition: { duration: 0.35 } },
  };

  const logoPath = {
    logoDraw: (i = 1) => ({
      pathLength: [0, 1],
      opacity: [0.25, 1],
      transition: { duration: 0.75, ease: "easeInOut", delay: 0.04 * i },
    }),
    logoScale: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const textVariants = {
    revealText: {
      opacity: [0, 1],
      y: [8, 0],
      transition: { duration: 0.45, ease: "easeOut", delay: 0.06 },
    },
  };

  return (
    <motion.div
      style={{ width, height }}
      className="flex items-center justify-center bg-[#0a66c2] rounded-2xl overflow-hidden relative"
      variants={containerVariants}
      initial=""
      animate={controls}
    >
      {/* soft radial spotlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="w-full h-full" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 20%, rgba(0,0,0,0.06) 90%)'
        }} />
      </motion.div>

      {/* Center column with logo + text */}
      <div className="flex flex-col items-center gap-3 z-10">
        {/* Logo box */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="p-3 bg-white rounded-md shadow-lg"
          style={{ boxShadow: '0 12px 30px rgba(2,6,23,0.28)' }}
        >
          <motion.svg
            width={72}
            height={72}
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={svgVariants}
            initial="hidden"
            animate={controls}
          >
            {/* square frame (logo-like) */}
            <motion.rect
              x="4"
              y="4"
              width="64"
              height="64"
              rx="12"
              stroke="#0a66c2"
              strokeWidth="3"
              initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              rxCompose
            />

            {/* inner "in" letters - stylized, simple shapes to avoid trademark copying */}
            <motion.rect
              x="18"
              y="22"
              width="8"
              height="20"
              rx="2"
              fill="#0a66c2"
              variants={logoPath}
              custom={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={controls}
            />

            <motion.rect
              x="30"
              y="28"
              width="18"
              height="14"
              rx="2"
              fill="#0a66c2"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={controls}
              transition={{ duration: 0.55, delay: 0.55, ease: "easeOut" }}
            />

            {/* small dot */}
            <motion.circle
              cx="54"
              cy="26"
              r="4"
              fill="#0a66c2"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1], opacity: [0, 1] }}
              transition={{ duration: 0.5, delay: 0.85 }}
            />
          </motion.svg>
        </motion.div>

        {/* App name / tagline */}
        <motion.div
          className="text-center text-white select-none"
          variants={textVariants}
          initial={{ opacity: 0, y: 8 }}
          animate={controls}
        >
          <motion.h1 className="text-lg font-semibold tracking-tight">Welcome to MyApp</motion.h1>
          <motion.p className="text-sm opacity-90 mt-1">Connecting professionals, redesigned for your product</motion.p>
        </motion.div>
      </div>

      {/* subtle animated grid lines in background */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 0.9 }}
        aria-hidden
      >
        <defs>
          <pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="transparent" />
            <path d="M24 0 H0 V24" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" />
      </motion.svg>

      {/* small loading dots bottom */}
      <motion.div
        className="absolute bottom-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.7, delay: 0.05 * i, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
