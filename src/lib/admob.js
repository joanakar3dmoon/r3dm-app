// AdMob para r3dm community
import React from 'react';
import { Platform } from 'react-native';

let BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType;

try {
  const mod = require('react-native-google-mobile-ads');
  BannerAd = mod.BannerAd;
  BannerAdSize = mod.BannerAdSize;
  TestIds = mod.TestIds;
  InterstitialAd = mod.InterstitialAd;
  AdEventType = mod.AdEventType;
} catch (e) {
  BannerAd = function(props) { return null; };
  BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' };
  TestIds = { BANNER: 'test', INTERSTITIAL: 'test' };
  InterstitialAd = { createForAdRequest: function() { return { load: function() {}, addAdEventListener: function() { return function() {}; }, show: function() {} }; } };
  AdEventType = { LOADED: 'loaded', ERROR: 'error' };
}

export const AD_IDS = {
  APP_ID: 'ca-app-pub-4903263409458961~2391607033',
  BANNER: 'ca-app-pub-4903263409458961/6771307929',
  INTERSTITIAL: 'ca-app-pub-4903263409458961/6119092882',
  REWARDED: 'ca-app-pub-4903263409458961/3296498741',
  BANNER_TEST: TestIds.BANNER,
  INTERSTITIAL_TEST: TestIds.INTERSTITIAL,
};

export const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
export const BANNER_ID = IS_DEV ? AD_IDS.BANNER_TEST : AD_IDS.BANNER;
export const INTERSTITIAL_ID = IS_DEV ? AD_IDS.INTERSTITIAL_TEST : AD_IDS.INTERSTITIAL;

export function AdBanner() {
  return React.createElement(BannerAd, {
    unitId: BANNER_ID,
    size: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
    requestOptions: { requestNonPersonalizedAdsOnly: false }
  });
}

export function loadInterstitial() {
  const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
  return new Promise(function(resolve) {
    const sub = interstitial.addAdEventListener(AdEventType.LOADED, function() {
      interstitial.show(); sub(); resolve(true);
    });
    interstitial.addAdEventListener(AdEventType.ERROR, function() { sub(); resolve(false); });
    interstitial.load();
  });
}
