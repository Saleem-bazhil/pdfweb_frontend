import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {Link} from 'react-router-dom';

const CardPrice = [
  {
    id: 1,
    subject: "Mathematics",
    price: 299,
    offer_price: 50,
    options: [
      "Complete Syllabus Coverage",
      "Practice Problems",
      "Solution Keys",
      "Exam Tips",
    ],
  },
  {
    id: 2,
    subject: "Physics",
    price: 349,
    offer_price: 50,
    options: [
      "Theory + Numericals",
      "Diagrams & Illustrations",
      "Previous Year Papers",
      "Quick Revision",
    ],
  },
  {
    id: 3,
    subject: "Chemistry",
    price: 299,
    offer_price: 50,
    options: [
      "Organic + Inorganic",
      "Equations & Reactions",
      "Lab Manual",
      "Memory Techniques",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const PriceCard = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 lg:px-28 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {CardPrice.map((detail) => (
        <motion.div
          key={detail.id}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          className="relative"
        >
          <Card
            className="relative rounded-3xl overflow-hidden border border-transparent 
            bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]
            hover:shadow-[0_15px_50px_rgba(0,0,0,0.10)] 
            transition-all duration-500 group"
          >
            {/* Top Glow Bar */}
            <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />

            {/* Discount Tag */}
            <Badge
              className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 
              text-white font-semibold text-xs px-3 py-1 rounded-full shadow-md"
            >
              83% OFF
            </Badge>

            {/* Header */}
            <CardHeader className="text-center pb-2 pt-8">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {detail.subject}
              </h3>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="line-through text-gray-400 font-medium">
                  ₹{detail.price}
                </span>
                <span
                  className="text-4xl font-extrabold text-transparent bg-clip-text 
                  bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  ₹{detail.offer_price}
                </span>
              </div>
            </CardHeader>

            {/* Features */}
            <CardContent className="px-8 pt-2">
              <ul className="space-y-4">
                {detail.options.map((opt, idx) => (
                  <li key={idx} className="flex gap-3 items-center">
                    <CheckCircle2 className="text-blue-600 h-5 w-5" />
                    <span className="text-gray-700 font-medium">{opt}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            {/* Footer */}
            <CardFooter className="px-8 pb-8 pt-6">
              <Button
                className="w-full py-3 text-white font-semibold rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-600
                shadow-md shadow-blue-500/20
                hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-110
                transition-all duration-300"
              >
                <Link to='/guide'>View Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PriceCard;
