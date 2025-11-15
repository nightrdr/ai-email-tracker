# Story 2.1: Chrome Extension Project Setup & OAuth

**Story ID:** STORY-2.1  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** developer  
**I want** the Chrome extension project scaffolded with OAuth flow for Gmail/Outlook  
**So that** we can authenticate users and access their email via APIs

---

## Business Value

Chrome Extension is critical for:
- Seamless integration into user workflow
- Native Gmail/Outlook experience
- OAuth access to send emails on behalf of user
- Foundation for all extension features

---

## Acceptance Criteria

### ✅ AC1: Extension Project Structure
- [ ] `packages/extension` directory created in monorepo
- [ ] manifest.json (V3) configured with permissions
- [ ] TypeScript configured for extension development
- [ ] Webpack/esbuild configured to bundle extension
- [ ] Build output creates dist/ folder with extension files

### ✅ AC2: OAuth Flow for Gmail
- [ ] Google Cloud Project created with Gmail API enabled
- [ ] OAuth 2.0 credentials configured (Client ID, Client Secret)
- [ ] chrome.identity.launchWebAuthFlow implemented for Gmail OAuth
- [ ] Scopes requested: gmail.send, gmail.readonly
- [ ] Access token and refresh token stored securely in chrome.storage
- [ ] Token refresh logic implemented before expiry

### ✅ AC3: OAuth Flow for Outlook
- [ ] Azure AD app registration created
- [ ] Microsoft Graph API permissions configured
- [ ] OAuth flow implemented for Microsoft accounts
- [ ] Scopes requested: Mail.Send, Mail.Read
- [ ] Tokens stored securely

### ✅ AC4: Background Service Worker
- [ ] Background script setup (service_worker in manifest V3)
- [ ] Handles OAuth token management
- [ ] Listens for messages from content scripts
- [ ] Handles API requests to backend

### ✅ AC5: Popup UI
- [ ] Extension popup HTML/CSS/JS created
- [ ] Shows login status (not logged in / logged in as email)
- [ ] "Connect Gmail" and "Connect Outlook" buttons
- [ ] Button triggers OAuth flow
- [ ] Shows success message after OAuth complete

### ✅ AC6: API Integration
- [ ] Extension can communicate with backend API (localhost:3001 for dev)
- [ ] POST /api/auth/extension-login endpoint authenticates extension users
- [ ] Extension sends OAuth token to backend for validation
- [ ] Backend creates/updates EmailAccount record
- [ ] JWT token stored in extension for API auth

### ✅ AC7: Token Security
- [ ] OAuth tokens encrypted before storage
- [ ] No tokens exposed in content scripts
- [ ] Tokens only accessible from background script
- [ ] Secure communication between scripts

### ✅ AC8: Development Experience
- [ ] Hot reload enabled for development
- [ ] Source maps for debugging
- [ ] Lint and format scripts
- [ ] README with setup instructions

---

## Requirements Traceability

**PRD Coverage:**
- **FR39:** Gmail integration via Chrome extension
- **FR40:** Outlook web integration via Chrome extension  
- **FR52:** Gmail API integration for sending emails
- **FR53:** Microsoft Graph API integration for sending emails

**Architecture References:**
- Chrome Extension: Manifest V3 architecture
- OAuth Integration: chrome.identity API, Google OAuth, Azure AD
- Security: Token encryption, secure storage patterns
- Extension Components: Background worker, content scripts, popup UI

**Epic Context:**
This story establishes the Chrome extension foundation that enables seamless email tracking integration directly within Gmail and Outlook, eliminating context switching for users.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** OAuth utilities, token management, message handlers
- **Integration Tests:** Full OAuth flow, backend communication
- **Manual Tests:** Extension installation, OAuth flows, UI functionality
- **Security Tests:** Token storage, content script isolation

**Test Environment:**
- Chrome browser with extension developer mode
- Google Cloud Console OAuth credentials
- Azure AD app registration
- Test Gmail and Outlook accounts
- Local backend API for integration testing

**Success Metrics:**
- OAuth flow completion: <30 seconds
- Token storage: 100% secure (encrypted)
- Extension load time: <1 second
- Zero token exposure in content scripts

