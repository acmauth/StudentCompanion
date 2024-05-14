//
//  ElearningPlugin.m
//  App
//
//  Created by Michalis Karipidis on 14/5/24.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(ElearningPlugin, "ElearningScraper", 
    CAP_PLUGIN_METHOD(authenticate, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(apiGet, CAPPluginReturnPromise);
)
