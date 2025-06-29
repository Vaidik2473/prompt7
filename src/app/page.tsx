/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { PreferenceBadges } from "@/components/preference-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiArrowElbowUpLeft, PiArrowElbowUpRight, PiStarFourBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [response, setResponse] = useState<any>(null);

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges((prev) => (prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/aisdk/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            selectedBadges,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);
        // setResponse(data);
        setPrompt(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Failed to submit form:", errorMessage);
        setResponse({ error: errorMessage });
      }
    });
  };

  return (
    <main className="container mx-auto flex min-h-[calc(100dvh-5rem)] max-w-4xl items-center space-y-6 py-8">
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
                    <Button size="icon" variant={"outline"} className="rounded-full">
                      <PiArrowElbowUpLeft className="size-5" />
                    </Button>
                    <Button size="icon" variant={"outline"} className="rounded-full">
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

            {/* Response Section */}
            {response && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Enhanced Prompt
                    <CopyButton text={response} className="flex-shrink-0" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {response.error ? (
                    <div className="rounded-md bg-red-50 p-4 text-red-600">
                      <p className="font-medium">Error:</p>
                      <p>{response.error}</p>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <div className="rounded-md border bg-gray-50 p-4">
                        <p className="leading-relaxed whitespace-pre-wrap text-gray-800">{response}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
