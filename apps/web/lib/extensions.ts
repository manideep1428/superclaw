import { buildExtensionDocsPath } from "@/lib/docs"

export type ExtensionCategoryId = "channels" | "memory" | "voice" | "tools"

export type ExtensionSetupMode =
  | "token"
  | "oauth"
  | "service-account"
  | "qr"
  | "local"
  | "webhook"
  | "tool"

export type ExtensionFieldType =
  | "text"
  | "password"
  | "url"
  | "textarea"
  | "toggle"
  | "select"

export interface ExtensionFieldOption {
  label: string
  value: string
}

export interface ExtensionField {
  key: string
  label: string
  type: ExtensionFieldType
  placeholder?: string
  helperText?: string
  required?: boolean
  defaultValue?: string | boolean
  options?: ExtensionFieldOption[]
}

export interface ExtensionDefinition {
  slug: string
  title: string
  description: string
  category: ExtensionCategoryId
  accent: string
  tags: string[]
  setupMode: ExtensionSetupMode
  configFields: ExtensionField[]
  docsPath: string
}

export const EXTENSION_CATEGORIES: {
  id: ExtensionCategoryId
  label: string
  description: string
}[] = [
  {
    id: "channels",
    label: "Channels",
    description:
      "Messaging apps, social networks, and team chat surfaces where your agent can live.",
  },
  {
    id: "memory",
    label: "Memory",
    description:
      "Persistent context engines that let Superclaw retain conversations and embeddings.",
  },
  {
    id: "voice",
    label: "Voice",
    description:
      "Speech and telephony integrations for phone agents, voice replies, and TTS.",
  },
  {
    id: "tools",
    label: "Tools",
    description:
      "Workflow helpers and structured-output utilities that extend the agent runtime.",
  },
]

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

function textareaField(
  key: string,
  label: string,
  placeholder: string,
  helperText?: string,
  required = true
): ExtensionField {
  return {
    key,
    label,
    type: "textarea",
    placeholder,
    helperText,
    required,
  }
}

function toggleField(
  key: string,
  label: string,
  helperText?: string,
  defaultValue = false
): ExtensionField {
  return {
    key,
    label,
    type: "toggle",
    helperText,
    defaultValue,
  }
}

