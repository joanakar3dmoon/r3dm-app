// AdMob para r3dm community
let BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType;

try {
  const mod = require('react-native-google-mobile-ads');
  BannerAd = mod.BannerAd;
  BannerAdSize = mod.BannerAdSize;
  TestIds = mod.TestIds;
  InterstitialAd = mod.InterstitialAd;
  AdEventType = mod.AdEventType;
} catch (e) {
  // Native module not available - create mock
  BannerAd = () => null;
  BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' };
  TestIds = { BANNER: 'test', INTERSTITIAL: 'test' };
  InterstitialAd = { createForAdRequest: () => ({ load: () => {}, addAdEventListener: () => () => {}, show: () => {} }) };
  AdEventType = { LOADED: 'loaded', ERROR: 'error' };
}

import { Platform } from 'react-native';

export const AD_IDS = {
  APP_ID: 'ca-app-pub-4903263409458961~2391607033',
  BANNER: 'ca-app-pub-4903263409458961/6771307929',
  INTERSTITIAL: 'ca-app-pub-4903263409458961/6119092882',
  REWARDED: 'ca-app-pub-4903263409458961/3296498741',
  BANNER_TEST: TestIds.BANNER,
  INTERSTITIAL_TEST: TestIds.INTERSTITIAL,
};

export const IS_DEV = __DEV__;
export const BANNER_ID = IS_DEV ? AD_IDS.BANNER_TEST : AD_IDS.BANNER;
export const INTERSTITIAL_ID = IS_DEV ? AD_IDS.INTERSTITIAL_TEST : AD_IDS.INTERSTITIAL;

export function AdBanner() {
  return (
    <BannerAd
      unitId={BANNER_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: false }}
    />
  );
}

export function loadInterstitial() {
  const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
  return new Promise((resolve) => {
    const sub = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show(); sub(); resolve(true);
    });
    interstitial.addAdEventListener(AdEventType.ERROR, () => { sub(); resolve(false); });
    interstitial.load();
  });
}
