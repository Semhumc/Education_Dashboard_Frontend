import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm:'education_dashboard',
  clientId: 'be-client',
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


