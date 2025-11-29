import { Capacitor } from "@capacitor/core";
import { getLocale } from '$lib/i18n';

const isMobile = Capacitor.isNativePlatform();
const isProduction = process.env.NODE_ENV === 'production';

const appConfig = {
    isMobile: isMobile,
    isProduction: isProduction,
    isDevelopment: !isProduction,
    isIOS: Capacitor.getPlatform() === 'ios',
    isWeb: !isMobile,
    isAndroid: Capacitor.getPlatform() === 'android',
    auth: {
        authUrl: 'https://oauth2.it.auth.gr/auth',
        userInfoUrl: 'https://universis-api.it.auth.gr/api/students/me/grades?$filter=courseExam/year%20eq%202002',
        logoutUrl: 'https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/logout',
        realm: 'universis',
        clientId: 'aristomate',
        redirectUri: 'https://applink.aristomate.gr/authsso/callback',
        scope: 'students:read',
        isMobile: isMobile,
        // Use proxy for web
        tokenUrl: isMobile ? undefined : 'https://applink.aristomate.gr/api/auth/token'
    },
    universis: {
        api: 'https://universis-api.it.auth.gr/api'
    },
    menu: {
        api: `https://api.aristomate.gr/menu?locale=${getLocale()}`
    }
}

export default appConfig;