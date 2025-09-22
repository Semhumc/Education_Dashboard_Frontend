import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'education',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'education-client',
};

const keycloak = new Keycloak(keycloakConfig);

export const useKeycloak = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
    }).then((authenticated) => {
      setIsLogin(authenticated);
      setToken(keycloak.token || null);
    }).catch(error => {
      console.error('Keycloak initialization failed', error);
    });
  }, []);

  return { keycloak, token, isLogin };
};


