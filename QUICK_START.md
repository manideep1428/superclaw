# SuperClaw Quick Start Guide

## What is SuperClaw?

SuperClaw is a web-based interface for OpenClaw that makes it easy to:
- Connect to OpenClaw gateway through your browser
- Manage all 75+ extensions without CLI
- Configure channels and settings visually
- Deploy and monitor your OpenClaw instance

---

## Quick Start (5 Minutes)

### Step 1: Start OpenClaw Gateway

```bash
# Terminal 1: Start the gateway
cd openclaw
openclaw gateway --port 18789
```

### Step 2: Start SuperClaw Web App

```bash
# Terminal 2: Start the web interface
cd superclaw/apps/web
npm install
npm run dev
```

### Step 3: Open in Browser

```
http://localhost:3000
```

### Step 4: Sign Up / Sign In

1. Click "Sign Up" or "Sign In"
2. Complete authentication
3. You'll be redirected to the dashboard

### Step 5: Connect to Gateway

The dashboard will automatically connect to your local gateway at `ws://localhost:18789`

You should see:
- 🟢 **Connected** - Gateway is online and ready
- Quick action buttons enabled
- Gateway information displayed

---

## What You Can Do Now

### ✅ Currently Working

1. **Authentication**
   - Sign up with email
   - Sign in / Sign out
   - Protected routes

2. **Gateway Connection**
   - Real-time connection status
   - Auto-reconnect on disconnect
   - Connection indicator

3. **Dashboard**
   - Gateway status display
   - Quick action cards
   - Setup instructions

### 🚧 Coming Soon

1. **Extension Marketplace**
   - Browse all 75+ extensions
   - Enable/disable extensions
   - View extension details
   - Search and filter

2. **Channel Configuration**
   - Configure Telegram, Discord, Slack, etc.
   - Visual configuration forms
   - Test connections
   - Save settings

3. **Settings Management**
   - LLM provider setup
   - Context window configuration
   - Security settings
   - Advanced options

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Browser (localhost:3000)        │
│       SuperClaw Web Interface           │
└──────────────────┬──────────────────────┘
                   │ WebSocket
                   ▼
┌─────────────────────────────────────────┐
│    OpenClaw Gateway (localhost:18789)   │
│  • All extensions available             │
│  • Channel adapters                     │
│  • LLM providers                        │
└─────────────────────────────────────────┘
```

---

## Environment Variables

Create `.env.local` in `superclaw/apps/web/`:

```bash
# Gateway Connection
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
NEXT_PUBLIC_GATEWAY_TOKEN=your-token-here

# WorkOS Authentication (get from https://workos.com)
WORKOS_API_KEY=your-workos-api-key
WORKOS_CLIENT_ID=your-workos-client-id
WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_COOKIE_PASSWORD=your-32-char-secret
```

---

## Development

### File Structure

```
superclaw/apps/web/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard (server)
│   │   └── dashboard-client.tsx  # Dashboard (client)
│   └── (auth)/               # Auth routes
├── components/
│   ├── gateway-status.tsx    # Gateway status indicator
│   └── ui/                   # shadcn/ui components
├── hooks/
│   └── use-gateway.ts        # Gateway connection hook
├── lib/
│   ├── gateway-client.ts     # WebSocket client
│   └── utils.ts              # Utilities
└── .env.local                # Environment variables
```

### Key Components

**Gateway Client** (`lib/gateway-client.ts`)
- WebSocket connection management
- Auto-reconnect logic
- Event handling
- Message sending/receiving

**Gateway Hook** (`hooks/use-gateway.ts`)
- React hook for gateway state
- Status updates
- Connection controls
- Error handling

**Status Indicator** (`components/gateway-status.tsx`)
- Visual connection status
- Connect/disconnect buttons
- Status descriptions

---

## Troubleshooting

### Gateway Won't Connect

**Problem:** Dashboard shows "Disconnected" or "Error"

**Solutions:**

1. **Check gateway is running:**
   ```bash
   # Should show gateway process
   ps aux | grep openclaw
   ```

2. **Check port 18789 is open:**
   ```bash
   lsof -i :18789
   ```

3. **Check gateway logs:**
   ```bash
   openclaw logs --follow
   ```

4. **Try manual connection:**
   ```bash
   # In browser console
   const ws = new WebSocket('ws://localhost:18789');
   ws.onopen = () => console.log('Connected!');
   ws.onerror = (e) => console.error('Error:', e);
   ```

### Authentication Issues

**Problem:** Can't sign in or sign up

**Solutions:**

1. **Check WorkOS credentials:**
   - Verify `WORKOS_API_KEY` is set
   - Verify `WORKOS_CLIENT_ID` is set
   - Check WorkOS dashboard for errors

2. **Check redirect URI:**
   - Must match `WORKOS_REDIRECT_URI`
   - Default: `http://localhost:3000/callback`

3. **Clear cookies:**
   ```bash
   # In browser console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
   });
   ```

### Port Already in Use

**Problem:** Port 3000 or 18789 already in use

**Solutions:**

1. **Find and kill process:**
   ```bash
   # Find process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Find process on port 18789
   lsof -ti:18789 | xargs kill -9
   ```

2. **Use different port:**
   ```bash
   # Web app on port 3001
   PORT=3001 npm run dev
   
   # Gateway on port 18790
   openclaw gateway --port 18790
   ```

---

## Next Steps

### For Users

1. ✅ Complete this quick start
2. ⬜ Explore the dashboard
3. ⬜ Wait for extension marketplace (coming soon)
4. ⬜ Configure your first channel
5. ⬜ Deploy to production

### For Developers

1. ✅ Set up development environment
2. ⬜ Read `WEB_BASED_OPENCLAW_GUIDE.md`
3. ⬜ Implement extension marketplace
4. ⬜ Build channel configuration UI
5. ⬜ Add settings management
6. ⬜ Create deployment options

---

## Resources

- **Full Guide:** `superclaw/WEB_BASED_OPENCLAW_GUIDE.md`
- **OpenClaw Docs:** `openclaw/OPENCLAW_ARCHITECTURE_GUIDE.md`
- **Deployment Guide:** `openclaw/DEPLOYMENT_GUIDE.md`
- **RAM Requirements:** `openclaw/RAM_REQUIREMENTS.md`

---

## Support

Having issues? Check:
1. This troubleshooting section
2. OpenClaw logs: `openclaw logs --follow`
3. Browser console for errors
4. GitHub issues

---

## What's Different from OpenClaw CLI?

| Feature | OpenClaw CLI | SuperClaw Web |
|---------|--------------|---------------|
| **Setup** | Command line | Web browser |
| **Configuration** | Edit JSON files | Visual forms |
| **Extensions** | Manual install | Click to enable |
| **Channels** | Config file | Web interface |
| **Status** | CLI commands | Real-time dashboard |
| **Learning Curve** | Steep | Gentle |
| **Power Users** | ✅ Perfect | ⚠️ Less control |
| **Beginners** | ⚠️ Difficult | ✅ Easy |

**Use OpenClaw CLI if:**
- You're comfortable with terminal
- You need maximum control
- You're automating deployments
- You prefer config files

**Use SuperClaw Web if:**
- You prefer visual interfaces
- You're new to OpenClaw
- You want quick setup
- You manage multiple instances

---

## Contributing

Want to help build SuperClaw?

1. Fork the repository
2. Create a feature branch
3. Implement your feature
4. Test thoroughly
5. Submit a pull request

**Priority Features:**
- Extension marketplace UI
- Channel configuration forms
- Settings management
- Real-time status updates
- Deployment automation

---

## License

Same as OpenClaw - MIT License

