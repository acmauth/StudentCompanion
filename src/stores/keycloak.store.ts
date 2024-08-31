import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';
import type Keycloak from 'keycloak-js';

// Store for the user's credentials
export const keyCloakStore = new CapacitorPersistedStore({
    token: "",
    refreshToken: "",
    idToken: "",
}, 'keycloakStore')