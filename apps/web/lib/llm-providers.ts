import { buildExternalDocsUrl } from "@/lib/docs"
import type { ExtensionField, ExtensionSetupMode } from "@/lib/extensions"

export type ProviderCategoryId = "api" | "gateway" | "platform" | "specialized"

export interface ProviderDefinition {
  slug: string
  title: string
  description: string
  category: ProviderCategoryId
  accent: string
  tags: string[]
  setupMode: ExtensionSetupMode
  configFields: ExtensionField[]
  docsPath: string
}

export const LLM_PROVIDER_CATEGORIES: {
  id: ProviderCategoryId
  label: string
  description: string
}[] = [
  {
    id: "api",
    label: "Direct APIs",
    description:
      "Direct vendor endpoints for foundation models such as OpenAI, Anthropic, Google, and xAI.",
  },
  {
    id: "gateway",
    label: "Gateways",
    description:
      "Hosted routing layers and unified catalogs that sit in front of one or more upstream providers.",
  },
  {
    id: "platform",
    label: "Platforms",
    description:
      "Cloud platforms where model access is part of a broader infrastructure stack.",
  },
  {
    id: "specialized",
    label: "Specialized",
    description:
      "Search-grounded or region-specific providers that still ship through OpenClaw's model layer.",
  },
]

export const EXCLUDED_PROVIDER_LABELS = [
  "Ollama",
  "SGLang",
  "vLLM",
  "Claude Max API Proxy",
  "Deepgram",
] as const

function textField(
  key: string,
  label: string,
  placeholder: string,
  helperText?: string,
  required = true
): ExtensionField {
  return {
    key,
    label,
    type: "text",
    placeholder,
    helperText,
    required,
  }
}

function passwordField(
  key: string,
  label: string,
  placeholder: string,
  helperText?: string,
  required = true
): ExtensionField {
  return {
    key,
    label,
    type: "password",
    placeholder,
    helperText,
    required,
  }
}

function urlField(
  key: string,
  label: string,
  placeholder: string,
  helperText?: string,
  required = true
): ExtensionField {
  return {
    key,
    label,
    type: "url",
    placeholder,
    helperText,
    required,
  }
}

function selectField(
  key: string,
  label: string,
  options: { label: string; value: string }[],
  helperText?: string,
  defaultValue?: string
): ExtensionField {
  return {
    key,
    label,
    type: "select",
    options,
    helperText,
    defaultValue,
  }
}

function provider(
  definition: Omit<ProviderDefinition, "docsPath"> & { docsSlug?: string }
): ProviderDefinition {
  const docsSlug = definition.docsSlug ?? definition.slug

  return {
    ...definition,
    docsPath: `${buildExternalDocsUrl(["providers"])}#${docsSlug}`,
  }
}

const defaultModelField = (placeholder: string, helperText?: string) =>
  textField(
    "defaultModel",
    "Default model",
    placeholder,
    helperText ?? "Optional local default saved only in this browser.",
    false
  )

const baseUrlField = (placeholder: string, helperText?: string) =>
  urlField(
    "baseUrl",
    "Base URL override",
    placeholder,
    helperText ?? "Leave blank unless you need to override the provider endpoint.",
    false
  )