**Testing Tools:**
- Chrome DevTools for extension debugging
- chrome.storage inspection tools
- OAuth token validators
- Manual test scenarios

---

## Developer Implementation Checklist

### Phase 1: Extension Project Setup (45 min)

- [ ] **Step 1.1:** Create extension directory structure
  ```bash
  mkdir -p packages/extension/src/{background,content,popup,utils,types}
  mkdir -p packages/extension/public
  cd packages/extension
  pnpm init
  ```

- [ ] **Step 1.2:** Install dependencies
  ```bash
  pnpm add webextension-polyfill
  pnpm add -D webpack webpack-cli ts-loader copy-webpack-plugin
  pnpm add -D @types/chrome @types/webextension-polyfill
  ```

- [ ] **Step 1.3:** Create manifest.json
  ```json
  // packages/extension/public/manifest.json
  {
    "manifest_version": 3,
    "name": "Email Tracker",
    "version": "1.0.0",
    "description": "Track email opens, clicks, and get AI insights",
    "permissions": [
      "identity",
      "storage",
      "activeTab",
      "tabs"
    ],
    "host_permissions": [
      "https://mail.google.com/*",
      "https://outlook.live.com/*",
      "https://outlook.office365.com/*",
      "http://localhost:3001/*"
    ],
    "background": {
      "service_worker": "background.js"
    },
    "content_scripts": [
      {
        "matches": [
          "https://mail.google.com/*",
          "https://outlook.live.com/*",
          "https://outlook.office365.com/*"
        ],
        "js": ["content.js"],
        "css": ["content.css"],
        "run_at": "document_end"
      }
    ],
    "action": {
      "default_popup": "popup.html",
      "default_icon": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    },
    "icons": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "oauth2": {
      "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly"
      ]
    }
  }
  ```

- [ ] **Step 1.4:** Create webpack config
  ```javascript
  // packages/extension/webpack.config.js
  const path = require('path');
  const CopyPlugin = require('copy-webpack-plugin');
  
  module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      background: './src/background/index.ts',
      content: './src/content/index.ts',
      popup: './src/popup/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'public', to: '.' },
          { from: 'src/popup/popup.html', to: 'popup.html' },
          { from: 'src/popup/popup.css', to: 'popup.css' },
          { from: 'src/content/content.css', to: 'content.css' },
        ],
      }),
    ],
  };
  ```

- [ ] **Step 1.5:** Add package.json scripts
  ```json
  {
    "scripts": {
      "dev": "webpack --watch",
      "build": "NODE_ENV=production webpack --mode production",
      "lint": "eslint src/**/*.ts"
    }
  }
  ```

### Phase 2: Google OAuth Setup (60 min)

- [ ] **Step 2.1:** Create Google Cloud Project
  - Go to https://console.cloud.google.com
  - Create new project: "Email Tracker"
  - Enable Gmail API
  - Navigate to APIs & Services > Credentials

