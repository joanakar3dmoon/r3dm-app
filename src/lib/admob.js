// AdMob IDs para r3dm/guia
export const AD_IDS = {
  APP_ID: 'ca-app-pub-4903263409458961~2391607033',
  BANNER: 'ca-app-pub-4903263409458961/6771307929',
  INTERSTITIAL: 'ca-app-pub-4903263409458961/6119092882',
  REWARDED: 'ca-app-pub-4903263409458961/3296498741',
  APP_OPEN: 'ca-app-pub-4903263409458961/2407491277',
  NATIVE: 'ca-app-pub-4903263409458961/9723295970',
  // Test IDs para desarrollo
  BANNER_TEST: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL_TEST: 'ca-app-pub-3940256099942544/1033173712',
};

// En desarrollo usar test IDs, en producción los reales
export const IS_DEV = __DEV__;
export const getBannerId = () => IS_DEV ? AD_IDS.BANNER_TEST : AD_IDS.BANNER;
export const getInterstitialId = () => IS_DEV ? AD_IDS.INTERSTITIAL_TEST : AD_IDS.INTERSTITIAL;
