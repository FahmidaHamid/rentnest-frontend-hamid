const ACCESS_TOKEN_KEY = "rentnest_access_token";

type TokenListener = () => void;

const listeners = new Set<TokenListener>();

function notifyTokenListeners(): void {
  listeners.forEach((listener) => listener());
}

export function saveAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyTokenListeners();
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyTokenListeners();
}

export function subscribeToAccessToken(listener: TokenListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
