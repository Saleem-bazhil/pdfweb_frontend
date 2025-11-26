import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import api from "../Api"; // axios instance
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(4, "Minimum 4 characters required")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await api.post("/auth/register", values);

        console.log("Signup success:", res.data);
        alert("Account created successfully!");
        navigate("/login");
      } catch (error) {
        console.error("REGISTER ERROR:", error);
        const message =
          error.response?.data?.message || "Something went wrong. Try again.";
        setErrors({ general: message });
        alert(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Create <span className="text-blue-600">Your Account</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Register using your email and password.
              </p>
            </div>

            {/* 🔹 Show backend error */}
            {formik.errors.general && (
              <p className="mb-4 text-center text-sm text-red-500">
                {formik.errors.general}
              </p>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className={`w-full border rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full border rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className={`w-full border rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={formik.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-70"
              >
                {formik.isSubmitting ? "Creating..." : "Create Account"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
