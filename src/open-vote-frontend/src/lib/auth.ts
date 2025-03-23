import { atom, useAtom } from 'jotai';
import { AuthClient } from '@dfinity/auth-client';

type AuthState = {
  isAuthenticated: boolean;
  principal: string | null;
};

const initialAuthState: AuthState = {
  isAuthenticated: false,
  principal: null
};

const authAtom = atom<AuthState>(initialAuthState);

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const initializeAuth = async () => {
    try {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        setAuth({ isAuthenticated: true, principal });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  };

  const login = async () => {
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await new Promise<boolean>((resolve) => {
        authClient.login({
          identityProvider: process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app'
            : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/#authorize`,
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        });
      });

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        setAuth({ isAuthenticated: true, principal });
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
      setAuth({ isAuthenticated: false, principal: null });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Initialize auth on component mount
  initializeAuth();

  return {
    ...auth,
    login,
    logout
  };
}
