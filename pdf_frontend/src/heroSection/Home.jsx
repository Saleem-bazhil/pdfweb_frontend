import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 lg:pt-40 px-4">
      {/* Background Image (Soft Gradient Overlay) */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1581092334440-1e7dc03e3703"
          alt="Premium Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/95" />
      </div>

      {/* Hero Content */}
      <div className="text-center w-full flex flex-col items-center space-y-6 lg:space-y-10">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="space-y-2"
        >
          <motion.h1
            className="agbalumo text-primary font-extrabold text-3xl sm:text-4xl ms:text-5xl lg:text-7xl leading-tight"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Buy & View Guides Securely
          </motion.h1>

          <motion.h2
            className="agbalumo text-2xl sm:text-3xl ms:text-4xl lg:text-6xl text-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Study Smarter. Study Safe.
          </motion.h2>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          className="text-muted-foreground poppins text-sm sm:text-base ms:text-lg max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          Premium 12th standard study guides with military-grade protection. <br />
          Pay once, access forever — no downloads, no sharing.
        </motion.p>

        {/* CTA Buttons with Subtle Stagger Animation */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.8 },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Button className="w-full sm:w-auto py-4 sm:py-5 px-8 lg:px-10 lg:py-6 rounded-xl poppins font-semibold shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-500 to-blue-700 hover:brightness-110">
             <Link to='/guide'> Browse Guides</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Button
              variant="glass"
              className="w-full sm:w-auto py-4 sm:py-5 px-8 lg:px-10 lg:py-6 rounded-xl poppins font-semibold border border-blue-300/50 text-blue-700 hover:bg-blue-50 transition-all"
            >
              Login
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
