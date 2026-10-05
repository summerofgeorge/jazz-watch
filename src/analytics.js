// Public measurement ID for JazzWatch alone, in the Stringfest Analytics account.
(() => {
  const measurementId='G-B6DSXWT01V',hostname='jazzwatch.stringfestanalytics.com';
  if(location.hostname!==hostname || document.getElementById('jazzwatch-google-tag'))return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  // Filters and personal notes are not analytics dimensions. Strip query strings
  // and fragments from the page/referrer; enhanced search/form/history events are off.
  let referrer='';try{const url=new URL(document.referrer);referrer=url.origin+url.pathname;}catch{}
  window.gtag('config',measurementId,{
    page_location:location.origin+location.pathname,page_referrer:referrer,
    cookie_domain:hostname,cookie_prefix:'jw',allow_google_signals:false,allow_ad_personalization_signals:false
  });
  const script=document.createElement('script');script.id='jazzwatch-google-tag';script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;document.head.append(script);
})();
