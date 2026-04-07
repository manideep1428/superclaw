# OpenClaw Integration Layer for SuperClaw

## Purpose

This document explains how SuperClaw should read and use OpenClaw as the base runtime for:

- cloud hosting
- LLM/model connection
- extensions/plugins
- WhatsApp channel support

This is the practical "integration layer" for the SuperClaw MVP.

## Short Answer

For MVP, SuperClaw should use OpenClaw like this:

- **OpenClaw** runs as the backend runtime on a cloud host
- **SuperClaw web app** is the control plane and UI
- **LLMs** connect through OpenClaw provider configuration
- **extensions** are OpenClaw plugins surfaced in the website
- **WhatsApp** is a special plugin-backed channel with QR login and persistent session state

## Layered Architecture

```text
Browser
  -> SuperClaw Web App (Next.js / TypeScript)
  -> SuperClaw Server Bridge (API routes / service)
  -> OpenClaw Gateway (WebSocket control plane)
  -> OpenClaw Plugins
      -> LLM providers
      -> channels
      -> memory
      -> voice
      -> tools
      -> WhatsApp
```

## Layer 1: Cloud Hosting Layer

OpenClaw is designed to run as a persistent gateway process.

### What OpenClaw expects

- Node 24 recommended
- long-running gateway process
- config under `~/.openclaw/openclaw.json`
- credentials and runtime state under `~/.openclaw/`

### Cheapest hosting path for MVP

Based on the OpenClaw docs, cheap VPS hosting is a valid starting point.

Good MVP options:

- DigitalOcean basic droplet
- Hetzner small VPS
- Oracle free tier if you accept more setup friction

### Practical hosting model

For SuperClaw MVP, use:

- one cloud VM per workspace or per paying customer
- OpenClaw installed on that VM
- SuperClaw web app hosted separately
- SuperClaw server bridge talking to the correct OpenClaw instance

### How OpenClaw is exposed safely

Do not expose raw unauthenticated gateway ports publicly.

Safer OpenClaw access patterns from the reference:

- loopback bind plus SSH tunnel
- Tailscale Serve
- token/password auth

For MVP, the preferred hosted pattern is:

```text
SuperClaw server -> authenticated bridge -> OpenClaw gateway
```

Not:

```text
public browser -> raw OpenClaw gateway
```

## Layer 2: SuperClaw Bridge Layer

The website should not directly own OpenClaw runtime logic.

It should translate product actions into OpenClaw operations.

### Bridge responsibilities

- health/status checks
- read config
- write config
- install/enable/disable plugins
- trigger QR login flows
- restart gateway when required
- read logs and diagnostics

### Current SuperClaw starting point

SuperClaw already has the beginning of this layer in:

- `apps/web/lib/gateway-client.ts`
- `apps/web/hooks/use-gateway.ts`
- `apps/web/components/gateway-status.tsx`

For hosted MVP, add server-side bridge routes under `apps/web/app/api/*` instead of relying only on browser WebSocket access.

## Layer 3: LLM Connection Layer

OpenClaw connects to LLMs through **provider plugins** and model configuration.

### How OpenClaw selects an LLM

The main model path is:

- `agents.defaults.model.primary`
- optional `fallbacks`
- optional `models.providers` for custom providers/base URLs

