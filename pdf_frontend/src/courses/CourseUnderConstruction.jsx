import React from "react";
import { motion } from "framer-motion";
import { Wrench, HardHat, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CoursesUnderConstruction = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white text-center px-6">
      {/* Animated Icon Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-6 bg-white shadow-lg rounded-full border border-blue-100"
        >
          <Wrench size={64} className="text-blue-600" />
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4"
      >
        Courses  <span className="text-blue-600">Under Construction</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-xl mx-auto mb-8 text-lg"
      >
        We’re working hard to bring you amazing learning content!  
        Our course modules are being built and will be live soon.  
        Please check back later.
      </motion.p>

      {/* Extra Icons (optional aesthetic row) */}
      <div className="flex justify-center space-x-6 mb-8 text-blue-500">
        <HardHat size={32} />
        <Clock size={32} />
        <Wrench size={32} />
      </div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Button>
      </motion.div>

    </section>
  );
};

export default CoursesUnderConstruction;