export const LLM_PROVIDERS: ProviderDefinition[] = [
  provider({
    slug: "bedrock",
    title: "Amazon Bedrock",
    description:
      "Use Claude and other managed foundation models through AWS Bedrock.",
    category: "platform",
    accent: "#FF9900",
    tags: ["AWS", "Managed", "Multi-model"],
    setupMode: "service-account",
    configFields: [
      textField("accessKeyId", "Access key ID", "AKIA..."),
      passwordField("secretAccessKey", "Secret access key", "AWS secret"),
      textField("region", "Region", "us-east-1"),
      defaultModelField("amazon-bedrock/us.anthropic.claude-opus-4-6-v1:0"),
    ],
  }),
  provider({
    slug: "anthropic",
    title: "Anthropic",
    description:
      "Direct Claude API access with OpenClaw's native Anthropic integration.",
    category: "api",
    accent: "#D97706",
    tags: ["Claude", "API key", "Native"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "sk-ant-..."),
      defaultModelField("anthropic/claude-sonnet-4-6"),
    ],
  }),
  provider({
    slug: "cloudflare-ai-gateway",
    title: "Cloudflare AI Gateway",
    description:
      "Route model traffic through Cloudflare's managed AI Gateway layer.",
    category: "gateway",
    accent: "#F97316",
    tags: ["Gateway", "Managed routing", "Cloudflare"],
    setupMode: "token",
    configFields: [
      textField("accountId", "Account ID", "Cloudflare account ID"),
      textField("gatewayId", "Gateway ID", "my-gateway"),
      passwordField("apiKey", "API key", "Cloudflare gateway key"),
      defaultModelField("cloudflare-ai-gateway/anthropic/claude-opus-4-6"),
    ],
  }),
  provider({
    slug: "glm",
    title: "GLM Models",
    description:
      "Connect to GLM-family models from the OpenClaw provider directory.",
    category: "api",
    accent: "#2563EB",
    tags: ["GLM", "API key", "Reasoning"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "glm-api-key"),
      defaultModelField("glm/glm-4.6"),
      baseUrlField("https://open.bigmodel.cn/api/paas/v4"),
    ],
  }),
  provider({
    slug: "google",
    title: "Google (Gemini)",
    description:
      "Direct Gemini access through Google's hosted model APIs.",
    category: "api",
    accent: "#34A853",
    tags: ["Gemini", "Google", "Vision"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "AIza..."),
      defaultModelField("google/gemini-2.5-pro"),
    ],
  }),
  provider({
    slug: "groq",
    title: "Groq",
    description:
      "Low-latency LPU-backed inference with OpenClaw's Groq provider.",
    category: "api",
    accent: "#D946EF",
    tags: ["Fast", "Inference", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "gsk_..."),
      defaultModelField("groq/llama-4-scout"),
    ],
  }),
  provider({
    slug: "huggingface",
    title: "Hugging Face",
    description:
      "Hosted inference and model access through Hugging Face endpoints.",
    category: "api",
    accent: "#F59E0B",
    tags: ["Inference", "Hub", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "Access token", "hf_..."),
      defaultModelField("huggingface/meta-llama/Llama-4-Scout"),
    ],
  }),
  provider({
    slug: "kilocode",
    title: "Kilocode",
    description:
      "Gateway-style provider catalog that can expose Anthropic and other model families.",
    category: "gateway",
    accent: "#7C3AED",
    tags: ["Gateway", "Catalog", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "kilocode-key"),
      defaultModelField("kilocode/anthropic/claude-opus-4-6"),
      baseUrlField("https://api.kilocode.ai"),
    ],
  }),
  provider({
    slug: "litellm",
    title: "LiteLLM",
    description:
      "Unified gateway that fronts many providers behind an OpenAI-compatible API.",
    category: "gateway",
    accent: "#0F766E",
    tags: ["Gateway", "OpenAI-compatible", "Routing"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "Virtual key", "sk-litellm-..."),
      baseUrlField("https://litellm.example.com/v1"),
      defaultModelField("litellm/claude-opus-4-6"),
    ],
  }),
  provider({
    slug: "minimax",
    title: "MiniMax",
    description:
      "MiniMax APIs through the native or compatibility layers documented by OpenClaw.",
    category: "api",
    accent: "#EF4444",
    tags: ["API key", "China", "Multi-endpoint"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "minimax-key"),
      selectField(
        "region",
        "Region",
        [
          { label: "Global", value: "global" },
          { label: "China", value: "cn" },
        ],
        "Choose the portal region you intend to use.",
        "global"
      ),
      defaultModelField("minimax/minimax-m2.5"),
    ],
  }),
  provider({
    slug: "mistral",
    title: "Mistral",
    description:
      "Direct Mistral API access through OpenClaw's provider adapter.",
    category: "api",
    accent: "#2563EB",
    tags: ["API key", "Direct", "Reasoning"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "mistral-..."),
      defaultModelField("mistral/mistral-large"),
    ],
  }),
  provider({
    slug: "modelstudio",
    title: "Model Studio",
    description:
      "Alibaba Cloud Model Studio provider as documented by OpenClaw.",
    category: "platform",
    accent: "#0EA5E9",
    tags: ["Alibaba Cloud", "Platform", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "model-studio-key"),
      defaultModelField("modelstudio/qwen-max"),
      baseUrlField("https://dashscope.aliyuncs.com/compatible-mode/v1"),
    ],
  }),
  provider({
    slug: "moonshot",
    title: "Moonshot AI",
    description:
      "Moonshot and Kimi model access using the Moonshot provider path.",
    category: "api",
    accent: "#9333EA",
    tags: ["Kimi", "API key", "Moonshot"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "moonshot-key"),
      defaultModelField("moonshot/kimi-k2"),
      baseUrlField("https://api.moonshot.ai/v1"),
    ],
  }),
  provider({
    slug: "nvidia",
    title: "NVIDIA",
    description:
      "Hosted model access through NVIDIA's inference endpoints.",
    category: "platform",
    accent: "#84CC16",
    tags: ["NVIDIA", "Hosted", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "nvapi-..."),
      defaultModelField("nvidia/llama-3.3-nemotron-super-49b-v1"),
    ],
  }),
  provider({
    slug: "openai",
    title: "OpenAI",
    description:
      "OpenAI API and Codex-family access through the direct OpenClaw provider.",
    category: "api",
    accent: "#10A37F",
    tags: ["GPT", "Codex", "Responses API"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "sk-proj-..."),
      defaultModelField("openai/gpt-5.4"),
    ],
  }),
  provider({
    slug: "opencode",
    title: "OpenCode",
    description:
      "Unified OpenCode provider with Zen and Go-backed catalogs.",
    category: "gateway",
    accent: "#1D4ED8",
    tags: ["Gateway", "Catalog", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "opencode-key"),
      defaultModelField("opencode/claude-opus-4-6"),
    ],
  }),
  provider({
    slug: "openrouter",
    title: "OpenRouter",
    description:
      "Multi-provider routing with vendor-prefixed model references through OpenRouter.",
    category: "gateway",
    accent: "#2563EB",
    tags: ["Routing", "Catalog", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "sk-or-..."),
      defaultModelField(
        "openrouter/anthropic/claude-sonnet-4-6",
        "Use vendor-prefixed refs when you want strict routing."
      ),
    ],
  }),
  provider({
    slug: "perplexity-provider",
    docsSlug: "perplexity-provider",
    title: "Perplexity",
    description:
      "Web-grounded responses and search-backed model access through the Perplexity provider.",
    category: "specialized",
    accent: "#14B8A6",
    tags: ["Search", "Grounded", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "pplx-..."),
      defaultModelField("perplexity/sonar-pro"),
    ],
  }),
  provider({
    slug: "qianfan",
    title: "Qianfan",
    description:
      "Baidu Qianfan access using the provider setup documented in OpenClaw.",
    category: "platform",
    accent: "#1D4ED8",
    tags: ["Baidu", "Platform", "Dual key"],
    setupMode: "service-account",
    configFields: [
      textField("accessKey", "Access key", "Qianfan access key"),
      passwordField("secretKey", "Secret key", "Qianfan secret key"),
      defaultModelField("qianfan/ernie-4.5-turbo"),
    ],
  }),
  provider({
    slug: "qwen",
    title: "Qwen",
    description:
      "Qwen OAuth-backed access using the dedicated OpenClaw provider flow.",
    category: "api",
    accent: "#F97316",
    tags: ["OAuth", "Qwen", "Alibaba"],
    setupMode: "oauth",
    configFields: [
      textField(
        "accountLabel",
        "Account label",
        "work-qwen",
        "Optional local label for the OAuth account you plan to connect.",
        false
      ),
      defaultModelField(
        "qwen/qwen-max",
        "OpenClaw handles the real OAuth flow outside this frontend."
      ),
    ],
  }),
  provider({
    slug: "together",
    title: "Together AI",
    description:
      "Hosted open and proprietary model access through Together AI.",
    category: "api",
    accent: "#8B5CF6",
    tags: ["Hosted", "Inference", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "together-key"),
      defaultModelField("together/meta-llama/Llama-4-Scout"),
    ],
  }),
  provider({
    slug: "vercel-ai-gateway",
    title: "Vercel AI Gateway",
    description:
      "Managed gateway routing with provider-prefixed model identifiers.",
    category: "gateway",
    accent: "#111827",
    tags: ["Gateway", "Managed", "Vercel"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "vercel-ai-gateway-key"),
      defaultModelField("vercel-ai-gateway/anthropic/claude-opus-4.6"),
    ],
  }),
  provider({
    slug: "venice",
    title: "Venice",
    description:
      "Privacy-focused Venice AI provider with OpenClaw model mappings.",
    category: "specialized",
    accent: "#7C3AED",
    tags: ["Privacy", "Hosted", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "venice-key"),
      defaultModelField("venice/openai-gpt-54"),
    ],
  }),
  provider({
    slug: "volcengine",
    title: "Volcengine",
    description:
      "Volcengine / Doubao provider support from the OpenClaw directory.",
    category: "platform",
    accent: "#DC2626",
    tags: ["Doubao", "Platform", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "volcengine-key"),
      defaultModelField("volcengine/doubao-1.5-pro"),
    ],
  }),
  provider({
    slug: "xai",
    title: "xAI",
    description:
      "Direct xAI provider support, including web-grounded response workflows.",
    category: "api",
    accent: "#111827",
    tags: ["Grok", "API key", "Realtime"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "xai-..."),
      defaultModelField("xai/grok-4"),
    ],
  }),
  provider({
    slug: "xiaomi",
    title: "Xiaomi",
    description:
      "Xiaomi-hosted model endpoints using OpenAI-compatible transport.",
    category: "specialized",
    accent: "#EA580C",
    tags: ["Regional", "OpenAI-compatible", "API key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "xiaomi-key"),
      defaultModelField("xiaomi/mi-llm"),
      baseUrlField("https://api.mi.com/openai/v1"),
    ],
  }),
  provider({
    slug: "zai",
    title: "Z.AI",
    description:
      "Z.AI provider support from the OpenClaw provider directory.",
    category: "specialized",
    accent: "#0F766E",
    tags: ["Regional", "API key", "Reasoning"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "zai-key"),
      defaultModelField("zai/glm-4.7"),
    ],
  }),
]
