// components/preference-badges.tsx
"use client";
import React from "react";
import { AVAILABLE_BADGES, type Badge as BadgeType } from "@/lib/system-prompts";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface PreferenceBadgesProps {
  selectedBadges: string[];
  onBadgeToggle: (badgeId: string) => void;
  className?: string;
}

export function PreferenceBadges({ selectedBadges, onBadgeToggle, className }: PreferenceBadgesProps) {
  const groupedBadges = AVAILABLE_BADGES.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<string, BadgeType[]>,
  );

  return (
    <div className={cn("space-y-4", className)}>
      {Object.entries(groupedBadges).map(([category, badges]) => (
        <div key={category} className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {badges.map((badge) => {
              const isSelected = selectedBadges.includes(badge.id);
              return (
                <Button
                  key={badge.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn()}
                  onClick={() => onBadgeToggle(badge.id)}
                  size={"default"}
                >
                  {badge.icon && <badge.icon className={cn()} />}
                  <span className="text-sm font-medium">{badge.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* {selectedBadges.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={() => selectedBadges.forEach(onBadgeToggle)}
            variant={"destructive"}
            className="mx-auto"
          >
            Clear all
          </Button>
        </div>
      )} */}
    </div>
  );
}
