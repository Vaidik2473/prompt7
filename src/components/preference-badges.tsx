// components/preference-badges.tsx
"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  AVAILABLE_BADGES,
  type Badge as BadgeType,
} from "@/lib/system-prompts";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface PreferenceBadgesProps {
  selectedBadges: string[];
  onBadgeToggle: (badgeId: string) => void;
  className?: string;
}

export function PreferenceBadges({
  selectedBadges,
  onBadgeToggle,
  className,
}: PreferenceBadgesProps) {
  const groupedBadges = AVAILABLE_BADGES.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, BadgeType[]>);

  const categoryLabels = {
    "ai-model": "AI Models",
    platform: "Platforms",
    tone: "Tone & Style",
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Enhancement Preferences
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Select preferences to customize how your prompt is enhanced
        </p>
      </div>

      {Object.entries(groupedBadges).map(([category, badges]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
              const isSelected = selectedBadges.includes(badge.id);
              return (
                <Button
                  key={badge.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn()}
                  onClick={() => onBadgeToggle(badge.id)}
                >
                  {badge.icon && <badge.icon className={cn()} />}
                  <span className="text-sm font-medium">{badge.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedBadges.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {selectedBadges.length} preference
              {selectedBadges.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => selectedBadges.forEach(onBadgeToggle)}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
