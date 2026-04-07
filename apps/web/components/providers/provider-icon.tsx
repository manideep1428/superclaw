"use client"

import {
  RiAlibabaCloudFill,
  RiAmazonFill,
  RiAnthropicFill,
  RiBaiduFill,
  RiClaudeFill,
  RiGoogleFill,
  RiGrokAiFill,
  RiOpenaiFill,
  RiPerplexityFill,
  RiQwenAiFill,
  RiVercelFill,
  RiZhipuAiFill,
} from "@remixicon/react"
import {
  Bot,
  Building2,
  Cloud,
  Cpu,
  Globe,
  Orbit,
  Puzzle,
  Route,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react"

const ICONS_BY_SLUG: Record<string, React.ElementType> = {
  bedrock: RiAmazonFill,
  anthropic: RiAnthropicFill,
  "cloudflare-ai-gateway": Cloud,
  glm: RiZhipuAiFill,
  google: RiGoogleFill,
  groq: Zap,
  huggingface: Bot,
  kilocode: Workflow,
  litellm: Route,
  minimax: Orbit,
  mistral: Sparkles,
  modelstudio: RiAlibabaCloudFill,
  moonshot: Sparkles,
  nvidia: Cpu,
  openai: RiOpenaiFill,
  opencode: Workflow,
  openrouter: Route,
  "perplexity-provider": RiPerplexityFill,
  qianfan: RiBaiduFill,
  qwen: RiQwenAiFill,
  together: Globe,
  "vercel-ai-gateway": RiVercelFill,
  venice: Sparkles,
  volcengine: Cloud,
  xai: RiGrokAiFill,
  xiaomi: Building2,
  zai: RiClaudeFill,
}

export function ProviderIcon({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const Icon = ICONS_BY_SLUG[slug] || Puzzle

  return <Icon className={className} />
}
