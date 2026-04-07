# SuperClaw MVP: TypeScript First, OpenClaw as the Base

## Short Answer

Yes, for MVP and initial users, we can use **OpenClaw as the base** and build the SuperClaw product layer in **TypeScript**.

That is the fastest path to:

- launch a working website
- get initial users
- validate the extension marketplace idea
- avoid rebuilding the whole runtime too early

This should be treated as **Phase 1**, not the final architecture.

## Recommended MVP Decision

For the MVP:

- keep **OpenClaw** as the runtime engine
- build **SuperClaw** in TypeScript as the web control plane
- connect the website to OpenClaw through a managed bridge layer
- use OpenClaw's existing extension/plugin system instead of inventing a new one now

## Why This Is the Right MVP Move

Rebuilding the whole platform before getting users is too expensive in time.

Using OpenClaw now gives us:

- existing gateway/runtime
- existing extension/plugin loading
- existing channel/provider support
- existing config model
- existing operational behavior

Using TypeScript for the product layer gives us:

- fastest iteration speed
- easiest UI and dashboard work
- easiest marketplace and onboarding flow
- easiest reuse of the current `superclaw/apps/web` work

## What SuperClaw Should Be in the MVP

In the MVP, SuperClaw should not try to replace OpenClaw internally.

It should be:

- a hosted website
- a profile manager
- an extension management UI
- a configuration UI
- a deployment/control wrapper around OpenClaw

So the MVP architecture becomes:

```text
Browser
  -> SuperClaw Web App (Next.js / TypeScript)
  -> SuperClaw Server Routes / Bridge Layer
  -> OpenClaw Gateway Runtime
  -> OpenClaw Extensions / Channels / Providers
```

## Yes, We Can Use OpenClaw as the Base

This is acceptable for early users if we keep the boundary clear.

### Use OpenClaw for

- gateway runtime
- extension/plugin discovery
- extension/plugin execution
- channel integrations
- model provider integrations
- config-driven runtime behavior

### Use SuperClaw for

- auth
- user accounts
- profiles
- extension catalog UI
- install/enable/disable UX
- config forms
- deployment UX
- logs/status UI
- billing later

## How to Build the MVP in TypeScript

### 1. Keep the existing Next.js app as the main product shell

Build on the current web code already in:

- `apps/web/lib/gateway-client.ts`
- `apps/web/hooks/use-gateway.ts`
- `apps/web/components/gateway-status.tsx`
- `apps/web/app/dashboard/`

This is already the beginning of the right direction.

### 2. Add a server-side OpenClaw bridge

Do not let the hosted browser talk directly to raw OpenClaw internals for everything.

For MVP, add a TypeScript bridge layer that handles:

- gateway health checks
- config reads/writes
- extension install/update/remove actions
- gateway start/stop/restart actions
- extension catalog sync
- logs/status fetches

This can live either as:

- Next.js route handlers inside `apps/web`

or later as:

- a separate TypeScript service such as `packages/openclaw-bridge`

For MVP, Next.js server routes are enough.

### 3. Store product data in SuperClaw, not in random config files

Use `packages/db` for product-level state such as:

- users
- workspaces
- profiles
- installed extension list
- desired extension config
- gateway deployment records

Then generate OpenClaw config from that data.

### 4. Treat OpenClaw config as generated runtime state

Do not make users edit OpenClaw JSON manually.

Instead:

1. User edits forms in SuperClaw.
2. SuperClaw stores the canonical data in its DB.
3. SuperClaw generates the matching OpenClaw config.
4. SuperClaw applies the config and restarts/reloads the gateway if needed.

That keeps the product simple even though OpenClaw is still underneath.

### 5. Start with OpenClaw extensions as the real extension system

For MVP, do not design a second extension runtime yet.

Instead:

- list OpenClaw plugins/extensions in the SuperClaw UI
- allow enable/disable/install/configure actions
- show config schema-driven forms where possible
- support bundled extensions first
- add external/community extension support after the basic flow works

## Website Connection Model

There are two workable MVP connection modes.

### Mode A: Fastest local/dev mode

