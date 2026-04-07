"use client"

import type { LucideIcon } from "lucide-react"
import {
  AudioLines,
  Blocks,
  Brain,
  Building2,
  Cloud,
  Database,
  GitBranchPlus,
  Globe,
  HardDrive,
  Hash,
  KeyRound,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Puzzle,
  Radio,
  Send,
  Shield,
  Smartphone,
  Workflow,
} from "lucide-react"
import {
  RiDiscordFill,
  RiLineFill,
  RiSlackFill,
  RiTelegramFill,
  RiTwitchFill,
  RiWhatsappFill,
} from "@remixicon/react"

const ICONS_BY_SLUG: Record<string, React.ElementType> = {
  bluebubbles: Smartphone,
  diffs: GitBranchPlus,
  discord: RiDiscordFill,
  elevenlabs: AudioLines,
  feishu: Building2,
  googlechat: MessageSquare,
  imessage: MessageCircle,
  irc: Hash,
  lancedb: Database,
  line: RiLineFill,
  "llm-task": Workflow,
  matrix: Blocks,
  mattermost: MessageSquare,
  "memory-core": Brain,
  msteams: Building2,
  "nextcloud-talk": Cloud,
  nostr: KeyRound,
  signal: Shield,
  slack: RiSlackFill,
  "synology-chat": HardDrive,
  telegram: RiTelegramFill,
  tlon: Globe,
  twitch: RiTwitchFill,
  "voice-call": PhoneCall,
  whatsapp: RiWhatsappFill,
  zalo: Smartphone,
  zalouser: Smartphone,
}

export function ExtensionIcon({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const Icon = ICONS_BY_SLUG[slug] || Puzzle

  return <Icon className={className} />
}
