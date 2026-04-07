# SuperClaw Rewrite: Open Source Extensions, Private Web Connect

## Purpose

This document defines how SuperClaw should reuse the good parts of OpenClaw's extension system while changing the product boundary for a web-first rewrite.

The requirement is:

- the extension platform must be open source
- the Web Connect layer must stay private
- third-party developers must be able to build extensions for SuperClaw like VS Code extensions
- users should install and manage extensions from the SuperClaw app without needing direct access to private backend code

## What OpenClaw Does Today

Based on the OpenClaw reference, extensions are implemented as plugins.

### Key points from the reference

- Plugins can be native OpenClaw plugins or compatible bundles.
- Native plugins use manifest-first loading.
- Plugins can register channels, model providers, tools, hooks, services, CLI commands, HTTP routes, speech providers, media providers, image providers, web search providers, and exclusive slots like memory/context engine.
- Plugin metadata is validated before runtime code is executed.
- Third-party plugins can live outside the main repo and be installed from npm.

### Native plugin shape in OpenClaw

OpenClaw plugins usually contain:

- `package.json`
- `openclaw.plugin.json`
- `index.ts`
- optional `setup-entry.ts`
- local runtime files under `src/`

OpenClaw then:

1. Discovers plugin candidates from configured paths and extension roots.
2. Reads manifests and package metadata.
3. Validates config without executing the plugin.
4. Decides whether the plugin is enabled.
5. Loads enabled native plugins and calls `register(api)`.
6. Stores registrations in a central registry.

### Important trust detail

OpenClaw native plugins run in-process with the gateway. That means a plugin has the same trust boundary as core code.

This is acceptable for a local/operator-controlled tool, but it is not the right default trust model for a hosted web product.

## SuperClaw Decision

SuperClaw should keep the extension contract open, but move hosted connectivity, deployment, identity, and commercial control-plane features into a private Web Connect layer.

In short:

- Open source: extension SDK, manifest, extension host contract, examples, local dev tooling
- Private: Web Connect, hosted profiles, deployment orchestration, secrets, auth, billing, sync, marketplace operations

This gives SuperClaw a VS Code-like model:

- developers can build against a public extension API
- the product team still owns the hosted experience and managed connectivity

## Architecture Boundary

### 1. Open source layer

This is the part third parties can build against.

SuperClaw should publish:

- `@superclaw/extension-sdk`
- `@superclaw/extension-types`
- `@superclaw/extension-manifest`
- `@superclaw/extension-devkit`
- example extensions
- extension author docs
- local extension test harness

This public layer should define:

- manifest schema
- capability registration API
- config schema format
- setup schema / UI hints
- event contracts
- extension packaging rules
- versioning and compatibility policy

### 2. Private Web Connect layer

This is product IP and should not be required for extension authoring.

Keep private:

- web dashboard internals
- account system
- profile system
- hosted deployment pipeline
- secret vault and token brokering
- billing and plan enforcement
- analytics and telemetry pipeline
- extension moderation workflow
- marketplace ranking, curation, trust badges
- cloud sync and remote connectivity services

### 3. Runtime host boundary

Extensions should never import private Web Connect code directly.

Instead, Web Connect talks to an extension host through a stable internal boundary:

- install extension package
- validate manifest
- mount per-profile config
- inject scoped secrets
- start extension runtime
- read health/status
- stop/restart/update extension

The browser app should manage extensions, not execute extension logic.

## Recommended SuperClaw Model

### Public extension capabilities

SuperClaw should expose a public capability model similar to OpenClaw:

- `registerChannel(...)`
- `registerProvider(...)`
- `registerTool(...)`
- `registerHook(...)`
- `registerSpeechProvider(...)`
- `registerMediaUnderstandingProvider(...)`
- `registerImageGenerationProvider(...)`
- `registerWebSearchProvider(...)`

Optional later:

- `registerMemory(...)`
- `registerContextEngine(...)`
- `registerWebhook(...)`

### Suggested extension package shape

```text
my-superclaw-extension/
|- package.json
|- superclaw.extension.json
|- index.ts
|- setup-entry.ts
|- api.ts
`- src/
```

### Suggested manifest fields

```json
{
  "id": "my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "kind": "channel",
  "capabilities": ["channel"],
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {}
  },
  "uiHints": {},
  "permissions": ["network"],
  "setup": {
    "label": "My Extension",
    "docsPath": "/extensions/my-extension"
  }
}
```

## How Third-Party Extensions Should Work

The extension author flow should be:

1. Install the public SuperClaw extension SDK.
2. Build the extension against the documented manifest and runtime contracts.
3. Test locally with the open-source extension host.
4. Publish the package independently.
5. Submit the package to SuperClaw Marketplace or install it manually in self-hosted mode.

The SuperClaw product flow should be:

1. Read the manifest without executing runtime code.
2. Show the extension in UI.
3. Let the user install and configure it through a profile.
4. Store secrets in the private backend.
5. Start the extension inside the extension host with only scoped config and scoped credentials.

## Open Source vs Private Split

### Must be open source

- manifest format
- SDK types and helpers
- capability registration API
- example extensions
- extension packaging CLI
- local dev runner
- compatibility tests
- docs for extension authors

### Must stay private

- hosted Web Connect API
- user accounts and organizations
- managed profile storage
- deployment scheduler
- remote agents/connectors
- secret management implementation
- cloud sync protocol details
- commercial marketplace operations

## Security Requirement for the Rewrite

This is the main place where SuperClaw should improve on the OpenClaw reference.

OpenClaw loads native plugins in-process. SuperClaw should not use that model for hosted Web Connect.

For SuperClaw managed hosting, extensions should run in an isolated runtime:

- separate process, worker, or container per profile or tenant
- explicit permission model
- scoped filesystem/network access
- secret injection at runtime only
- resource limits and crash isolation

For self-hosted mode, SuperClaw can allow a more trusted local mode, but the public SDK must not depend on private hosted internals.

## Product Rule

The extension API is public.

The Web Connect implementation is private.

Extensions target the public host contract, not the private SuperClaw web app.

That rule keeps the ecosystem open while preserving SuperClaw's commercial and operational moat.

## Suggested Repository Split

### Public repository

- `packages/extension-sdk`
- `packages/extension-types`
- `packages/extension-manifest`
- `packages/extension-devkit`
- `packages/extension-host-local`
- `examples/`
- `docs/extensions/`

### Private repository or private workspace

- `apps/web-connect`
- `services/profile-manager`
- `services/deployment-orchestrator`
- `services/secret-vault`
- `services/marketplace-admin`
- `services/account-sync`

## Practical Summary

Use OpenClaw as the reference for:

- manifest-first extension discovery
- typed capability registration
- external plugin publishing
- config-schema-driven setup

Do not copy OpenClaw's trust model directly into SuperClaw hosted mode.

SuperClaw should be:

- Open on extension authoring
- Closed on hosted connectivity and operations
- Compatible with third-party extension development
- Safer for multi-user web deployment

## Reference Files Reviewed

OpenClaw references used for this requirement:

- `openclaw/docs/tools/plugin.md`
- `openclaw/docs/plugins/building-plugins.md`
- `openclaw/docs/plugins/architecture.md`
- `openclaw/docs/plugins/manifest.md`
- `openclaw/docs/plugins/bundles.md`
- `openclaw/src/plugins/discovery.ts`
- `openclaw/src/plugins/loader.ts`
- `openclaw/src/plugins/registry.ts`
- `openclaw/extensions/matrix/package.json`
- `openclaw/extensions/matrix/openclaw.plugin.json`
- `openclaw/extensions/matrix/index.ts`
