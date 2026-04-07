# Cloud OpenClaw Connection Guide

This guide explains how to:

1. Deploy an OpenClaw Gateway on a cloud server or VPS
2. Expose it safely for browser access
3. Connect the SuperClaw web app to that remote gateway

This guide is written for the current SuperClaw codebase in this repo.

## Current connection model

Today, `superclaw/apps/web` connects to OpenClaw with two public environment variables:

```bash
NEXT_PUBLIC_GATEWAY_URL=...
NEXT_PUBLIC_GATEWAY_TOKEN=...
```

The browser WebSocket client currently appends the token to the gateway URL as a query parameter:

```ts
new WebSocket(`${url}?token=${token}`)
```

That means:

- Use `wss://` for any internet-facing deployment
- Do not expose a public `ws://` gateway on the open internet
- Treat the gateway token as a full operator secret for that gateway

## Recommended architecture

```text
Browser
  -> SuperClaw web app
  -> wss://gateway.example.com
  -> reverse proxy with TLS
  -> OpenClaw Gateway on the VM
```

Recommended:

- OpenClaw runs on a VPS or cloud VM
- TLS terminates at Caddy or Nginx
- SuperClaw connects to the gateway over `wss://`
- Gateway auth is enabled with a strong token

## Prerequisites

You need:

- A cloud VM or VPS
- A public DNS name like `gateway.example.com`
- OpenClaw installed on that server
- SuperClaw running locally or deployed elsewhere
- A strong gateway token

## Step 1: Deploy OpenClaw on the cloud host

You can deploy OpenClaw however you want. The simplest paths in this repo are:

- native install on Ubuntu/Debian
- Docker / Docker Compose

### Option A: native install

SSH into the server:

```bash
ssh user@your-server
```

Install Node.js 24 and OpenClaw:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
sudo apt-get install -y nodejs
sudo npm install -g openclaw@latest
```

Generate a strong gateway token:

```bash
openssl rand -hex 32
```

Export it:

```bash
export OPENCLAW_GATEWAY_TOKEN="paste-your-token-here"
```

Start the gateway:

```bash
openclaw gateway --bind lan --port 18789
```

### Option B: Docker Compose

This repo already includes an OpenClaw Docker Compose file under `openclaw/docker-compose.yml`.

On the server:

```bash
cd openclaw
export OPENCLAW_GATEWAY_TOKEN="paste-your-token-here"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw/workspace"
docker compose up -d
```

By default that compose file exposes port `18789`.

## Step 2: Put TLS in front of the gateway

Because the browser sends the token in the WebSocket URL right now, you should not use plain `ws://` over the public internet.

Recommended setup:

- OpenClaw listens on the VM
- Caddy or Nginx serves `https://gateway.example.com`
- WebSocket traffic is proxied to `127.0.0.1:18789`

### Example Caddyfile

```caddy
gateway.example.com {
  reverse_proxy 127.0.0.1:18789
}
```

### Example Nginx config

```nginx
server {
    listen 443 ssl http2;
    server_name gateway.example.com;

    ssl_certificate /etc/letsencrypt/live/gateway.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gateway.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

After this, your public gateway URL should be:

```text
wss://gateway.example.com
```

## Step 3: Verify the gateway is reachable

From your local machine, verify DNS and TLS first:

```bash
curl -I https://gateway.example.com/healthz
```

If your reverse proxy is working, you should get a response from OpenClaw.

Important:

- `/healthz` only checks basic reachability
- your real app connection still needs the gateway token

## Step 4: Configure SuperClaw to use the remote gateway

In the current app, gateway connection is driven by `superclaw/apps/web/.env.local`.

Set:

```bash
NEXT_PUBLIC_GATEWAY_URL=wss://gateway.example.com
NEXT_PUBLIC_GATEWAY_TOKEN=your-secure-random-token-here
```

If you deploy the SuperClaw frontend to Vercel or another host, set the same values in that platform's environment variable settings.

## Step 5: Start SuperClaw

Local development:

```bash
cd superclaw/apps/web
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Then go to the dashboard. The app should try to connect to the remote gateway automatically.

## Step 6: Confirm the dashboard is connected

When the connection succeeds, the dashboard should show:

- connected gateway status
- no WebSocket auth error
- the remote gateway URL in the dashboard status area

## Current limitation in this repo

Right now this SuperClaw web app is global-gateway based:

- one `NEXT_PUBLIC_GATEWAY_URL`
- one `NEXT_PUBLIC_GATEWAY_TOKEN`
- shared by the frontend instance

It is not yet a per-user or per-workspace gateway connection system.

If you want multi-tenant hosted behavior later, the next step is:

- store gateway deployments per workspace in the database
- stop exposing the raw gateway token to the browser
- move browser traffic through a backend relay or session-based auth layer

## Security notes

Keep these rules:

1. Use `wss://`, not public `ws://`
2. Treat the gateway token as a full operator credential
3. Rotate the token if it was ever exposed
4. Prefer reverse proxy + TLS over exposing port `18789` directly
5. Keep firewall rules tight

Good firewall policy:

- allow `22` only from admin IPs if possible
- allow `80` and `443` publicly if you use reverse proxy + TLS
- avoid exposing raw `18789` publicly unless you fully understand the risk

## Troubleshooting

### Browser shows disconnected

Check:

```bash
curl -I https://gateway.example.com/healthz
```

Then check the browser console for WebSocket errors.

### Token mismatch

Make sure:

- `OPENCLAW_GATEWAY_TOKEN` on the server matches
- `NEXT_PUBLIC_GATEWAY_TOKEN` in SuperClaw matches

### Works locally but not through domain

Usually one of these:

- reverse proxy is not forwarding WebSocket upgrade headers
- TLS is not configured correctly
- DNS is pointing to the wrong server
- firewall is blocking traffic

### You only have a raw public IP

It can work, but a real domain with TLS is the better setup.

Use:

- a DNS record like `gateway.example.com`
- Caddy or Nginx
- `wss://gateway.example.com`

## Files relevant to this setup

SuperClaw:

- `superclaw/apps/web/hooks/use-gateway.ts`
- `superclaw/apps/web/lib/gateway-client.ts`
- `superclaw/apps/web/.env.local`

OpenClaw:

- `openclaw/docker-compose.yml`
- `openclaw/DEPLOYMENT_GUIDE.md`
- `openclaw/docs/gateway/remote.md`
- `openclaw/docs/gateway/security/index.md`

## Practical example

Server:

```bash
export OPENCLAW_GATEWAY_TOKEN="super-secret-token"
openclaw gateway --bind lan --port 18789
```

Reverse proxy:

```text
gateway.example.com -> 127.0.0.1:18789
```

SuperClaw:

```bash
NEXT_PUBLIC_GATEWAY_URL=wss://gateway.example.com
NEXT_PUBLIC_GATEWAY_TOKEN=super-secret-token
```

That is the current end-to-end connection path for a cloud-deployed OpenClaw gateway with this SuperClaw frontend.
