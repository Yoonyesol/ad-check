"use client";

import { useState, useRef, useEffect } from "react";
import { useCheckmateStore } from "@/lib/store";
import { PixelCharacter, PixelOfficer } from "./pixel-character";
import { ArrowUp, ArrowDown } from "lucide-react";

export function FloatingButton() {
  const { isPanelOpen, openPanel, overallVerdict, analysisStatus } =
    useCheckmateStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showOfficer, setShowOfficer] = useState(false);
  const [officerScale, setOfficerScale] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const characterMood =
    overallVerdict === "warning"
      ? "alert"
      : overallVerdict === "safe"
        ? "happy"
        : "thinking";

  // Officer emerges when problem is detected
  useEffect(() => {
    if (analysisStatus === "complete" && overallVerdict === "warning") {
      setShowOfficer(true);
      // Animate officer emerging from station
      let scale = 0;
      const interval = setInterval(() => {
        scale += 0.1;
        if (scale >= 1) {
          scale = 1;
          clearInterval(interval);
        }
        setOfficerScale(scale);
      }, 50);
      return () => clearInterval(interval);
    } else if (analysisStatus === "idle") {
      setShowOfficer(false);
      setOfficerScale(0);
    }
  }, [analysisStatus, overallVerdict]);

  const getStatusText = () => {
    switch (analysisStatus) {
      case "detecting":
        return "감지중...";
      case "analyzing_transcript":
      case "analyzing_claims":
        return "분석중...";
      case "complete":
        return overallVerdict === "warning" ? "경고!" : "안전";
      default:
        return "";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: position.x, y: position.y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    elementStartPos.current = { x: position.x, y: position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved.current = true;
      }
      setPosition({
        x: elementStartPos.current.x + deltaX,
        y: elementStartPos.current.y + deltaY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartPos.current.x;
      const deltaY = touch.clientY - dragStartPos.current.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved.current = true;
      }
      setPosition({
        x: elementStartPos.current.x + deltaX,
        y: elementStartPos.current.y + deltaY,
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const handleStationClick = () => {
    if (!hasMoved.current) {
      openPanel();
    }
  };

  return (
    <div
      className="fixed right-6 top-1/2 z-30 flex flex-col items-center font-pixel select-none"
      style={{
        transform: `translate(${position.x}px, calc(-50% + ${position.y}px))`,
      }}
    >
      {/* Police Station - Draggable */}
      <div
        ref={dragRef}
        className="relative cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleStationClick}
      >
        <PixelCharacter mood={characterMood} size="lg" />
      </div>

      {/* Police Officer - Emerges from station door */}
      {showOfficer && (
        <div
          className="cursor-pointer transition-transform hover:scale-110 -mt-2"
          style={{
            transform: `scale(${officerScale})`,
            transformOrigin: "top center",
            opacity: officerScale,
          }}
          onClick={openPanel}
        >
          <PixelOfficer mood={characterMood} size="md" />
        </div>
      )}

      {/* Status Text */}
      {analysisStatus !== "idle" && (
        <div
          className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${
            overallVerdict === "warning"
              ? "bg-destructive text-destructive-foreground"
              : overallVerdict === "safe"
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {getStatusText()}
        </div>
      )}
    </div>
  );
}
