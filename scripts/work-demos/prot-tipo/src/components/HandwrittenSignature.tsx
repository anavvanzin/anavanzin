import React from "react";
import { motion } from "motion/react";

interface Props {
  counselorId: string;
}

export default function HandwrittenSignature({ counselorId }: Props) {
  // Define custom SVGs representing stylized cursive signatures
  // We'll use multiple intersecting bezier curves to simulate handwriting
  const getSignatureSvg = (id: string) => {
    switch (id) {
      case "lucas_mendes":
        return (
          <svg className="w-48 h-16 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.65)]" viewBox="0 0 150 50" fill="none">
            {/* L */}
            <motion.path
              d="M 12,38 C 10,25 22,2 24,6 C 26,10 14,40 18,42 C 22,44 28,34 32,32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.95, ease: "easeInOut" }}
            />
            {/* ucas */}
            <motion.path
              d="M 32,32 C 34,26 36,25 38,34 C 40,36 42,32 44,28 C 46,26 48,27 50,33 C 51,35 52,36 53,30 C 54,25 57,28 60,34 M 60,30 C 62,35 64,36 67,31 C 69,27 68,36 71,33"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.25, ease: "easeInOut" }}
            />
            {/* M */}
            <motion.path
              d="M 80,36 C 78,12 85,10 87,22 C 89,32 94,15 96,25 C 98,34 102,18 104,32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            />
            {/* endes */}
            <motion.path
              d="M 104,32 C 106,28 108,28 110,34 C 111,36 113,32 115,29 C 117,26 118,29 120,33 C 122,35 125,10 126,20 C 127,24 126,35 130,32 M 130,28 C 132,32 135,33 138,29 L 145,28"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.75, ease: "easeInOut" }}
            />
            {/* Elegant underscore line */}
            <motion.path
              d="M 15,44 Q 85,38 142,43"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, delay: 1.2, ease: "easeOut" }}
            />
          </svg>
        );

      case "clara_santos":
        return (
          <svg className="w-48 h-16 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.65)]" viewBox="0 0 150 50" fill="none">
            {/* C */}
            <motion.path
              d="M 28,15 C 24,10 12,12 11,26 C 10,37 20,44 26,42 C 30,40 28,34 26,34"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            />
            {/* lara */}
            <motion.path
              d="M 26,34 C 28,18 29,15 31,34 C 32,36 34,28 37,28 C 39,28 41,36 43,34 C 45,30 47,20 48,34 C 50,33 53,28 55,33 "
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
            />
            {/* Santos */}
            <motion.path
              d="M 68,16 C 63,16 64,25 74,27 C 82,29 80,41 72,40 C 67,40 68,36 71,36 L 73,36 C 76,26 78,25 80,36 M 80,32 C 82,27 84,28 86,34 C 88,36 91,24 93,31 C 95,35 96,28 99,35 M 99,25 Q 98,40 102,32 C 104,26 107,36 112,34 M 112,28 C 114,32 116,33 119,30 C 122,26 126,38 132,34"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.65, ease: "easeInOut" }}
            />
            {/* Decorative loop */}
            <motion.path
              d="M 125,36 Q 138,42 144,32 T 132,25"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 1.3, ease: "easeOut" }}
            />
          </svg>
        );

      case "ricardo_hahn":
        return (
          <svg className="w-48 h-16 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.65)]" viewBox="0 0 150 50" fill="none">
            {/* R */}
            <motion.path
              d="M 14,40 L 14,8 C 14,8 32,2 32,18 C 32,24 20,26 14,26 L 30,42"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
            {/* icardo */}
            <motion.path
              d="M 30,42 C 32,38 34,32 35,35 C 37,38 38,34 40,32 C 42,30 43,31 45,36 C 46,38 48,22 49,32 C 50,35 52,35 54,30 C 56,26 58,26 60,35 L 67,34"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
            />
            {/* Hahn */}
            <motion.path
              d="M 85,6 L 81,42 M 81,22 L 95,18 M 95,8 L 94,40 M 94,28 C 96,24 98,24 100,34 M 100,30 C 102,25 104,26 106,34 M 106,30 C 108,25 110,26 112,35 L 118,34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
            />
            {/* Stamp strike line */}
            <motion.path
              d="M 10,20 L 142,22"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
            />
          </svg>
        );

      case "arnaldo_rocha":
        return (
          <svg className="w-48 h-16 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.65)]" viewBox="0 0 150 50" fill="none">
            {/* A */}
            <motion.path
              d="M 12,42 L 25,6 L 36,40 M 18,28 L 32,28"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.95, ease: "easeInOut" }}
            />
            {/* rnaldo */}
            <motion.path
              d="M 36,40 C 37,36 39,32 41,35 C 43,38 45,34 47,31 C 49,28 50,30 52,36 C 53,38 55,20 56,36 C 58,35 60,30 62,35 L 68,34"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.05, delay: 0.45, ease: "easeInOut" }}
            />
            {/* Rocha */}
            <motion.path
              d="M 85,12 C 81,10 74,18 73,28 C 72,36 78,42 84,40 C 88,38 85,28 88,28 C 91,28 92,36 94,33 C 96,30 98,20 99,35 M 99,31 C 101,26 103,27 105,33 C 107,35 110,24 112,31 C 114,35 116,28 120,35 L 126,34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.8, ease: "easeInOut" }}
            />
            {/* Swish under */}
            <motion.path
              d="M 75,44 Q 100,50 142,42 T 132,32"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, delay: 1.35, ease: "easeOut" }}
            />
          </svg>
        );

      default:
        return (
          <svg className="w-48 h-10 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" viewBox="0 0 150 40" fill="none">
            <motion.path
              d="M 20,20 Q 75,10 130,20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 bg-slate-950/20 rounded-lg border border-dashed border-amber-500/10 hover:border-amber-500/25 transition duration-300">
      {getSignatureSvg(counselorId)}
    </div>
  );
}
