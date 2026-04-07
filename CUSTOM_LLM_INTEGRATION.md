# Custom LLM Provider Integration Guide

## Overview

This guide explains how to integrate your own LLM provider into SuperClaw, allowing users to connect their custom LLM endpoints through the web interface without needing OpenAI or Anthropic accounts.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Interface (Next.js)                   │
│  • LLM Provider Setup Form                                   │
│  • API Key Input                                             │
│  • Endpoint Configuration                                    │
│  • Test Connection Button                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  SuperClaw Backend API                       │
│  • Validate LLM credentials                                  │
│  • Store in database (encrypted)                             │
│  • Proxy requests to OpenClaw Gateway                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenClaw Gateway                           │
│  • Load custom LLM provider config                           │
│  • Route messages to custom endpoint                         │
│  • Handle responses                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Create Custom LLM Provider Extension

### File: `openclaw/extensions/custom-llm/openclaw.plugin.json`

```json
{
  "name": "custom-llm",
  "version": "1.0.0",
  "description": "Custom LLM provider for user-provided endpoints",
  "type": "provider",
  "main": "dist/index.js",
  "exports": {
    "provider": "./dist/provider.js",
    "setup": "./dist/setup.js"
  }
}
```

### File: `openclaw/extensions/custom-llm/src/provider.ts`

```typescript
import type { ProviderAdapter } from 'openclaw/plugin-sdk';

export interface CustomLLMConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class CustomLLMProvider implements ProviderAdapter {
  constructor(private config: CustomLLMConfig) {}

  async chat(params: {
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    maxTokens?: number;
  }) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...this.config.headers,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2000,
      }),
      signal: AbortSignal.timeout(this.config.timeout ?? 60000),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content ?? '',
      usage: {
        input: data.usage?.prompt_tokens,
        output: data.usage?.completion_tokens,
        total: data.usage?.total_tokens,
      },
    };
  }

  async stream(params: {
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    maxTokens?: number;
    onChunk: (chunk: string) => void;
  }) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...this.config.headers,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              params.onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}
```

---

## Step 2: Create Web Interface for LLM Setup

