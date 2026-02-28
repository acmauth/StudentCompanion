import { Capacitor } from "@capacitor/core";
import { getLocale } from '$lib/i18n';

const isMobile = Capacitor.isNativePlatform();
const isProduction = process.env.NODE_ENV === 'production';
const isIOS = Capacitor.getPlatform() === 'ios';

const appConfig = {
    isMobile: isMobile,
    isProduction: isProduction,
    isDevelopment: !isProduction,
    isIOS: isIOS,
    isWeb: !isMobile,
    isAndroid: Capacitor.getPlatform() === 'android',
    auth: {
        authUrl: 'https://oauth2.it.auth.gr/auth',
        userInfoUrl: 'https://universis-api.it.auth.gr/api/students/me/grades?$filter=courseExam/year%20eq%202002',
        logoutUrl: 'https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/logout',
        realm: 'universis',
        clientId: 'aristomate',
        redirectUri: 'https://applink.aristomate.auth.gr/authsso/callback',
        scope: 'students:read offline_access openid',
        isMobile: isMobile,
        // Use proxy for web
        tokenUrl: isMobile ? undefined : 'https://applink.aristomate.auth.gr/api/auth/token',
        isProduction: isProduction,
        isIOS: isIOS
    },
    universis: {
        api: 'https://universis-api.it.auth.gr/api'
    },
    menu: {
        apiBase: "https://api.aristomate.auth.gr/menu"
    },
    webmail: {
        server: "mail.auth.gr",
        port: '993',
    },
    map: {
        ws_ext_endpoint: "https://ws-ext.it.auth.gr",
        gis_endpoint: "https://geoportal.auth.gr/giswa/rest/services/Aristomate/InteriorSpace_001_026/MapServer", //Update when buildings become available
        gis_token_url: "https://api.aristomate.auth.gr/get_gis_token",
        aristomate_ws_ext_buildings_endpoint: "https://api.aristomate.auth.gr/get_detailed_buildings"
    }
}

export default appConfig;