```text
Browser -> OpenClaw Gateway directly over WebSocket
```

This is already close to what the current web app does.

Good for:

- local development
- demos
- early internal testing

Bad for:

- serious hosted product use
- auth enforcement
- multi-tenant routing

### Mode B: Real MVP hosted mode

```text
Browser -> SuperClaw server -> OpenClaw runtime
```

This is the better hosted model.

Use it for:

- authentication
- permission checks
- tenant routing
- profile ownership
- secure config writes
- deployment operations

For public hosting, this should be the default path.

## Best MVP Deployment Model

For initial users, the cleanest approach is:

### Option 1: One OpenClaw runtime per workspace/profile

Pros:

- simplest isolation
- easiest debugging
- lowest product complexity

Cons:

- more memory per customer

This is acceptable for early beta.

### Option 2: One OpenClaw runtime per user

Pros:

- cheaper than per-profile

Cons:

- weaker isolation
- harder lifecycle management

### Recommended MVP choice

Use:

- one OpenClaw runtime per workspace or per paying account
- one SuperClaw web app for control

That is simple enough for launch and clean enough to migrate later.

## MVP Extension Strategy

For initial users:

- use OpenClaw's extension/plugin system as-is
- expose it through better UI
- do not promise a brand-new SuperClaw-native extension runtime yet

What SuperClaw should add now:

- extension marketplace pages
- install buttons
- config modals
- health/status badges
- profile-based enablement

What SuperClaw should postpone:

- brand-new extension execution engine
- full marketplace verification pipeline
- multi-language extension runtime
- cloud-scale extension sandbox redesign

## What to Build Now

### Phase 1

- auth
- dashboard
- gateway connection status
- extension listing
- extension enable/disable
- profile CRUD
- generated config writes
- gateway restart/apply flow

### Phase 2

- install external OpenClaw plugins from approved packages
- schema-based config forms
- logs and health page
- onboarding wizard
- deployment records

### Phase 3

- hosted marketplace
- extension review flow
- stronger runtime isolation
- migration away from raw OpenClaw internals where needed

## What Not to Build Yet

Avoid these in the MVP:

- rewriting the gateway
- replacing the plugin system immediately
- inventing a second config model with no migration path
- building a fully custom runtime before user demand is proven

## Main Risks of Using OpenClaw as the Base

This path is good for MVP, but there are limits.

### Risk 1: OpenClaw is not the final hosted architecture

OpenClaw is local-tool oriented in many places.

That means later we may outgrow:

- direct plugin trust model
- config/restart assumptions
- per-instance operational patterns

### Risk 2: Some workflows may still feel CLI-shaped underneath

Even if the UI is good, internals are still inherited from OpenClaw.

### Risk 3: Cost may rise if we keep this architecture too long

Using OpenClaw per tenant is acceptable for early users, but not necessarily for large scale.

## When to Move Beyond the OpenClaw Base

We should keep the MVP path until one of these becomes true:

- too many active workspaces
- per-tenant runtime cost becomes painful
- extension isolation becomes a hard requirement
- product needs behavior OpenClaw cannot support cleanly

At that point, we keep the SuperClaw UI and product model, then replace the runtime gradually behind the bridge layer.

## The Key Product Rule

For MVP:

- **OpenClaw is the engine**
- **SuperClaw is the product**

That is the correct split.

It lets us launch fast without pretending the first version is the final runtime.

## Suggested Monorepo Direction for MVP

```text
superclaw/
|- apps/
|  `- web/                 # Next.js UI + server routes
|- packages/
|  |- db/                  # users, profiles, deployments
|  |- extensions/          # UI-side catalog metadata later
|  `- openclaw-bridge/     # optional next step
`- docs/
```

If you want to keep it even simpler at first, skip `packages/openclaw-bridge` and implement the bridge logic directly in `apps/web/app/api/*`.

## Final Recommendation

For MVP and initial users:

- **Yes**, use **TypeScript**
- **Yes**, use **OpenClaw as the base now**
- build the **website and product layer first**
- delay the full runtime rewrite until usage proves where the real bottlenecks are

That is the fastest realistic path to shipping SuperClaw.
