addEventListener('updateRefreshToken', (resolve, reject, args) => {
    try {
        
        console.log('KFC: Received silent push notification');
        // CapacitorNotifications.schedule([
        //     {
        //     id: 100,
        //     title: 'Enterprise Background Runner',
        //     body: 'Received silent push notification',
        //     },
        // ]);

        // const keycloakStore = CapacitorKV.get("CapacitorStorage").value;
        // console.log(`KFC: Refreshing token with : ${keycloakStore}`);
        // const keycloak = JSON.parse(keycloakStore);
        // const refreshToken = keycloak.refreshToken;
        // const clientID = "aristomate";
        
  
        resolve();
    } catch (err) {
        reject();
    }
  });