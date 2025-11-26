import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../Api"; // 🔹 Axios instance (or replace with fetch)
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(4, "Minimum 4 characters required")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // 🔹 Call your backend: POST /auth/login
        const res = await api.post("/auth/login", values);

        console.log("Login success:", res.data);

        // 🔹 Save token & user info (adjust as you like)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful!");
        // e.g. navigate to dashboard
        navigate("/");
      } catch (error) {
        console.error("LOGIN ERROR:", error);
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
                Secure <span className="text-blue-600">Study Login</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Login using your registered email and password.
              </p>
            </div>

            {/* 🔹 Global error from backend */}
            {formik.errors.general && (
              <p className="mb-4 text-center text-sm text-red-500">
                {formik.errors.general}
              </p>
            )}

            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4 sm:space-y-6"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full border rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  autoComplete="email"
                  aria-label="Email address"
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
                  placeholder="Enter your password"
                  className={`w-full border rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  autoComplete="current-password"
                  aria-label="Password"
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-70"
              >
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Login;
