//
//  UniversisPlugin.m
//  App
//
//  Created by Michalis Karipidis on 14/5/24.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(UniversisPlugin, "UniversisScraper",
    CAP_PLUGIN_METHOD(authenticate, CAPPluginReturnPromise);
)
