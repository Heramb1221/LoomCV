"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker, SketchPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extended preset colors
  const presetColors = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
    "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD",
    "#047857", "#059669", "#10B981", "#34D399", "#6EE7B7",
    "#B91C1C", "#DC2626", "#EF4444", "#F87171", "#FCA5A5",
    "#92400E", "#B45309", "#D97706", "#F59E0B", "#FBBF24",
    "#6B21A8", "#7E22CE", "#9333EA", "#A855F7", "#C084FC",
    "#BE123C", "#E11D48", "#F43F5E", "#FB7185", "#FDA4AF",
  ];

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border bg-background p-3 shadow-lg"
        align="end"
      >
        {!showAdvanced ? (
          <TwitterPicker
            color={color}
            onChange={onChange}
            triangle="top-right"
            colors={presetColors}
          />
        ) : (
          <SketchPicker color={color} onChange={onChange} presetColors={presetColors} />
        )}
        <div className="mt-2 text-center">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Simple Picker" : "Advanced Picker"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
