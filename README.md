# SuperClaw - Web-Based OpenClaw Platform

> A simplified, web-based interface for OpenClaw that makes it easy to connect, configure, and manage all extensions through your browser.

---

## 🎯 What is SuperClaw?

SuperClaw is a web application that provides a user-friendly interface for OpenClaw. Instead of using command-line tools and editing JSON files, you can:

- ✅ **Sign up through a website** - No CLI required
- ✅ **Connect via web browser** - Visual dashboard
- ✅ **Manage all 75+ extensions** - Click to enable/disable
- ✅ **Configure channels visually** - Forms instead of JSON
- ✅ **Real-time status** - See what's happening live

---

## 🚀 Quick Start (5 Minutes)

### 1. Start OpenClaw Gateway

```bash
cd openclaw
openclaw gateway --port 18789
```

### 2. Start SuperClaw Web App

```bash
cd superclaw/apps/web
npm install
npm run dev
```

### 3. Open Browser

```
http://localhost:3000
```

### 4. Sign Up & Connect

- Create an account
- Dashboard automatically connects to gateway
- Start managing extensions!

**Full instructions:** See `QUICK_START.md`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **QUICK_START.md** | Get up and running in 5 minutes |
| **CLOUD_OPENCLAW_CONNECTION_GUIDE.md** | Connect SuperClaw to a cloud-deployed OpenClaw gateway |
| **WEB_BASED_OPENCLAW_GUIDE.md** | Complete implementation guide |
| **../openclaw/OPENCLAW_ARCHITECTURE_GUIDE.md** | How OpenClaw works |
| **../openclaw/DEPLOYMENT_GUIDE.md** | Production deployment |
| **../openclaw/RAM_REQUIREMENTS.md** | Memory requirements |

---

## ✨ Features

### ✅ Currently Working

- **Authentication** - Sign up, sign in, sign out with WorkOS
- **Gateway Connection** - Real-time WebSocket connection
- **Dashboard** - Status display and quick actions
- **Responsive UI** - Works on desktop and mobile
- **Dark/Light Theme** - Automatic theme switching

### 🚧 Coming Soon

- **Extension Marketplace** - Browse and enable 75+ extensions
- **Channel Configuration** - Visual forms for Telegram, Discord, etc.
- **Settings Management** - Configure LLM providers, security, etc.
- **Deployment Tools** - One-click deployments
- **Real-time Monitoring** - Live stats and logs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                   │
│    SuperClaw Web Interface               │
│    (Next.js + React + shadcn/ui)        │
└──────────────────┬──────────────────────┘
                   │ WebSocket (ws://)
                   ▼
┌─────────────────────────────────────────┐
│    OpenClaw Gateway (localhost:18789)   │
│  • 75+ Extensions                       │
│  • Channel Adapters                     │
│  • LLM Providers                        │
│  • Session Management                   │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** shadcn/ui, Tailwind CSS
- **Auth:** WorkOS AuthKit
- **Communication:** WebSocket
- **Backend:** OpenClaw Gateway

---

## 📦 Project Structure

```
superclaw/
├── apps/
│   └── web/                    # Next.js web application
│       ├── app/                # App router pages
│       │   ├── page.tsx        # Landing page
│       │   ├── dashboard/      # Dashboard
│       │   └── (auth)/         # Auth routes
│       ├── components/         # React components
│       │   ├── gateway-status.tsx
│       │   └── ui/             # shadcn/ui components
│       ├── hooks/              # React hooks
│       │   └── use-gateway.ts  # Gateway connection
│       ├── lib/                # Utilities
│       │   ├── gateway-client.ts
│       │   └── utils.ts
│       └── .env.local          # Environment variables
├── QUICK_START.md              # Quick start guide
├── WEB_BASED_OPENCLAW_GUIDE.md # Full implementation guide
└── README.md                   # This file
```

---

## 🎨 Screenshots

### Landing Page
```
┌─────────────────────────────────────────┐
│  SuperClaw                    Sign In   │
├─────────────────────────────────────────┤
│                                         │
│     Welcome to SuperClaw                │
│     The powerful extension platform     │
│                                         │
│     [Get Started]  [Sign In]            │
│                                         │
│  🚀 Easy Deployment                     │
│  🔌 Extension Marketplace               │
│  ⚙️ Web Management                      │
└─────────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────────┐
│  Dashboard                              │
├─────────────────────────────────────────┤
│  🟢 Connected - Gateway is online       │
├─────────────────────────────────────────┤
│  🔌 Extensions  💬 Channels  ⚙️ Settings│
└─────────────────────────────────────────┘
```

---

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenClaw installed

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/superclaw.git
cd superclaw/apps/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### Environment Variables

```bash
# Gateway
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
NEXT_PUBLIC_GATEWAY_TOKEN=your-token

# WorkOS Auth
WORKOS_API_KEY=your-api-key
WORKOS_CLIENT_ID=your-client-id
WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_COOKIE_PASSWORD=your-32-char-secret
```

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd superclaw/apps/web
vercel
```

### Option 2: Docker

```bash
# Build image
docker build -t superclaw-web .

# Run container
docker run -p 3000:3000 superclaw-web
```

### Option 3: Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Priority Features

- [ ] Extension marketplace UI
- [ ] Channel configuration forms
- [ ] Settings management interface
- [ ] Real-time monitoring dashboard
- [ ] Deployment automation
- [ ] Mobile app

---

## 📝 Roadmap

### Phase 1: Core Features (Current)
- [x] Authentication system
- [x] Gateway connection
- [x] Basic dashboard
- [ ] Extension marketplace
- [ ] Channel configuration

### Phase 2: Advanced Features
- [ ] Settings management
- [ ] Real-time monitoring
- [ ] Log viewer
- [ ] Deployment tools
- [ ] API documentation

### Phase 3: Production Ready
- [ ] Managed hosting
- [ ] One-click deployments
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Analytics dashboard

---

## 🐛 Troubleshooting

### Gateway Won't Connect

```bash
# Check gateway is running
ps aux | grep openclaw

# Check port is open
lsof -i :18789

# View logs
openclaw logs --follow
```

### Authentication Issues

```bash
# Verify WorkOS credentials
echo $WORKOS_API_KEY
echo $WORKOS_CLIENT_ID

# Clear cookies
# In browser console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
});
```

**More help:** See `QUICK_START.md` troubleshooting section

---

## 📄 License

MIT License - Same as OpenClaw

---

## 🙏 Acknowledgments

- **OpenClaw** - The powerful AI assistant platform
- **shadcn/ui** - Beautiful UI components
- **WorkOS** - Authentication infrastructure
- **Vercel** - Hosting and deployment

---

## 📞 Support

- **Documentation:** See docs above
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** support@superclaw.ai (coming soon)

---

## 🌟 Star Us!

If you find SuperClaw useful, please star the repository!

---

**Built with ❤️ by the SuperClaw team**
