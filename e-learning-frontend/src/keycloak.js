// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'e-learning-realm',
    clientId: 'react-client',
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = (onAuthenticatedCallback) => {
    // Vérifie si déjà initialisé (propriété interne de Keycloak >= v25)
    // @ts-ignore – didInitialize n'est pas typé mais existe
    if (keycloak.didInitialize) {
        console.log('Keycloak déjà initialisé, on skip');
        onAuthenticatedCallback();
        setupTokenRefresh();
        return;
    }

    keycloak
        .init({
            onLoad: 'login-required',  // Force le login si non authentifié
            pkceMethod: 'S256',
            // Désactive les iframes pour éviter les autres erreurs (voir ci-dessous)
            checkLoginIframe: false,
            // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',  // Commenté pour simplifier
        })
        .then((authenticated) => {
            if (authenticated) {
                console.log('Authentifié');
                onAuthenticatedCallback();
                setupTokenRefresh();
            } else {
                keycloak.login();
            }
        })
        .catch((err) => {
            console.error('Échec init Keycloak', err);
        });
};

const setupTokenRefresh = () => {
    setInterval(() => {
        keycloak
            .updateToken(30)
            .then((refreshed) => {
                if (refreshed) console.log('Token rafraîchi');
            })
            .catch(() => keycloak.login());
    }, 60000);
};

export const getToken = () => keycloak.token;

export const logout = () => keycloak.logout({ redirectUri: window.location.origin });

export { keycloak };  // Optionnel, mais évitez export default