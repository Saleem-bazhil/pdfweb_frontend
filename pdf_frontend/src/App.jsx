import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./layout/Navbar";
import Hero from "./heroSection/Hero";
import Footer from "./layout/Footer";
import Guide from "./guidesection/Guide";
import StudyPrice from "./heroSection/StudyPrice";
import ScrollToTop from "./layout/ScrollToTop";
import Viewer from "./layout/Viewer";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import CoursesUnderConstruction from "./courses/CourseUnderConstruction";

function AnimatedRoutes() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/viewer");

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  };

  const pageTransition = {
    duration: 0.6,
    ease: "easeInOut",
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Hero />
            </motion.div>
          }
        />
        <Route
          path="/guide"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Guide />
            </motion.div>
          }
        />
        <Route
          path="/study-price"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <StudyPrice />
            </motion.div>
          }
        />
          <Route
            path="/viewer"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Viewer />
              </motion.div>
            }
          />
          <Route
            path="/viewer/:guideId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Viewer />
              </motion.div>
            }
          />
          <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
          <Route
          path="/courses"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CoursesUnderConstruction />
            </motion.div>
          }
        />
          <Route
          path="/signup"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Signup />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
