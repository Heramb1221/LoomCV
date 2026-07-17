"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const ATS_SCORER_URL = process.env.NEXT_PUBLIC_ATS_SCORER_URL || "https://ats.loomcv.app";

export function AtsScoreButton({ resumeId }: { resumeId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/internal/ats-handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });
      const { token } = await res.json();
      window.open(`${ATS_SCORER_URL}?token=${token}`, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      className="hidden md:inline-flex items-center gap-2"
      title="Opens the ATS Scorer in a new tab — requires local AI setup"
    >
      <Sparkles className="size-4 text-primary" />
      {loading ? "Opening…" : "Check ATS Score"}
    </Button>
  );
}
