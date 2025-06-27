// lib/system-prompts.ts
import {
  PiRobotDuotone,
  PiMagicWandDuotone,
  PiSparkleDuotone,
  PiEnvelopeDuotone,
  PiWhatsappLogoDuotone,
  PiSlackLogoDuotone,
  PiTwitterLogoDuotone,
  PiLinkedinLogoDuotone,
  PiSmileyDuotone,
  PiGearDuotone,
  PiTextIndentDuotone,
  PiCodeDuotone,
  PiHeartDuotone,
} from "react-icons/pi";

export interface Badge {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  category: "ai-model" | "platform" | "tone";
}

export const AVAILABLE_BADGES: Badge[] = [
  // AI Models
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: PiRobotDuotone,
    category: "ai-model",
  },
  {
    id: "claude",
    label: "Claude",
    icon: PiMagicWandDuotone,
    category: "ai-model",
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: PiSparkleDuotone,
    category: "ai-model",
  },
  {
    id: "lovable",
    label: "Lovable",
    icon: PiCodeDuotone,
    category: "ai-model",
  },
  {
    id: "v0",
    label: "v0",
    icon: PiHeartDuotone,
    category: "ai-model",
  },
  // Platforms
  {
    id: "email",
    label: "Email",
    icon: PiEnvelopeDuotone,
    category: "platform",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: PiWhatsappLogoDuotone,
    category: "platform",
  },
  {
    id: "slack",
    label: "Slack",
    icon: PiSlackLogoDuotone,
    category: "platform",
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: PiTwitterLogoDuotone,
    category: "platform",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: PiLinkedinLogoDuotone,
    category: "platform",
  },
  // Tone/Style
  {
    id: "professional",
    label: "Professional",
    icon: PiTextIndentDuotone,
    category: "tone",
  },
  { id: "casual", label: "Casual", icon: PiSmileyDuotone, category: "tone" },
  {
    id: "technical",
    label: "Technical",
    icon: PiGearDuotone,
    category: "tone",
  },
];

const ENHANCED_BASE_PROMPT = `You are a master prompt enhancer. Take the user's input prompt and improve it following these rules:
  
  CRITICAL: Return only the enhanced prompt as a plain string - no explanations, JSON, or formatting.
  
  Enhancement Rules:
  1. Keep the original meaning and intent exactly the same
  2. Make the prompt more specific and clear  
  3. Add necessary context without changing the core request
  4. Improve grammar and structure
  5. Make instructions more actionable
  6. Add relevant constraints or success criteria
  7. Specify desired output format when beneficial
  8. Remove ambiguity while staying concise
  9. Maintain the original tone and style
  10. Ensure the enhanced prompt works immediately without modification`;

const BADGE_MODIFIERS: Record<string, string> = {
  // AI Models
  chatgpt:
    "Enhance the prompt to use conversational language, include step-by-step reasoning when needed, and leverage ChatGPT's memory for context. Add role-based instructions if beneficial.",

  claude:
    "Enhance the prompt with detailed context, logical structure, and clear constraints. Make it analytical and systematic for Claude's reasoning capabilities.",

  gemini:
    "Enhance the prompt for factual accuracy and logical reasoning. Include specific formatting requirements and leverage Gemini's strength with structured data and multimodal content.",

  lovable:
    "Enhance the prompt with specific technical requirements, clear constraints, and project context. Structure for Lovable's iterative development workflow and component-based approach.",

  v0: "Enhance the prompt for UI/component generation with specific design requirements, responsive considerations, and Next.js/React best practices. Include accessibility and modern web standards.",

  // Platforms
  email:
    "Enhance the prompt for email communication by adding recipient context, appropriate tone specification, clear call-to-action, and mobile-friendly formatting considerations.",

  whatsapp:
    "Enhance the prompt for WhatsApp by making it conversational, mobile-optimized, and encouraging brief, engaging responses with appropriate informality.",

  slack:
    "Enhance the prompt for Slack workspace communication with professional team context, threading considerations, and integration with workflow tools.",

  twitter:
    "Enhance the prompt for Twitter by adding engagement focus, character efficiency, and viral potential while maintaining the core message.",

  linkedin:
    "Enhance the prompt for LinkedIn's professional networking context with industry-specific language and thought leadership tone.",

  // Tone/Style
  professional:
    "Enhance the prompt to maintain formal, authoritative tone while ensuring clarity and respectful communication standards.",

  casual:
    "Enhance the prompt to be conversational and approachable while maintaining the core professional message and clarity.",

  technical:
    "Enhance the prompt with precise technical language, specific constraints, and implementation details appropriate for technical audiences.",
};

export function generateSystemPrompt(selectedBadges: string[]): string {
  let systemPrompt = ENHANCED_BASE_PROMPT;

  if (selectedBadges.length > 0) {
    systemPrompt +=
      "\n\nAdditional enhancement considerations based on selected preferences:";
    selectedBadges.forEach((badgeId) => {
      if (BADGE_MODIFIERS[badgeId]) {
        systemPrompt += `\n- ${BADGE_MODIFIERS[badgeId]}`;
      }
    });
  }

  return systemPrompt;
}

// Utility patterns for reference (not used in system prompt generation)
export const COMMON_PATTERNS = {
  STEP_BY_STEP: "Think through this step-by-step:",
  ROLE_BASED: "Act as a [role] and",
  WITH_EXAMPLES: "Here are examples of the desired output:",
  FORMAT_SPECIFIC: "Present the response as a [format]:",
};
