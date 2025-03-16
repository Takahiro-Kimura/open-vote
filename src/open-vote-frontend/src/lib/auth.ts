import { atom, useAtom } from 'jotai';
import { AuthClient } from '@dfinity/auth-client';

type AuthState = {
  isAuthenticated: boolean;
  principal: string | null;
};

const authAtom = atom<AuthState>({
  isAuthenticated: false,
  principal: null
});

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const login = async () => {
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await new Promise<boolean>((resolve) => {
        authClient.login({
          identityProvider: process.env.DFX_NETWORK === 'ic' 
            ? 'https://identity.ic0.app'
            : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
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

  return {
    ...auth,
    login,
    logout
  };
}