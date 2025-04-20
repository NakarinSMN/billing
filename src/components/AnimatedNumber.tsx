// src/components/AnimatedNumber.tsx
"use client";

import { useEffect, useState } from "react";
import {
  useMotionValue,
  useSpring,
  animate,
  useMotionValueEvent,
} from "framer-motion";

export default function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
  });

  const [displayValue, setDisplayValue] = useState("0.00");

  useMotionValueEvent(springValue, "change", (latest) => {
    setDisplayValue(
      latest.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  });

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.4 });
    return controls.stop;
  }, [value]);

  return <span>{displayValue}</span>;
  
}
