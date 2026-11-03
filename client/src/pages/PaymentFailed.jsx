import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 h-20 w-20 rounded-full bg-red-100 flex items-center justify-center"
        >
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="mt-2 text-gray-500">
          Something went wrong, or the payment was cancelled. No money was deducted.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/pricing")}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentFailed;