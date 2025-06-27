"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { PreferenceBadges } from "@/components/preference-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [response, setResponse] = useState<any>(null);

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
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
        setResponse(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Failed to submit form:", errorMessage);
        setResponse({ error: errorMessage });
      }
    });
  };

  return (
    <main className="max-w-4xl container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Prompt Enhancer
        </h1>
        <p className="text-gray-600">
          Enhance your prompts with AI-powered improvements and customizable
          preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Enter your prompt to enhance
                </Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write a blog post about artificial intelligence..."
                  className="mt-2 min-h-[120px]"
                  required
                />
              </div>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any);
                }}
                disabled={isPending || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isPending ? "Enhancing..." : "Enhance Prompt"}
              </Button>
            </CardContent>
          </Card>

          {/* Response Section */}
          {response && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Enhanced Prompt
                  <CopyButton text={response} className="flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {response.error ? (
                  <div className="text-red-600 p-4 bg-red-50 rounded-md">
                    <p className="font-medium">Error:</p>
                    <p>{response.error}</p>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {response}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preferences Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <PreferenceBadges
                selectedBadges={selectedBadges}
                onBadgeToggle={handleBadgeToggle}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
