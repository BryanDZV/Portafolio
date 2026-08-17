// src/components/atoms/LottieAnimation.tsx
"use client";

import Lottie from "lottie-react";
import { LottieProps } from "@/types/lottie";

export const LottieAnimation = ({
  animationData,
  className = "",
  loop = true,
  autoplay = true,
}: LottieProps) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full object-contain"
      />
    </div>
  );
};