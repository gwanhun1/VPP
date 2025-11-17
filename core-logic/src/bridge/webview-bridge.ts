import type { AuthUser, FirebaseConfig } from '../firebase/types';

export type WebViewMessageType =
  | 'AUTH'
  | 'FIREBASE_CONFIG'
  | 'OPEN_SESSION'
  | 'THEME_MODE'
  | 'REQUEST_AUTH'
  | 'REQUEST_FIREBASE_CONFIG';

export type WebViewMessage<T = unknown> = {
  type: WebViewMessageType;
  payload?: T;
};

export type WebViewBridgeOptions = {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
};

type WindowWithWebView = typeof globalThis & {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  navigator?: {
    userAgent: string;
  };
};

class WebViewBridge {
  private static instance: WebViewBridge;
  private options: Required<WebViewBridgeOptions>;

  private constructor(options?: WebViewBridgeOptions) {
    this.options = {
      maxRetries: options?.maxRetries ?? 3,
      retryDelay: options?.retryDelay ?? 150,
      timeout: options?.timeout ?? 5000,
    };
  }

  static getInstance(options?: WebViewBridgeOptions): WebViewBridge {
    if (!WebViewBridge.instance) {
      WebViewBridge.instance = new WebViewBridge(options);
    }
    return WebViewBridge.instance;
  }

  isWebView(): boolean {
    const win = globalThis as WindowWithWebView;
    if (!win.navigator) return false;
    const userAgent = win.navigator.userAgent;
    const isWebViewUA = /wv|WebView|Version.*Chrome/i.test(userAgent);
    const hasReactNativeWebView = !!win.ReactNativeWebView;
    return isWebViewUA || hasReactNativeWebView;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async postMessage<T>(
    message: WebViewMessage<T>,
    options?: { retries?: number }
  ): Promise<boolean> {
    const win = globalThis as WindowWithWebView;
    if (!this.isWebView() || !win.ReactNativeWebView) {
      console.warn('[WebViewBridge] Not in WebView environment');
      return false;
    }

    const maxRetries = options?.retries ?? this.options.maxRetries;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const messageString = JSON.stringify(message);
        win.ReactNativeWebView.postMessage(messageString);
        return true;
      } catch (error) {
        if (attempt < maxRetries) {
          await this.delay(this.options.retryDelay);
        } else {
          console.error(
            `[WebViewBridge] Failed to post message after ${
              maxRetries + 1
            } attempts:`,
            error
          );
          return false;
        }
      }
    }

    return false;
  }

  async sendAuth(authUser: AuthUser | null): Promise<boolean> {
    return this.postMessage<AuthUser | null>({
      type: 'AUTH',
      payload: authUser,
    });
  }

  async sendFirebaseConfig(config: FirebaseConfig): Promise<boolean> {
    return this.postMessage<FirebaseConfig>({
      type: 'FIREBASE_CONFIG',
      payload: config,
    });
  }

  async sendOpenSession(
    sessionId: string,
    messageId?: string
  ): Promise<boolean> {
    return this.postMessage({
      type: 'OPEN_SESSION',
      payload: { sessionId, messageId },
    });
  }

  async requestAuth(): Promise<boolean> {
    return this.postMessage({ type: 'REQUEST_AUTH' });
  }

  async requestFirebaseConfig(): Promise<boolean> {
    return this.postMessage({ type: 'REQUEST_FIREBASE_CONFIG' });
  }

  addEventListener(handler: (event: MessageEvent) => void): () => void {
    const win = globalThis as WindowWithWebView & {
      addEventListener?: (
        type: string,
        handler: (event: MessageEvent) => void
      ) => void;
      removeEventListener?: (
        type: string,
        handler: (event: MessageEvent) => void
      ) => void;
    };

    if (!win.addEventListener) {
      return () => {
        // No-op
      };
    }

    win.addEventListener('message', handler);

    return () => {
      win.removeEventListener?.('message', handler);
    };
  }

  parseMessage<T = unknown>(data: string): WebViewMessage<T> | null {
    try {
      return JSON.parse(data) as WebViewMessage<T>;
    } catch {
      return null;
    }
  }
}

export const webViewBridge = WebViewBridge.getInstance();
