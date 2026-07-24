// AdMob para r3dm community
const { Platform } = require('react-native');

let BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType;

try {
  const mod = require('react-native-google-mobile-ads');
  BannerAd = mod.BannerAd;
  BannerAdSize = mod.BannerAdSize;
  TestIds = mod.TestIds;
  InterstitialAd = mod.InterstitialAd;
  AdEventType = mod.AdEventType;
} catch (e) {
  BannerAd = function() { return null; };
  BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' };
  TestIds = { BANNER: 'test', INTERSTITIAL: 'test' };
  InterstitialAd = { createForAdRequest: function() { return { load: function() {}, addAdEventListener: function() { return function() {}; }, show: function() {} }; } };
  AdEventType = { LOADED: 'loaded', ERROR: 'error' };
}

exports.AD_IDS = {
  APP_ID: 'ca-app-pub-4903263409458961~2391607033',
  BANNER: 'ca-app-pub-4903263409458961/6771307929',
  INTERSTITIAL: 'ca-app-pub-4903263409458961/6119092882',
  REWARDED: 'ca-app-pub-4903263409458961/3296498741',
  BANNER_TEST: TestIds.BANNER,
  INTERSTITIAL_TEST: TestIds.INTERSTITIAL,
};

const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
exports.IS_DEV = IS_DEV;
exports.BANNER_ID = IS_DEV ? exports.AD_IDS.BANNER_TEST : exports.AD_IDS.BANNER;
exports.INTERSTITIAL_ID = IS_DEV ? exports.AD_IDS.INTERSTITIAL_TEST : exports.AD_IDS.INTERSTITIAL;

exports.AdBanner = function() {
  const React = require('react');
  return React.createElement(BannerAd, {
    unitId: exports.BANNER_ID,
    size: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
    requestOptions: { requestNonPersonalizedAdsOnly: false }
  });
};

exports.loadInterstitial = function() {
  const interstitial = InterstitialAd.createForAdRequest(exports.INTERSTITIAL_ID);
  return new Promise(function(resolve) {
    const sub = interstitial.addAdEventListener(AdEventType.LOADED, function() {
      interstitial.show(); sub(); resolve(true);
    });
    interstitial.addAdEventListener(AdEventType.ERROR, function() { sub(); resolve(false); });
    interstitial.load();
  });
};