Example:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["openai/gpt-5.4"]
      }
    }
  }
}
```

### How auth is supplied

OpenClaw supports:

- env vars
- auth profiles
- OAuth for some providers
- API keys
- SecretRef-backed values

### What SuperClaw should do

SuperClaw should not ask users to edit raw provider config manually.

Instead:

1. User selects provider in the website.
2. User enters API key or completes OAuth.
3. SuperClaw stores canonical product state in its DB.
4. SuperClaw writes the generated OpenClaw config.
5. OpenClaw uses that config to resolve the active provider/model.

### Important UI note

OpenClaw providers are also plugins.

That means SuperClaw should support a provider category in the extension system, not just channel integrations.

## Layer 4: Extension Layer

OpenClaw extensions are plugins.

They can register:

- model providers
- chat channels
- tools
- speech providers
- media understanding
- image generation
- web search
- hooks
- services
- CLI commands

### Plugin discovery model

OpenClaw discovers plugins from:

1. configured load paths
2. workspace extensions
3. global extensions
4. bundled plugins

### Plugin operations that SuperClaw should expose

The website should support:

- list plugins
- inspect plugin metadata
- install plugin from approved package/path
- enable plugin
- disable plugin
- edit `plugins.entries.<id>.config`
- restart gateway when plugin state changes

### Important runtime rule

Plugin changes require gateway restart.

Config changes inside normal runtime surfaces often hot-reload, but plugin loading is a restart-level operation.

## Layer 5: Extension Categories for SuperClaw

OpenClaw has more extension types than the current SuperClaw catalog model.

### OpenClaw capability categories

- channels
- providers
- memory
- voice/speech
- tools
- web search
- image generation
- media understanding

### Current SuperClaw catalog categories

From `apps/web/lib/extensions.ts`, the current frontend categories are:

- `channels`
- `memory`
- `voice`
- `tools`

### Required change

To reflect OpenClaw correctly, SuperClaw should add at least:

- `providers`

Optional later:

- `search`
- `image`
- `media`

Without a `providers` category, the website cannot represent the full OpenClaw extension surface cleanly.

## Layer 6: WhatsApp Layer

WhatsApp is one of the most important OpenClaw channel integrations, but it behaves differently from token-only channels.

### How OpenClaw handles WhatsApp

- WhatsApp runs through a plugin-backed WhatsApp Web integration
- the gateway owns the linked session
- linking is done through QR login
- auth state is stored on disk
- outbound sends require an active listener

### Install flow

OpenClaw supports on-demand WhatsApp plugin install.

Manual install:

```bash
openclaw plugins install @openclaw/whatsapp
```

### Login flow

```bash
openclaw channels login --channel whatsapp
```

Then the user scans the QR code.

### Recommended product behavior for SuperClaw

The website should present WhatsApp as:

- install plugin
- start QR session
- show QR status
- show linked/disconnected/reconnecting state
- allow reconnect/logout actions

### WhatsApp policy model

Important OpenClaw config fields:

- `channels.whatsapp.dmPolicy`
- `channels.whatsapp.allowFrom`
- `channels.whatsapp.groupPolicy`
- `channels.whatsapp.groupAllowFrom`
- `channels.whatsapp.groups`

Minimal example:

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"]
    }
  }
}
```

### Operational warning

OpenClaw docs explicitly warn that WhatsApp gateway runtime should use **Node**, not Bun, for stable operation.

That matters for SuperClaw deployment:

- website can use Bun or Node if desired
- OpenClaw runtime host should stay on Node

## MVP Data Flow

This is the recommended SuperClaw data flow with OpenClaw underneath:

```text
1. User opens SuperClaw dashboard
2. SuperClaw reads extension + provider catalog
3. User connects an LLM provider or channel
4. SuperClaw saves desired state in its DB
5. SuperClaw generates OpenClaw config
6. SuperClaw applies config to the OpenClaw host
7. OpenClaw loads providers/plugins/channels
8. Gateway reports health/status back to SuperClaw
```

## Recommended MVP Scope

### Build now

- cloud-hosted OpenClaw runtime per customer/workspace
- SuperClaw dashboard
- provider setup pages
- extension list and config pages
- WhatsApp QR connection flow
- gateway health and restart controls

### Do later

- custom non-OpenClaw-native runtime
- full plugin sandbox redesign
- fully custom extension API independent of OpenClaw
- multi-tenant pooled runtime optimization

## Suggested Implementation Split

### In `apps/web`

Add server routes for:

- `/api/gateway/health`
- `/api/gateway/status`
- `/api/gateway/config`
- `/api/extensions`
- `/api/extensions/install`
- `/api/extensions/toggle`
- `/api/providers`
- `/api/providers/connect`
- `/api/channels/whatsapp/login`
- `/api/channels/whatsapp/status`

### In `packages/db`

Store:

- users
- workspaces
- profiles
- provider credentials metadata
- desired extensions
- desired channel config
- deployment records

### Optional next package

Later add:

- `packages/openclaw-bridge`

This can centralize all OpenClaw RPC/config/install logic once the MVP routes become too large.

## Final Recommendation

For SuperClaw MVP, the correct integration layer is:

- host OpenClaw on cheap cloud VPS instances
- connect LLMs through OpenClaw provider config
- expose OpenClaw plugins as SuperClaw extensions
- treat WhatsApp as a first-class QR/session-driven channel
- keep SuperClaw as the web control plane above OpenClaw

## Reference Files Reviewed

- `openclaw/README.md`
- `openclaw/docs/cli/gateway.md`
- `openclaw/docs/gateway/configuration.md`
- `openclaw/docs/gateway/configuration-examples.md`
- `openclaw/docs/platforms/digitalocean.md`
- `openclaw/docs/concepts/model-providers.md`
- `openclaw/docs/tools/plugin.md`
- `openclaw/docs/channels/whatsapp.md`
- `superclaw/apps/web/lib/gateway-client.ts`
- `superclaw/apps/web/hooks/use-gateway.ts`
- `superclaw/apps/web/components/gateway-status.tsx`
- `superclaw/apps/web/lib/extensions.ts`
