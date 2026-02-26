import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  animationDelay?: number;
  visible?: boolean;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  animationDelay = 0,
  visible = false,
}: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl border p-6 shadow-sm transition-all duration-500 cursor-default
        ${visible ? "animate-feature-card" : "opacity-0"}
        ${hovered ? "border-au-red shadow-card-hover -translate-y-1" : "border-red-100 hover:border-red-200"}
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
          ${hovered ? "bg-au-red scale-110 rotate-3" : "bg-red-50"}
        `}
      >
        <Icon
          size={22}
          className={`transition-colors duration-300 ${hovered ? "text-white" : "text-au-red"}`}
        />
      </div>

      <h3
        className={`text-base font-semibold mb-2 transition-colors duration-300 ${
          hovered ? "text-au-red" : "text-au-navy"
        }`}
      >
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
