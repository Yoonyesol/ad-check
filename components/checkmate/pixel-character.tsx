"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface PixelCharacterProps {
  className?: string;
  mood?: "neutral" | "alert" | "happy" | "thinking";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

// 경찰서 이미지 컴포넌트
export function PixelCharacter({
  className,
  mood = "neutral",
  size = "xl",
}: PixelCharacterProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-48 h-48",
    "2xl": "w-64 h-64",
    "3xl": "w-80 h-80",
    "4xl": "w-96 h-96",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image
        src="/police-station.png"
        alt="Checkmate 경찰서"
        fill
        className="object-contain scale-[1.8] pointer-events-none"
        unoptimized
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

// 경찰 캐릭터 이미지 컴포넌트
export function PixelOfficer({
  className,
  mood = "neutral",
  size = "md",
}: PixelCharacterProps) {
  const sizeClasses = {
    sm: "w-10 h-14",
    md: "w-16 h-24",
    lg: "w-24 h-36",
    xl: "w-32 h-48",
    "2xl": "w-48 h-72",
    "3xl": "w-56 h-84",
    "4xl": "w-64 h-96",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image
        src="/sheriff.gif"
        alt="Checkmate 보안관"
        fill
        className="object-contain"
        unoptimized
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
