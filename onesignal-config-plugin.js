const {
  withAndroidManifest,
  withAppDelegate,
  withInfoPlist,
  AndroidConfig,
} = require('@expo/config-plugins');

module.exports = function withOneSignal(config, { appId }) {
  // Android: Add OneSignal service and permissions to AndroidManifest.xml
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    mainApplication.service = mainApplication.service || [];
    mainApplication.service.push({
      $: {
        'android:name': 'com.onesignal.OneSignalGcmIntentService',
        'android:exported': 'false',
      },
    });

    // Ensure notification permissions
    config.modResults.manifest['uses-permission'] = [
      ...(config.modResults.manifest['uses-permission'] || []),
      {
        $: { 'android:name': 'android.permission.RECEIVE_BOOT_COMPLETED' },
      },
      {
        $: { 'android:name': 'android.permission.VIBRATE' },
      },
      {
        $: { 'android:name': 'android.permission.POST_NOTIFICATIONS' },
      },
    ];

    return config;
  });

  // iOS: Add OneSignal configuration to Info.plist
  config = withInfoPlist(config, async (config) => {
    config.modResults.OneSignalAppId = appId;
    config.modResults.UIBackgroundModes = config.modResults.UIBackgroundModes || [];
    config.modResults.UIBackgroundModes.push('remote-notification');
    return config;
  });

  // iOS: Modify AppDelegate for OneSignal
  config = withAppDelegate(config, async (config) => {
    let appDelegate = config.modResults.contents;

    // Add OneSignal import
    if (!appDelegate.includes('#import <OneSignal/OneSignal.h>')) {
      appDelegate = appDelegate.replace(
        /#import "AppDelegate.h"/,
        `#import "AppDelegate.h"\n#import <OneSignal/OneSignal.h>`
      );
    }

    // Add OneSignal initialization
    const initCode = `
    [OneSignal initWithLaunchOptions:launchOptions];
    [OneSignal setAppId:@"${appId}"];
    `;
    if (!appDelegate.includes('[OneSignal initWithLaunchOptions')) {
      appDelegate = appDelegate.replace(
        /didFinishLaunchingWithOptions launchOptions/,
        `didFinishLaunchingWithOptions launchOptions\n    ${initCode}`
      );
    }

    config.modResults.contents = appDelegate;
    return config;
  });

  return config;
};
