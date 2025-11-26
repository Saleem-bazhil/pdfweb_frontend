import { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import GuideCard from "./GuideCard";
import { motion } from "framer-motion";
import PaymentModal from "../paymentmodel/PaymentModel";
import api from "../Api";

const Guide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    api
      .get("/guides")
      .then((response) => {
        console.log("Guides API Response:", response);
        setGuides(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching guides:", error);
      });
  }, []);

  const filteredGuides = guides.filter((guide) => {
    const subject = (guide?.subject || guide?.category || "").toLowerCase();
    const title = (guide?.title || "").toLowerCase();
    const q = (searchQuery || "").toLowerCase();
    return subject.includes(q) || title.includes(q);
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-12 md:mb-16 px-3 sm:px-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4">
              Secure Study{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 bg-clip-text text-transparent">
                Guides
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed">
              Premium 12th standard guides with{" "}
              <strong className="text-blue-600 font-semibold">
                secure access
              </strong>
              , smart interface, and lifetime access — designed for excellence.
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Guides */}
          <GuideCard
            guides={filteredGuides}
            setSelectedGuide={setSelectedGuide}
          />

          {selectedGuide && (
            <PaymentModal
              guide={selectedGuide}
              onClose={() => setSelectedGuide(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Guide;
