import { AndroidPermissions, AndroidPermissionResponse } from '@ionic-native/android-permissions';
import { logoOctocat } from 'ionicons/icons';

export class PermissionsService {
  async checkPermission(permission: string): Promise<boolean> {
    try {
      const result: AndroidPermissionResponse = await AndroidPermissions.checkPermission(permission);
      
      console.log("check: "+result.hasPermission);
      
      return result.hasPermission;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  async requestPermission(permission: string): Promise<boolean> {
    try {
      const result: AndroidPermissionResponse = await AndroidPermissions.requestPermission(permission);
      console.log("request: "+result.hasPermission);
      
      return result.hasPermission;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  async ensurePermission(permission: string): Promise<boolean> {
    console.log(6);
    const hasPermission = await this.checkPermission(permission);
    if (!hasPermission) {
      return await this.requestPermission(permission);
    }
    return true;
  }
}

export const permissionsService = new PermissionsService();
