/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { PreferenceBadges } from "@/components/preference-badges";
import { PiArrowElbowUpLeft, PiArrowElbowUpRight, PiStarFourBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  type: "request" | "response";
  text: string;
}

export default function HomePage() {
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges((prev) => (prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]));
  };

  const handleHistoryNavigation = (direction: "back" | "forward") => {
    if (direction === "back" && currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setPrompt(history[newIndex].text);
    } else if (direction === "forward" && currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setPrompt(history[newIndex].text);
    }
  };

  const addToHistory = (request: string, response: string) => {
    const newEntries: HistoryEntry[] = [
      { type: "request", text: request },
      { type: "response", text: response },
    ];

    setHistory((prev) => [...prev, ...newEntries]);
    setCurrentHistoryIndex((prev) => prev + 2); // Move to the response entry
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const originalPrompt = prompt; // Store the original prompt

    startTransition(async () => {
      try {
        const res = await fetch("/api/aisdk/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: originalPrompt,
            selectedBadges,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        // Add to history (request and response)
        addToHistory(originalPrompt, data);

        // setResponse(data);
        setPrompt(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Failed to submit form:", errorMessage);
        setResponse({ error: errorMessage });
      }
    });
  };

  const canGoBack = currentHistoryIndex > 0;
  const canGoForward = currentHistoryIndex < history.length - 1;

  return (
    <main className="container mx-auto flex min-h-[calc(100dvh-5rem)] max-w-4xl items-center space-y-6 p-4 py-8">
      <section className="my-auto h-fit w-full pb-40">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-light">Prompt Enhancer</h1>
        </div>

        <div className="gap-6">
          {/* Input Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-6">
              <div className="relative">
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write a blog post about  artificial intelligence..."
                  className="border-border/70 mt-2 min-h-[120px] !rounded-2xl !rounded-b-none border bg-white p-4 dark:bg-white/10"
                  required
                />
                <div className="flex justify-between gap-1 rounded-b-2xl bg-white p-4 dark:bg-white/10">
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant={"outline"}
                      className="rounded-full"
                      onClick={() => handleHistoryNavigation("back")}
                      disabled={!canGoBack}
                    >
                      <PiArrowElbowUpLeft className="size-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant={"outline"}
                      className="rounded-full"
                      onClick={() => handleHistoryNavigation("forward")}
                      disabled={!canGoForward}
                    >
                      <PiArrowElbowUpRight className="size-5" />
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    <CopyButton text={prompt} className="rounded-full" />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }}
                      disabled={isPending || !prompt.trim()}
                      size="icon"
                      className="rounded-full"
                    >
                      <PiStarFourBold className={cn("size-5", isPending ? "animate-spin" : "")} />
                    </Button>
                  </div>
                </div>
              </div>

              <PreferenceBadges selectedBadges={selectedBadges} onBadgeToggle={handleBadgeToggle} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