### File: `superclaw/apps/web/app/dashboard/llm-setup/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function LLMSetupPage() {
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/llm/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, apiKey, model }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({ success: true, message: 'Connection successful!' });
      } else {
        setTestResult({ success: false, message: data.error || 'Connection failed' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Network error: ' + String(error) });
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/llm/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, apiKey, model }),
      });

      if (response.ok) {
        alert('LLM provider configured successfully!');
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'Failed to save configuration'));
      }
    } catch (error) {
      alert('Network error: ' + String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Custom LLM Provider Setup</CardTitle>
          <CardDescription>
            Connect your own LLM provider endpoint. No OpenAI or Anthropic account needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://your-llm-api.com/v1/chat/completions"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Your LLM API endpoint (OpenAI-compatible format)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Your API key for authentication
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model Name</Label>
            <Input
              id="model"
              placeholder="gpt-3.5-turbo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              The model identifier to use
            </p>
          </div>

          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={testConnection}
              disabled={!endpoint || !apiKey || !model || testing}
              variant="outline"
            >
              {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Connection
            </Button>

            <Button
              onClick={saveConfiguration}
              disabled={!endpoint || !apiKey || !model || saving || !testResult?.success}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Supported LLM Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✅ OpenAI-compatible APIs (vLLM, Ollama, LM Studio)</li>
            <li>✅ HuggingFace Inference API</li>
            <li>✅ Together AI</li>
            <li>✅ Replicate</li>
            <li>✅ Custom self-hosted models</li>
            <li>✅ Any API following OpenAI chat completion format</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 3: Create Backend API Routes

### File: `superclaw/apps/web/app/api/llm/test/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { endpoint, apiKey, model } = await request.json();

    // Validate inputs
    if (!endpoint || !apiKey || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test the LLM endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: 'Hello! This is a test message.' }
        ],
        max_tokens: 50,
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API returned ${response.status}: ${errorText}` },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Validate response format
    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: 'Invalid response format from LLM API' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful!',
      response: data.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
```

### File: `superclaw/apps/web/app/api/llm/configure/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint, apiKey, model } = await request.json();

    // Validate inputs
    if (!endpoint || !apiKey || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Encrypt API key before storing
    const encryptedApiKey = encrypt(apiKey);

    // Store in database
    await prisma.llmProvider.upsert({
      where: { userId: session.user.id },
      update: {
        endpoint,
        apiKey: encryptedApiKey,
        model,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        endpoint,
        apiKey: encryptedApiKey,
        model,
      },
    });

    // Update OpenClaw gateway configuration
    await updateGatewayConfig(session.user.id, {
      endpoint,
      apiKey,
      model,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LLM configuration error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

async function updateGatewayConfig(
  userId: string,
  config: { endpoint: string; apiKey: string; model: string }
) {
  // Send configuration to OpenClaw gateway
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
  
  await fetch(`${gatewayUrl}/api/config/llm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GATEWAY_API_TOKEN}`,
    },
    body: JSON.stringify({
      userId,
      provider: 'custom-llm',
      config,
    }),
  });
}
```

---

## Step 4: Database Schema

### File: `superclaw/prisma/schema.prisma`

```prisma
model LlmProvider {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  endpoint  String
  apiKey    String   // Encrypted
  model     String
  headers   Json?    // Optional custom headers
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}
```

---

## Step 5: Encryption Utility

### File: `superclaw/apps/web/lib/encryption.ts`

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## Step 6: Environment Variables

### File: `superclaw/apps/web/.env`

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/superclaw"

# Encryption (generate with: openssl rand -hex 32)
ENCRYPTION_KEY="your-64-character-hex-key-here"

# OpenClaw Gateway
OPENCLAW_GATEWAY_URL="http://localhost:18789"
GATEWAY_API_TOKEN="your-secure-token-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

---

## Step 7: Pre-configured LLM Providers

### File: `superclaw/apps/web/app/dashboard/llm-setup/presets.tsx`

```typescript
export const LLM_PRESETS = [
  {
    name: 'Ollama (Local)',
    endpoint: 'http://localhost:11434/v1/chat/completions',
    model: 'llama2',
    description: 'Run models locally with Ollama',
  },
  {
    name: 'vLLM (Local)',
    endpoint: 'http://localhost:8000/v1/chat/completions',
    model: 'meta-llama/Llama-2-7b-chat-hf',
    description: 'High-performance local inference',
  },
  {
    name: 'LM Studio',
    endpoint: 'http://localhost:1234/v1/chat/completions',
    model: 'local-model',
    description: 'Easy local model hosting',
  },
  {
    name: 'HuggingFace',
    endpoint: 'https://api-inference.huggingface.co/models/YOUR_MODEL/v1/chat/completions',
    model: 'meta-llama/Llama-2-7b-chat-hf',
    description: 'HuggingFace Inference API',
  },
  {
    name: 'Together AI',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    description: 'Fast cloud inference',
  },
  {
    name: 'Custom',
    endpoint: '',
    model: '',
    description: 'Your own LLM endpoint',
  },
];
```

---

## Step 8: Complete Setup Flow

### User Journey:

1. **Sign up** → Create account on SuperClaw web interface
2. **Dashboard** → Navigate to "LLM Setup"
3. **Choose preset** → Select from Ollama, vLLM, HuggingFace, etc.
4. **Enter credentials** → Paste API key and endpoint
5. **Test connection** → Click "Test" to verify
6. **Save** → Configuration stored (encrypted)
7. **Start chatting** → Use the chat interface immediately

### No CLI Required:
- ✅ No `openclaw onboard` command
- ✅ No terminal access needed
- ✅ No manual config file editing
- ✅ Everything through web UI

---

## Step 9: Chat Interface Integration

### File: `superclaw/apps/web/app/dashboard/chat/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChatInterface } from '@/components/chat-interface';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'next/link';

export default function ChatPage() {
  const { data: session } = useSession();
  const [llmConfigured, setLlmConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLLMConfiguration();
  }, []);

  const checkLLMConfiguration = async () => {
    try {
      const response = await fetch('/api/llm/status');
      const data = await response.json();
      setLlmConfigured(data.configured);
    } catch (error) {
      console.error('Failed to check LLM configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!llmConfigured) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            You need to configure an LLM provider before you can start chatting.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/dashboard/llm-setup">Configure LLM Provider</Link>
        </Button>
      </div>
    );
  }

  return <ChatInterface />;
}
```

---

## Summary

This setup provides:

1. **Web-based LLM configuration** - No CLI needed
2. **Support for any OpenAI-compatible API** - Ollama, vLLM, HuggingFace, Together AI, custom endpoints
3. **Secure credential storage** - Encrypted API keys in database
4. **Test before save** - Verify connection works
5. **Pre-configured presets** - Quick setup for popular providers
6. **Seamless integration** - Works with all OpenClaw extensions
7. **User-friendly** - Click, paste, connect

Users can now:
- Sign up on your website
- Click "Setup LLM"
- Paste their API endpoint and key
- Start chatting immediately

No OpenAI or Anthropic account required!