function selectField(
  key: string,
  label: string,
  options: ExtensionFieldOption[],
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

function extension(definition: Omit<ExtensionDefinition, "docsPath">): ExtensionDefinition {
  return {
    ...definition,
    docsPath: buildExtensionDocsPath(definition.slug),
  }
}

export const EXTENSIONS: ExtensionDefinition[] = [
  extension({
    slug: "bluebubbles",
    title: "BlueBubbles",
    description: "Connect your AI to Apple iMessage via BlueBubbles.",
    category: "channels",
    accent: "#2563EB",
    tags: ["iMessage", "Bridge", "macOS"],
    setupMode: "local",
    configFields: [
      urlField(
        "serverUrl",
        "BlueBubbles server URL",
        "https://bluebubbles.example.com",
        "Use the public URL exposed by your BlueBubbles server."
      ),
      passwordField(
        "password",
        "BlueBubbles password",
        "Server password",
        "Matches the password configured inside BlueBubbles."
      ),
      textField(
        "chatGuid",
        "Default chat GUID",
        "iMessage chat GUID",
        "Optional default thread to test against.",
        false
      ),
    ],
  }),
  extension({
    slug: "diffs",
    title: "Diff Viewer",
    description: "Render syntax-highlighted code diffs as HTML, PNG, or PDF.",
    category: "tools",
    accent: "#F97316",
    tags: ["Code", "Preview", "Artifacts"],
    setupMode: "tool",
    configFields: [
      selectField(
        "defaultFormat",
        "Default export format",
        [
          { label: "HTML", value: "html" },
          { label: "PNG", value: "png" },
          { label: "PDF", value: "pdf" },
        ],
        "This controls the first rendering format offered in the frontend.",
        "html"
      ),
      textField(
        "theme",
        "Theme",
        "github-dark",
        "Syntax highlighting theme name.",
        false
      ),
      toggleField(
        "includeLineNumbers",
        "Include line numbers",
        "Saved locally so you can keep a consistent preview preference.",
        true
      ),
    ],
  }),
  extension({
    slug: "discord",
    title: "Discord",
    description: "How to get your Discord Bot Token and Application ID.",
    category: "channels",
    accent: "#5865F2",
    tags: ["Bot", "Guilds", "Slash Commands"],
    setupMode: "token",
    configFields: [
      textField("applicationId", "Application ID", "Discord application ID"),
      textField("publicKey", "Public key", "Discord public key"),
      passwordField("botToken", "Bot token", "Discord bot token"),
    ],
  }),
  extension({
    slug: "elevenlabs",
    title: "ElevenLabs",
    description: "How to get your ElevenLabs API Key for Talk Voice.",
    category: "voice",
    accent: "#A855F7",
    tags: ["TTS", "Voice", "API Key"],
    setupMode: "token",
    configFields: [
      passwordField("apiKey", "API key", "ElevenLabs API key"),
      textField(
        "voiceId",
        "Voice ID",
        "Optional voice ID",
        "Leave blank to keep voice selection flexible in later UI work.",
        false
      ),
      selectField(
        "model",
        "Voice model",
        [
          { label: "eleven_flash_v2_5", value: "eleven_flash_v2_5" },
          { label: "eleven_multilingual_v2", value: "eleven_multilingual_v2" },
        ],
        "Saved locally only for now.",
        "eleven_flash_v2_5"
      ),
    ],
  }),
  extension({
    slug: "feishu",
    title: "Feishu / Lark",
    description: "Connect to enterprise Feishu or Lark accounts.",
    category: "channels",
    accent: "#0F766E",
    tags: ["Enterprise", "Asia", "Bot App"],
    setupMode: "oauth",
    configFields: [
      textField("appId", "App ID", "Feishu or Lark app ID"),
      passwordField("appSecret", "App secret", "Feishu or Lark app secret"),
      textField(
        "verificationToken",
        "Verification token",
        "Event verification token",
        "Used when configuring callbacks and event subscriptions."
      ),
    ],
  }),
  extension({
    slug: "googlechat",
    title: "Google Chat",
    description: "Connect to Google Chat using a Service Account.",
    category: "channels",
    accent: "#34A853",
    tags: ["Workspace", "Service Account", "Spaces"],
    setupMode: "service-account",
    configFields: [
      textField(
        "serviceAccountEmail",
        "Service account email",
        "bot@project.iam.gserviceaccount.com"
      ),
      textareaField(
        "serviceAccountJson",
        "Service account JSON",
        "{ ... }",
        "Paste the JSON credential block exported from Google Cloud."
      ),
      textField(
        "spaceId",
        "Default space ID",
        "spaces/AAAA...",
        "Optional target space for testing.",
        false
      ),
    ],
  }),
  extension({
    slug: "imessage",
    title: "iMessage (Native)",
    description: "Send and receive messages via native macOS iMessage.",
    category: "channels",
    accent: "#0EA5E9",
    tags: ["Apple", "macOS", "Native"],
    setupMode: "local",
    configFields: [
      textField(
        "hostLabel",
        "Mac host label",
        "Office Mac Mini",
        "A local name to identify the machine running the native bridge."
      ),
      textField(
        "defaultHandle",
        "Default chat handle",
        "+1 555 0100",
        "Optional phone number or email for quick testing.",
        false
      ),
      toggleField(
        "requiresForegroundSession",
        "Require active desktop session",
        "Keep this on if the bridge must only run while a macOS user is signed in.",
        true
      ),
    ],
  }),
  extension({
    slug: "irc",
    title: "IRC",
    description: "Connect your AI to classic IRC networks like Libera Chat.",
    category: "channels",
    accent: "#DC2626",
    tags: ["Classic", "Realtime", "NickServ"],
    setupMode: "local",
    configFields: [
      textField("server", "IRC server", "irc.libera.chat"),
      textField("nickname", "Bot nickname", "Superclaw-bot"),
      textareaField(
        "channels",
        "Channels",
        "#Superclaw\n#support",
        "Enter one channel per line.",
        false
      ),
    ],
  }),
  extension({
    slug: "lancedb",
    title: "OpenAI-compatible Memory",
    description: "How to get your Embedding API Key for LanceDB vector memory.",
    category: "memory",
    accent: "#14B8A6",
    tags: ["Embeddings", "Vector DB", "Memory"],
    setupMode: "token",
    configFields: [
      passwordField(
        "embeddingApiKey",
        "Embedding API key",
        "OpenAI-compatible embedding key"
      ),
      textField(
        "embeddingModel",
        "Embedding model",
        "text-embedding-3-large",
        "Any embedding model supported by your chosen provider."
      ),
      textField(
        "storagePath",
        "LanceDB path",
        "./data/lancedb",
        "Directory where local vector data will be stored."
      ),
    ],
  }),
  extension({
    slug: "line",
    title: "LINE",
    description: "Connect to the LINE Messaging API.",
    category: "channels",
    accent: "#06C755",
    tags: ["Messaging", "Webhook", "Bot"],
    setupMode: "webhook",
    configFields: [
      textField("channelId", "Channel ID", "LINE channel ID"),
      passwordField("channelSecret", "Channel secret", "LINE channel secret"),
      passwordField(
        "channelAccessToken",
        "Channel access token",
        "Messaging API access token"
      ),
    ],
  }),
  extension({
    slug: "llm-task",
    title: "LLM Task Tool",
    description: "Create structured JSON outputs using the LLM Task pipeline.",
    category: "tools",
    accent: "#8B5CF6",
    tags: ["Structured Output", "Workflow", "JSON"],
    setupMode: "tool",
    configFields: [
      textField(
        "taskName",
        "Task name",
        "extract_invoice_fields",
        "A short internal name for this saved task configuration."
      ),
      textareaField(
        "schemaPrompt",
        "Schema prompt",
        "Describe the JSON shape you expect...",
        "This is stored in the browser only for frontend prototyping."
      ),
      toggleField(
        "strictMode",
        "Strict schema validation",
        "Keep this enabled if you only want valid JSON outputs.",
        true
      ),
    ],
  }),
  extension({
    slug: "matrix",
    title: "Matrix",
    description: "Connect to the decentralized Matrix protocol.",
    category: "channels",
    accent: "#10B981",
    tags: ["Federated", "Rooms", "Access Token"],
    setupMode: "token",
    configFields: [
      urlField("homeserverUrl", "Homeserver URL", "https://matrix.example.com"),
      passwordField("accessToken", "Access token", "Matrix access token"),
      textField(
        "roomId",
        "Default room ID",
        "!room:example.com",
        "Optional room for first-run testing.",
        false
      ),
    ],
  }),
  extension({
    slug: "mattermost",
    title: "Mattermost",
    description: "Connect your AI to Mattermost instances using a bot token.",
    category: "channels",
    accent: "#0058CC",
    tags: ["Team Chat", "Self Hosted", "Bot Token"],
    setupMode: "token",
    configFields: [
      urlField("serverUrl", "Server URL", "https://mattermost.example.com"),
      passwordField("botToken", "Bot token", "Mattermost bot token"),
      textField(
        "teamName",
        "Team name",
        "engineering",
        "Optional default team slug.",
        false
      ),
    ],
  }),
  extension({
    slug: "memory-core",
    title: "Core Memory",
    description: "Simple, lightweight JSON file-backed memory storage.",
    category: "memory",
    accent: "#F59E0B",
    tags: ["Filesystem", "JSON", "Local"],
    setupMode: "local",
    configFields: [
      textField(
        "storagePath",
        "Storage path",
        "./data/memory",
        "Directory used for the JSON-backed memory store."
      ),
      toggleField(
        "autoCompact",
        "Compact old entries automatically",
        "This only changes the saved frontend preference for now.",
        true
      ),
    ],
  }),
  extension({
    slug: "msteams",
    title: "Microsoft Teams",
    description: "Connect to Microsoft Teams via an Azure bot setup.",
    category: "channels",
    accent: "#4F46E5",
    tags: ["Azure", "Bot Framework", "Enterprise"],
    setupMode: "oauth",
    configFields: [
      textField("appId", "Azure app ID", "Microsoft app ID"),
      passwordField("appPassword", "App password", "Client secret or password"),
      textField(
        "tenantId",
        "Tenant ID",
        "Azure tenant ID",
        "Needed when the bot is scoped to a specific tenant."
      ),
    ],
  }),
  extension({
    slug: "nextcloud-talk",
    title: "Nextcloud Talk",
    description: "Secure, self-hosted private messaging.",
    category: "channels",
    accent: "#2563EB",
    tags: ["Self Hosted", "Talk", "Private"],
    setupMode: "token",
    configFields: [
      urlField("serverUrl", "Nextcloud URL", "https://cloud.example.com"),
      textField("username", "Username", "automation-bot"),
      passwordField("appPassword", "App password", "Nextcloud app password"),
    ],
  }),
  extension({
    slug: "nostr",
    title: "Nostr",
    description: "Connect to the Nostr decentralized network for encrypted DMs.",
    category: "channels",
    accent: "#D946EF",
    tags: ["Decentralized", "Relays", "Keys"],
    setupMode: "token",
    configFields: [
      urlField("relayUrl", "Relay URL", "wss://relay.damus.io"),
      passwordField("privateKey", "Private key", "nsec..."),
      textField(
        "defaultRecipient",
        "Default recipient pubkey",
        "npub...",
        "Optional default direct-message target.",
        false
      ),
    ],
  }),
  extension({
    slug: "signal",
    title: "Signal",
    description: "Connect to encrypted Signal messaging using signal-cli.",
    category: "channels",
    accent: "#2563EB",
    tags: ["Encrypted", "signal-cli", "Local"],
    setupMode: "local",
    configFields: [
      textField("phoneNumber", "Signal phone number", "+1 555 0100"),
      urlField(
        "signalCliEndpoint",
        "signal-cli endpoint",
        "http://localhost:8080",
        "Local or remote signal-cli REST bridge."
      ),
      textareaField(
        "allowedRecipients",
        "Allowed recipients",
        "+1 555 0100\n+1 555 0101",
        "Enter one number per line.",
        false
      ),
    ],
  }),
  extension({
    slug: "slack",
    title: "Slack",
    description: "How to configure Slack OAuth credentials.",
    category: "channels",
    accent: "#7C3AED",
    tags: ["OAuth", "Workspace", "Events"],
    setupMode: "oauth",
    configFields: [
      textField("clientId", "Client ID", "Slack client ID"),
      passwordField("clientSecret", "Client secret", "Slack client secret"),
      passwordField(
        "signingSecret",
        "Signing secret",
        "Slack signing secret"
      ),
    ],
  }),
  extension({
    slug: "synology-chat",
    title: "Synology Chat",
    description: "Local NAS chat connection for Synology.",
    category: "channels",
    accent: "#EA580C",
    tags: ["NAS", "Self Hosted", "Chat"],
    setupMode: "token",
    configFields: [
      urlField("serverUrl", "Synology URL", "https://nas.example.com"),
      passwordField("botToken", "Bot token", "Synology Chat bot token"),
      textField(
        "channelId",
        "Default channel ID",
        "channel-id",
        "Optional default room or channel.",
        false
      ),
    ],
  }),
  extension({
    slug: "telegram",
    title: "Telegram",
    description: "How to get your Telegram Bot Token.",
    category: "channels",
    accent: "#0EA5E9",
    tags: ["BotFather", "Webhook", "Chat"],
    setupMode: "token",
    configFields: [
      passwordField("botToken", "Bot token", "Telegram bot token"),
      passwordField(
        "webhookSecret",
        "Webhook secret",
        "Optional secret token",
        "Useful when Telegram is configured to send webhook callbacks.",
        false
      ),
      textField(
        "defaultChatId",
        "Default chat ID",
        "123456789",
        "Optional chat ID for smoke testing.",
        false
      ),
    ],
  }),
  extension({
    slug: "tlon",
    title: "Tlon (Urbit)",
    description: "Connect your AI to decentralized peer-to-peer Urbit groups.",
    category: "channels",
    accent: "#9333EA",
    tags: ["Urbit", "Peer to Peer", "Groups"],
    setupMode: "local",
    configFields: [
      textField("ship", "Ship", "~zod"),
      textField("agentName", "Agent name", "Superclaw-bot"),
      textField(
        "desk",
        "Desk",
        "base",
        "The Urbit desk where the integration should run.",
        false
      ),
    ],
  }),
  extension({
    slug: "twitch",
    title: "Twitch",
    description: "Connect your AI to Twitch Chat.",
    category: "channels",
    accent: "#9146FF",
    tags: ["Streaming", "Chat", "OAuth"],
    setupMode: "oauth",
    configFields: [
      textField("botUsername", "Bot username", "superclaw_bot"),
      passwordField("oauthToken", "OAuth token", "oauth:..."),
      textField("channelName", "Channel name", "streamer_name"),
    ],
  }),
  extension({
    slug: "voice-call",
    title: "Twilio Voice Call",
    description: "Turn your AI into a phone agent with Twilio.",
    category: "voice",
    accent: "#EF4444",
    tags: ["Phone", "Twilio", "Voice"],
    setupMode: "token",
    configFields: [
      textField("accountSid", "Account SID", "AC..."),
      passwordField("authToken", "Auth token", "Twilio auth token"),
      textField("phoneNumber", "Twilio number", "+1 555 0100"),
    ],
  }),
  extension({
    slug: "whatsapp",
    title: "WhatsApp",
    description: "Connect your personal WhatsApp account by scanning a QR code.",
    category: "channels",
    accent: "#22C55E",
    tags: ["QR", "Personal", "Session"],
    setupMode: "qr",
    configFields: [
      textField(
        "sessionLabel",
        "Session label",
        "Primary WhatsApp",
        "Used only by the frontend prototype to distinguish saved sessions."
      ),
      toggleField(
        "autoReconnect",
        "Reconnect automatically",
        "When backend support lands, this will control session restoration.",
        true
      ),
    ],
  }),
  extension({
    slug: "zalo",
    title: "Zalo",
    description: "Connect to the Zalo messaging app in Vietnam.",
    category: "channels",
    accent: "#2563EB",
    tags: ["Vietnam", "Official Account", "Webhook"],
    setupMode: "webhook",
    configFields: [
      textField("officialAccountId", "Official account ID", "Zalo OA ID"),
      passwordField("appSecret", "App secret", "Zalo app secret"),
      passwordField(
        "webhookSecret",
        "Webhook secret",
        "Webhook verification secret"
      ),
    ],
  }),
  extension({
    slug: "zalouser",
    title: "Zalo User",
    description: "Connect your AI to a personal Zalo account.",
    category: "channels",
    accent: "#1D4ED8",
    tags: ["Vietnam", "Personal", "Session"],
    setupMode: "local",
    configFields: [
      textField("accountLabel", "Account label", "Personal Zalo"),
      textField(
        "deviceName",
        "Device name",
        "Browser session",
        "Used to name the saved frontend session.",
        false
      ),
      urlField(
        "bridgeUrl",
        "Bridge URL",
        "http://localhost:8787",
        "Optional user-account bridge endpoint.",
        false
      ),
    ],
  }),
]

export const EXTENSION_COUNT = EXTENSIONS.length

export function getExtensionBySlug(slug: string) {
  return EXTENSIONS.find((extension) => extension.slug === slug)
}

