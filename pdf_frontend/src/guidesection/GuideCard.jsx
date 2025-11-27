import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lock, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import maths from "../assets/math.png";
import physics from "../assets/physics.png";
import chemistry from "../assets/chemistry.png";

const GuideCard = ({ guides, setSelectedGuide }) => {
  const safeGuides = Array.isArray(guides) ? guides : [];
  const navigate = useNavigate();

  if (!safeGuides.length) {
    return (
      <div className="mt-10 text-center text-muted-foreground">
        No guides found. Try a different search.
      </div>
    );
  }

  // get current user id (if you store it in localStorage after login)
  let currentUserId = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      currentUserId = user?._id || user?.id || null;
    }
  } catch (e) {
    console.warn("Failed to parse user from localStorage");
  }

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6 sm:gap-8 lg:gap-10 
        px-3 sm:px-6 lg:px-20 
        mt-10 sm:mt-14 mb-8 sm:mb-16
      "
    >
      {safeGuides.map((guide, index) => {
        const id = guide._id || guide.id; // Mongo _id

        const subject = guide.subject || guide.category || "Study Guide";

        const price =
          typeof guide.price === "number"
            ? `₹${guide.price}`
            : guide.price || "₹0";

        const rating =
          typeof guide.rating === "number"
            ? guide.rating.toFixed(1)
            : guide.rating || "4.8";

        const students = guide.students ?? guide.ratingCount ?? 0;
        const chapters = guide.chapters || 0;

        const topics = Array.isArray(guide.topics)
          ? guide.topics
          : Array.isArray(guide.tags)
          ? guide.tags
          : [];

        //  Always choose one of our local images based on subject/title
        const subjLower = (subject || "").toLowerCase();
        const titleLower = (guide.title || "").toLowerCase();
        let imgSrc = maths; // default

        if (subjLower.includes("physics") || titleLower.includes("physics")) {
          imgSrc = physics;
        } else if (
          subjLower.includes("chem") ||
          titleLower.includes("chem")
        ) {
          imgSrc = chemistry;
        } else if (
          subjLower.includes("math") ||
          subjLower.includes("mathematics") ||
          titleLower.includes("math")
        ) {
          imgSrc = maths;
        }

        // debug (you can remove after checking)
        console.log("Guide:", guide.title, "→ subject:", subject, "→ img:", imgSrc);
        const paidKey =
          currentUserId && id ? `paid_${currentUserId}_${id}` : null;

        const isPaid = paidKey
          ? localStorage.getItem(paidKey) === "true"
          : false;

        return (
          <motion.div
            key={id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Glow Hover Effect */}
            <div
              className="
                absolute -inset-[1px] 
                bg-gradient-to-r from-blue-400/40 via-blue-500/30 to-indigo-500/40 
                blur-xl opacity-0 group-hover:opacity-70 
                transition-all duration-700 rounded-2xl pointer-events-none
              "
            />

            <Card
              className="
                relative overflow-hidden rounded-2xl border border-blue-100 
                bg-white/95 shadow-sm hover:shadow-xl 
                transition-all duration-500 hover:-translate-y-2 
                backdrop-blur-sm z-10
              "
            >
              <CardHeader
                className="
                  relative h-40 sm:h-48 flex items-center justify-center 
                  p-0 rounded-t-2xl overflow-hidden 
                  bg-gray-50 {/* Added a light background color for the empty space */}
                "
              >
                {/* Image layer - CHANGED object-cover TO object-contain */}
                <img
                  src={imgSrc}
                  alt={guide.title || "Guide"}
                  className="absolute inset-0 w-full h-full object-contain p-2 rounded-t-2xl" 
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <Badge
                    variant="outline"
                    className="
                      mb-2 text-xs sm:text-sm px-3 py-1 
                      rounded-full border-blue-200 text-blue-700 bg-blue-50
                    "
                  >
                    {subject}
                  </Badge>
                  <h3
                    className="
                      text-lg sm:text-xl font-semibold leading-snug text-gray-900 
                      group-hover:text-blue-700 transition-colors
                    "
                  >
                    {guide.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1 sm:gap-2 text-blue-700">
                    <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                    <span className="font-medium text-gray-900">{rating}</span>
                    <span>({students})</span>
                  </div>
                  <div className="font-medium text-gray-600">
                    {chapters} Chapters
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.slice(0, 3).map((topic, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="
                        text-[11px] sm:text-xs px-2.5 py-1 
                        rounded-full bg-blue-50 text-blue-700 border border-blue-100
                      "
                    >
                      {topic}
                    </Badge>
                  ))}
                  {topics.length > 3 && (
                    <span className="text-[11px] sm:text-xs text-blue-600">
                     
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter
                className="
                  flex flex-col border-t border-blue-100/60 
                  p-5 sm:p-6 pt-4 sm:pt-5 space-y-4
                "
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="
                      text-2xl sm:text-3xl font-bold 
                      bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent
                    "
                  >
                    {price}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    one-time
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => {
                      console.log("Buy Now clicked for guide:", guide);
                      if (typeof setSelectedGuide === "function") {
                        setSelectedGuide(guide);
                      } else {
                        console.warn("setSelectedGuide is not a function");
                      }
                    }}
                    className="
                      flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 
                      hover:brightness-110 text-white transition-all 
                      shadow-md py-3 sm:py-5 text-sm sm:text-base font-semibold
                    "
                    aria-label={`Buy ${guide.title}`}
                  >
                    Buy Now
                  </Button>

                  {/* View Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (!id) {
                        alert("Guide id missing");
                        return;
                      }

                      if (isPaid) {
                        navigate(`/viewer/${id}`);
                      } else {
                        alert(
                          " Please complete your payment before viewing this guide."
                        );
                      }
                    }}
                    className={`
                      rounded-xl border-blue-300 
                      transition-all flex items-center justify-center
                      ${
                        isPaid
                          ? "bg-green-50 text-green-600 border-green-300"
                          : "text-blue-600 hover:bg-blue-50"
                      }
                    `}
                    title={isPaid ? "View Guide" : "Locked"}
                  >
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-blue-600/80 pt-1">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Protected viewing • No downloads</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GuideCard;