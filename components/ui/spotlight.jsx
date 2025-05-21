// components/ui/spotlight.jsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { cn } from "../utils/cn";

export const Spotlight = ({
  className,
  fill = "white",
}) => {
  const divRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (divRef.current) {
      const div = divRef.current;
      const rect = div.getBoundingClientRect();
      
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("mousemove", handleMouseMove);
      div.addEventListener("mouseenter", handleMouseEnter);
      div.addEventListener("mouseleave", handleMouseLeave);
      
      return () => {
        div.removeEventListener("mousemove", handleMouseMove);
        div.removeEventListener("mouseenter", handleMouseEnter);
        div.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 h-screen w-full overflow-hidden",
        className
      )}
      ref={divRef}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${fill}10, transparent 40%)`,
          opacity,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
};