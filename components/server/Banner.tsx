import React from "react";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-b from-primary to-secondary text-white text-center p-6 shadow-lg flex flex-col items-center justify-center space-y-4"
    >
      <motion.div
        className="text-xl font-semibold"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🚀 No new events to register right now!
      </motion.div>
      <motion.p
        className="text-sm opacity-80"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Stay tuned for upcoming announcements.
      </motion.p>
    </motion.div>
  );
};

export default Banner;