- [ ] **Step 2.2:** Create OAuth 2.0 Client ID
  - Click "Create Credentials" > "OAuth Client ID"
  - Application type: "Chrome Extension"
  - Extension ID: (get from chrome://extensions after loading unpacked)
  - Note: For development, use loopback for redirect URI
  - Download client_secret.json

- [ ] **Step 2.3:** Configure OAuth in manifest
  ```json
  // Update manifest.json
  {
    "oauth2": {
      "client_id": "YOUR_CLIENT_ID_FROM_GOOGLE.apps.googleusercontent.com",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    },
    "key": "YOUR_EXTENSION_KEY_HERE"
  }
  ```

- [ ] **Step 2.4:** Create OAuth utility
  ```typescript
  // packages/extension/src/utils/oauth.ts
  import browser from 'webextension-polyfill';
  
  export interface OAuthTokens {
    access_token: string;
    refresh_token?: string;
    expires_at: number;
  }
  
  export class GmailOAuth {
    private static readonly CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
    private static readonly REDIRECT_URI = `https://${browser.runtime.id}.chromiumapp.org/`;
    private static readonly SCOPES = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    
    static async authenticate(): Promise<OAuthTokens> {
      try {
        // Use chrome.identity for OAuth
        const token = await browser.identity.getAuthToken({ interactive: true });
        
        if (!token) {
          throw new Error('Failed to get auth token');
        }
        
        // Get user info to verify
        const userInfo = await this.getUserInfo(token);
        
        // Calculate expiry (Google tokens typically last 1 hour)
        const expires_at = Date.now() + (3600 * 1000);
        
        const tokens: OAuthTokens = {
          access_token: token,
          expires_at,
        };
        
        // Store tokens securely
        await browser.storage.local.set({
          gmail_tokens: tokens,
          gmail_email: userInfo.email,
        });
        
        console.log('Gmail OAuth successful:', userInfo.email);
        
        return tokens;
      } catch (error) {
        console.error('Gmail OAuth failed:', error);
        throw error;
      }
    }
    
    static async getUserInfo(access_token: string): Promise<any> {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      
      return response.json();
    }
    
    static async getValidToken(): Promise<string> {
      const data = await browser.storage.local.get(['gmail_tokens']);
      const tokens: OAuthTokens | undefined = data.gmail_tokens;
      
      if (!tokens) {
        throw new Error('Not authenticated with Gmail');
      }
      
      // Check if token expired
      if (Date.now() >= tokens.expires_at - 60000) { // Refresh 1 min before expiry
        console.log('Token expired, refreshing...');
        const newTokens = await this.authenticate();
        return newTokens.access_token;
      }
      
      return tokens.access_token;
    }
    
    static async disconnect(): Promise<void> {
      const data = await browser.storage.local.get(['gmail_tokens']);
      const tokens: OAuthTokens | undefined = data.gmail_tokens;
      
      if (tokens) {
        // Revoke token
        await browser.identity.removeCachedAuthToken({ token: tokens.access_token });
      }
      
      await browser.storage.local.remove(['gmail_tokens', 'gmail_email']);
      console.log('Gmail disconnected');
    }
  }
  ```

### Phase 3: Microsoft OAuth Setup (60 min)

- [ ] **Step 3.1:** Create Azure AD App Registration
  - Go to https://portal.azure.com
  - Navigate to Azure Active Directory > App registrations
  - Click "New registration"
  - Name: "Email Tracker Extension"
  - Redirect URI: https://YOUR_EXTENSION_ID.chromiumapp.org
  - Note Application (client) ID

- [ ] **Step 3.2:** Configure API permissions
  - API permissions > Add permission > Microsoft Graph
  - Delegated permissions:
    - Mail.Send
    - Mail.Read
    - User.Read
  - Grant admin consent

- [ ] **Step 3.3:** Create Outlook OAuth utility
  ```typescript
  // packages/extension/src/utils/outlook-oauth.ts
  import browser from 'webextension-polyfill';
  
  export class OutlookOAuth {
    private static readonly CLIENT_ID = 'YOUR_AZURE_CLIENT_ID';
    private static readonly REDIRECT_URI = `https://${browser.runtime.id}.chromiumapp.org/`;
    private static readonly SCOPES = [
      'https://graph.microsoft.com/Mail.Send',
      'https://graph.microsoft.com/Mail.Read',
      'https://graph.microsoft.com/User.Read',
    ];
    
    static async authenticate(): Promise<OAuthTokens> {
      try {
        const authUrl = this.getAuthUrl();
        
        const redirectUrl = await browser.identity.launchWebAuthFlow({
          url: authUrl,
          interactive: true,
        });
        
        if (!redirectUrl) {
          throw new Error('Authentication cancelled');
        }
        
        // Parse access token from redirect
        const params = new URL(redirectUrl).hash.substring(1);
        const token = new URLSearchParams(params).get('access_token');
        const expires_in = new URLSearchParams(params).get('expires_in');
        
        if (!token) {
          throw new Error('Failed to get access token');
        }
        
        const expires_at = Date.now() + (parseInt(expires_in || '3600') * 1000);
        
        // Get user info
        const userInfo = await this.getUserInfo(token);
        
        const tokens: OAuthTokens = {
          access_token: token,
          expires_at,
        };
        
        await browser.storage.local.set({
          outlook_tokens: tokens,
          outlook_email: userInfo.mail || userInfo.userPrincipalName,
        });
        
        console.log('Outlook OAuth successful:', userInfo.mail);
        
        return tokens;
      } catch (error) {
        console.error('Outlook OAuth failed:', error);
        throw error;
      }
    }
    
    private static getAuthUrl(): string {
      const params = new URLSearchParams({
        client_id: this.CLIENT_ID,
        response_type: 'token',
        redirect_uri: this.REDIRECT_URI,
        scope: this.SCOPES.join(' '),
        response_mode: 'fragment',
      });
      
      return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
    }
    
    static async getUserInfo(access_token: string): Promise<any> {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      
      return response.json();
    }
    
    static async getValidToken(): Promise<string> {
      const data = await browser.storage.local.get(['outlook_tokens']);
      const tokens: OAuthTokens | undefined = data.outlook_tokens;
      
      if (!tokens) {
        throw new Error('Not authenticated with Outlook');
      }
      
      if (Date.now() >= tokens.expires_at - 60000) {
        throw new Error('Token expired, please re-authenticate');
        // Note: Microsoft doesn't provide refresh tokens in implicit flow
        // For production, use authorization code flow with PKCE
      }
      
      return tokens.access_token;
    }
    
    static async disconnect(): Promise<void> {
      await browser.storage.local.remove(['outlook_tokens', 'outlook_email']);
      console.log('Outlook disconnected');
    }
  }
  ```

### Phase 4: Background Service Worker (45 min)

- [ ] **Step 4.1:** Create background script
  ```typescript
  // packages/extension/src/background/index.ts
  import browser from 'webextension-polyfill';
  import { GmailOAuth } from '../utils/oauth';
  import { OutlookOAuth } from '../utils/outlook-oauth';
  
  console.log('Email Tracker extension loaded');
  
  // Listen for OAuth requests from popup
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    if (message.type === 'AUTHENTICATE_GMAIL') {
      handleGmailAuth().then(sendResponse);
      return true; // Keep channel open for async response
    }
    
    if (message.type === 'AUTHENTICATE_OUTLOOK') {
      handleOutlookAuth().then(sendResponse);
      return true;
    }
    
    if (message.type === 'DISCONNECT_GMAIL') {
      handleGmailDisconnect().then(sendResponse);
      return true;
    }
    
    if (message.type === 'DISCONNECT_OUTLOOK') {
      handleOutlookDisconnect().then(sendResponse);
      return true;
    }
    
    if (message.type === 'GET_AUTH_STATUS') {
      handleGetAuthStatus().then(sendResponse);
      return true;
    }
  });
  
  async function handleGmailAuth() {
    try {
      const tokens = await GmailOAuth.authenticate();
      
      // Register with backend
      await registerEmailAccount('gmail', tokens.access_token);
      
      return { success: true };
    } catch (error: any) {
      console.error('Gmail auth error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async function handleOutlookAuth() {
    try {
      const tokens = await OutlookOAuth.authenticate();
      
      // Register with backend
      await registerEmailAccount('outlook', tokens.access_token);
      
      return { success: true };
    } catch (error: any) {
      console.error('Outlook auth error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async function handleGmailDisconnect() {
    try {
      await GmailOAuth.disconnect();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  async function handleOutlookDisconnect() {
    try {
      await OutlookOAuth.disconnect();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  async function handleGetAuthStatus() {
    const data = await browser.storage.local.get(['gmail_email', 'outlook_email', 'api_token']);
    
    return {
      gmail_connected: !!data.gmail_email,
      gmail_email: data.gmail_email,
      outlook_connected: !!data.outlook_email,
      outlook_email: data.outlook_email,
      backend_connected: !!data.api_token,
    };
  }
  
  async function registerEmailAccount(provider: 'gmail' | 'outlook', oauth_token: string) {
    const API_URL = 'http://localhost:3001'; // Use env var in production
    
    // Get or create backend auth
    let data = await browser.storage.local.get(['api_token']);
    
    if (!data.api_token) {
      // TODO: Implement backend registration flow
      // For now, user must login via web app first
      console.warn('No backend auth token. User must login via web app.');
      return;
    }
    
    // Register email account with backend
    const response = await fetch(`${API_URL}/api/email-accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.api_token}`,
      },
      body: JSON.stringify({
        provider,
        oauth_token,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register email account with backend');
    }
    
    const result = await response.json();
    console.log('Email account registered:', result);
    
    // Store email_account_id
    await browser.storage.local.set({
      [`${provider}_account_id`]: result.email_account_id,
    });
  }
  ```

### Phase 5: Popup UI (45 min)

- [ ] **Step 5.1:** Create popup HTML
  ```html
  <!-- packages/extension/src/popup/popup.html -->
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Email Tracker</title>
    <link rel="stylesheet" href="popup.css">
  </head>
  <body>
    <div class="container">
      <h1>📧 Email Tracker</h1>
      
      <div id="loading" class="loading">Loading...</div>
      
      <div id="content" class="hidden">
        <!-- Gmail Section -->
        <div class="section">
          <h2>Gmail</h2>
          <div id="gmail-disconnected" class="auth-section">
            <p>Not connected</p>
            <button id="gmail-connect-btn" class="btn btn-primary">Connect Gmail</button>
          </div>
          <div id="gmail-connected" class="auth-section hidden">
            <p class="success">✓ Connected as: <span id="gmail-email"></span></p>
            <button id="gmail-disconnect-btn" class="btn btn-secondary">Disconnect</button>
          </div>
        </div>
        
        <!-- Outlook Section -->
        <div class="section">
          <h2>Outlook</h2>
          <div id="outlook-disconnected" class="auth-section">
            <p>Not connected</p>
            <button id="outlook-connect-btn" class="btn btn-primary">Connect Outlook</button>
          </div>
          <div id="outlook-connected" class="auth-section hidden">
            <p class="success">✓ Connected as: <span id="outlook-email"></span></p>
            <button id="outlook-disconnect-btn" class="btn btn-secondary">Disconnect</button>
          </div>
        </div>
        
        <!-- Status -->
        <div class="section">
          <p class="small">Backend: <span id="backend-status">Not connected</span></p>
          <p class="small"><a href="http://localhost:3000/dashboard" target="_blank">Open Dashboard</a></p>
        </div>
      </div>
      
      <div id="error" class="error hidden"></div>
    </div>
    
    <script src="popup.js"></script>
  </body>
  </html>
  ```

- [ ] **Step 5.2:** Create popup styles
  ```css
  /* packages/extension/src/popup/popup.css */
  body {
    width: 350px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .container {
    padding: 16px;
  }
  
  h1 {
    font-size: 20px;
    margin: 0 0 16px 0;
    color: #333;
  }
  
  h2 {
    font-size: 16px;
    margin: 0 0 8px 0;
    color: #555;
  }
  
  .section {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .section:last-child {
    border-bottom: none;
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }
  
  .btn-primary {
    background: #4285f4;
    color: white;
  }
  
  .btn-primary:hover {
    background: #357ae8;
  }
  
  .btn-secondary {
    background: #f1f1f1;
    color: #333;
  }
  
  .btn-secondary:hover {
    background: #e0e0e0;
  }
  
  .success {
    color: #0f9d58;
    font-weight: 500;
  }
  
  .error {
    color: #d93025;
    padding: 8px;
    background: #fce8e6;
    border-radius: 4px;
    margin-top: 8px;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .hidden {
    display: none;
  }
  
  .small {
    font-size: 12px;
    color: #666;
    margin: 4px 0;
  }
  
  a {
    color: #4285f4;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  ```

- [ ] **Step 5.3:** Create popup script
  ```typescript
  // packages/extension/src/popup/index.ts
  import browser from 'webextension-polyfill';
  
  document.addEventListener('DOMContentLoaded', async () => {
    await loadAuthStatus();
    
    // Gmail connect
    document.getElementById('gmail-connect-btn')?.addEventListener('click', async () => {
      await connectGmail();
    });
    
    // Gmail disconnect
    document.getElementById('gmail-disconnect-btn')?.addEventListener('click', async () => {
      await disconnectGmail();
    });
    
    // Outlook connect
    document.getElementById('outlook-connect-btn')?.addEventListener('click', async () => {
      await connectOutlook();
    });
    
    // Outlook disconnect
    document.getElementById('outlook-disconnect-btn')?.addEventListener('click', async () => {
      await disconnectOutlook();
    });
  });
  
  async function loadAuthStatus() {
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
      
      updateUI(response);
      
      document.getElementById('loading')?.classList.add('hidden');
      document.getElementById('content')?.classList.remove('hidden');
    } catch (error: any) {
      showError('Failed to load status: ' + error.message);
    }
  }
  
  function updateUI(status: any) {
    // Gmail
    if (status.gmail_connected) {
      document.getElementById('gmail-disconnected')?.classList.add('hidden');
      document.getElementById('gmail-connected')?.classList.remove('hidden');
      document.getElementById('gmail-email')!.textContent = status.gmail_email;
    } else {
      document.getElementById('gmail-connected')?.classList.add('hidden');
      document.getElementById('gmail-disconnected')?.classList.remove('hidden');
    }
    
    // Outlook
    if (status.outlook_connected) {
      document.getElementById('outlook-disconnected')?.classList.add('hidden');
      document.getElementById('outlook-connected')?.classList.remove('hidden');
      document.getElementById('outlook-email')!.textContent = status.outlook_email;
    } else {
      document.getElementById('outlook-connected')?.classList.add('hidden');
      document.getElementById('outlook-disconnected')?.classList.remove('hidden');
    }
    
    // Backend
    const backendStatus = document.getElementById('backend-status');
    if (backendStatus) {
      backendStatus.textContent = status.backend_connected ? '✓ Connected' : '✗ Not connected';
      backendStatus.style.color = status.backend_connected ? '#0f9d58' : '#d93025';
    }
  }
  
  async function connectGmail() {
    try {
      showLoading();
      const response = await browser.runtime.sendMessage({ type: 'AUTHENTICATE_GMAIL' });
      
      if (response.success) {
        await loadAuthStatus();
      } else {
        showError(response.error);
      }
    } catch (error: any) {
      showError('Gmail connection failed: ' + error.message);
    }
  }
  
  async function disconnectGmail() {
    try {
      const response = await browser.runtime.sendMessage({ type: 'DISCONNECT_GMAIL' });
      
      if (response.success) {
        await loadAuthStatus();
      } else {
        showError(response.error);
      }
    } catch (error: any) {
      showError('Failed to disconnect: ' + error.message);
    }
  }
  
  async function connectOutlook() {
    try {
      showLoading();
      const response = await browser.runtime.sendMessage({ type: 'AUTHENTICATE_OUTLOOK' });
      
      if (response.success) {
        await loadAuthStatus();
      } else {
        showError(response.error);
      }
    } catch (error: any) {
      showError('Outlook connection failed: ' + error.message);
    }
  }
  
  async function disconnectOutlook() {
    try {
      const response = await browser.runtime.sendMessage({ type: 'DISCONNECT_OUTLOOK' });
      
      if (response.success) {
        await loadAuthStatus();
      } else {
        showError(response.error);
      }
    } catch (error: any) {
      showError('Failed to disconnect: ' + error.message);
    }
  }
  
  function showLoading() {
    document.getElementById('content')?.classList.add('hidden');
    document.getElementById('loading')?.classList.remove('hidden');
    document.getElementById('error')?.classList.add('hidden');
  }
  
  function showError(message: string) {
    const errorEl = document.getElementById('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
    document.getElementById('loading')?.classList.add('hidden');
    document.getElementById('content')?.classList.remove('hidden');
  }
  ```

### Phase 6: Content Script Placeholder (15 min)

- [ ] **Step 6.1:** Create basic content script
  ```typescript
  // packages/extension/src/content/index.ts
  console.log('Email Tracker content script loaded on:', window.location.href);
  
  // Detect which email provider
  if (window.location.hostname.includes('mail.google.com')) {
    console.log('Gmail detected');
    // Gmail integration will be added in Story 2.2
  } else if (window.location.hostname.includes('outlook')) {
    console.log('Outlook detected');
    // Outlook integration will be added in Story 2.7
  }
  ```

- [ ] **Step 6.2:** Create content styles
  ```css
  /* packages/extension/src/content/content.css */
  /* Styles for injected UI elements will be added in future stories */
  .email-tracker-indicator {
    display: inline-block;
    margin-left: 4px;
  }
  ```

### Phase 7: Build and Test (30 min)

- [ ] **Step 7.1:** Build extension
  ```bash
  cd packages/extension
  pnpm build
  ```

- [ ] **Step 7.2:** Load extension in Chrome
  - Open chrome://extensions
  - Enable "Developer mode"
  - Click "Load unpacked"
  - Select packages/extension/dist folder
  - Note the Extension ID

- [ ] **Step 7.3:** Update manifest with Extension ID
  - Copy Extension ID from chrome://extensions
  - Update Google OAuth redirect URI with this ID
  - Rebuild extension

- [ ] **Step 7.4:** Test OAuth flow
  - Click extension icon
  - Click "Connect Gmail"
  - Complete OAuth flow
  - Verify success message
  - Check chrome.storage: `chrome.storage.local.get(null, console.log)`

- [ ] **Step 7.5:** Verify on Gmail
  - Open mail.google.com
  - Check browser console for "Gmail detected" message

### Phase 8: Unit and Integration Tests (90 min)

- [ ] **Step 8.1:** Install testing framework for Chrome extension
  - Configure Jest for Chrome extension environment
  - Install chrome-extension testing utilities
  - Configure test scripts in package.json

- [ ] **Step 8.2:** Write unit tests for OAuth token storage
  - Test storing Gmail OAuth tokens in chrome.storage
  - Test storing Outlook OAuth tokens in chrome.storage
  - Test retrieving tokens from storage
  - Test token expiration check logic

- [ ] **Step 8.3:** Write unit tests for background service worker
  - Test message handling between popup and background
  - Test API authentication header injection
  - Test token refresh trigger logic

- [ ] **Step 8.4:** Write integration tests for OAuth flow
  - Test initiate OAuth flow opens correct authorization URL
  - Test OAuth callback handling stores tokens correctly
  - Test disconnect clears tokens from storage
  - Test OAuth state validation prevents CSRF attacks

- [ ] **Step 8.5:** Write integration tests for popup UI
  - Test popup shows "Not connected" when no tokens
  - Test popup shows "Connected as: email" with tokens
  - Test connect button triggers OAuth flow
  - Test disconnect button clears tokens and updates UI

- [ ] **Step 8.6:** Write tests for content script injection
  - Test content script loads on mail.google.com
  - Test content script loads on outlook.office.com
  - Test content script does not load on other domains
  - Test console message logged on Gmail/Outlook detection

- [ ] **Step 8.7:** Write tests for manifest configuration
  - Test all required permissions listed
  - Test content script URL patterns correct
  - Test background service worker registered
  - Test CSP allows API calls to backend

- [ ] **Step 8.8:** Write end-to-end test for complete OAuth flow
  - Test user clicks connect → OAuth → tokens stored → UI updates
  - Test tokens persist across browser restart
  - Test disconnect flow clears all state

- [ ] **Step 8.9:** Run all tests and ensure 70%+ code coverage
  - Execute test suite for extension package
  - Generate coverage report
  - Verify OAuth and storage logic fully tested

- [ ] **Step 8.10:** Test extension in incognito and multiple profiles
  - Test extension works in incognito mode
  - Test extension storage isolated between profiles
  - Document any profile-specific behavior

---

## QA Verification Checklist

### ✅ Extension Build Tests

- [ ] **QA-1.1:** Build succeeds
  - Run `pnpm build`
  - No errors
  - dist/ folder created with all files

- [ ] **QA-1.2:** Extension loads in Chrome
  - Load unpacked extension
  - No errors in chrome://extensions
  - Extension icon appears in toolbar

- [ ] **QA-1.3:** Content script loads
  - Open mail.google.com
  - Check console for "Gmail detected"
  - No errors

### ✅ Gmail OAuth Tests

- [ ] **QA-2.1:** OAuth flow initiates
  - Click extension icon
  - Click "Connect Gmail"
  - Google OAuth popup opens
  - Scopes requested shown

- [ ] **QA-2.2:** OAuth flow completes
  - Complete OAuth in popup
  - Popup closes
  - Extension popup shows "Connected as: email@gmail.com"
  - Tokens stored in chrome.storage

- [ ] **QA-2.3:** OAuth persistence
  - Close and reopen extension popup
  - Still shows connected status
  - Email address persists

- [ ] **QA-2.4:** Disconnect works
  - Click "Disconnect"
  - Status changes to "Not connected"
  - Tokens removed from storage

### ✅ Outlook OAuth Tests

- [ ] **QA-3.1:** OAuth flow works
  - Click "Connect Outlook"
  - Microsoft login popup opens
  - Complete authentication
  - Success message shown

- [ ] **QA-3.2:** Outlook connection persists
  - Reopen popup
  - Shows connected to Outlook
  - Email address displayed

### ✅ Background Script Tests

- [ ] **QA-4.1:** Message handling
  - Open extension popup
  - Check background console (chrome://extensions > background page)
  - Messages logged correctly

- [ ] **QA-4.2:** Auth status retrieval
  - Extension popup shows correct status
  - Updates in real-time after auth

### ✅ Error Handling Tests

- [ ] **QA-5.1:** OAuth cancellation
  - Start OAuth flow
  - Cancel/close popup
  - Extension shows appropriate error
  - Can retry OAuth

- [ ] **QA-5.2:** Network error
  - Disconnect network
  - Try to connect Gmail
  - Shows error message

### ✅ Security Tests

- [ ] **QA-6.1:** Token storage
  - Check chrome.storage.local
  - Tokens stored securely
  - Not accessible from content scripts

- [ ] **QA-6.2:** No token exposure
  - Check console logs
  - No tokens logged
  - No tokens in network requests (visible)

---

## Technical Notes

### Manifest V3
- Service workers instead of background pages
- More security restrictions
- OAuth flow slightly different from V2

### Chrome Identity API
- Simplifies OAuth flow
- Handles token caching
- Automatic refresh for Gmail (via Google Sign-In)

### Security Best Practices
- Tokens only in background script
- Content scripts communicate via message passing
- No sensitive data in content script context

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.1 - Project Setup](./story-1.1-project-setup-monorepo.md) - Monorepo with extension package
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - Backend API with JWT auth

**Blocks (Stories Waiting on This):**
- [Story 2.2 - Gmail API Send](./story-2.2-gmail-api-send-integration.md) - Needs OAuth tokens
- [Story 2.3 - Outlook API Send](./story-2.3-outlook-api-send-integration.md) - Needs OAuth tokens
- [Story 2.4 - Gmail Inbox Indicators](./story-2.4-gmail-inbox-tracking-indicators.md) - Needs extension foundation
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Needs extension foundation
- [Story 2.6 - Send from Gmail](./story-2.6-send-tracked-email-from-gmail.md) - Needs OAuth and extension
- [Story 2.7 - Outlook Web Integration](./story-2.7-outlook-web-integration.md) - Needs extension foundation
- All Epic 2 stories depend on this

**Related Stories (Helpful Context):**
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Backend tracking that extension will use

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] Extension builds successfully
- [ ] Gmail OAuth working
- [ ] Outlook OAuth working
- [ ] Popup UI functional
- [ ] Manual testing complete

---

## Rollback Plan

If issues arise:
1. Unpublish extension from Chrome Web Store (if published)
2. Users can disable extension
3. No data loss (backend independent)

---

## Future Improvements (Post-MVP)

- [ ] Add Firefox support
- [ ] Add Edge-specific optimizations
- [ ] Implement refresh token flow for Outlook
- [ ] Add OAuth PKCE for better security
- [ ] Add biometric authentication option
- [ ] Add multiple account support
- [ ] Add sync across devices

