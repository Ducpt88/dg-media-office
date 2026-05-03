// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Device Detection & Adaptive Engine
// Auto-detect device → optimize layout + performance
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  const device = {
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isTouchDevice: false,
    screenType: 'desktop', // mobile | tablet | desktop
    orientation: 'landscape',
    dpr: window.devicePixelRatio || 1,
    performanceLevel: 'high', // low | medium | high
  };

  function detect() {
    const ua = navigator.userAgent.toLowerCase();
    const w = window.innerWidth;

    // Platform detection
    device.isIOS = /iphone|ipad|ipod/.test(ua);
    device.isAndroid = /android/.test(ua);
    device.isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // Screen size classification
    if (w <= 600) {
      device.isMobile = true; device.isTablet = false; device.isDesktop = false;
      device.screenType = 'mobile';
    } else if (w <= 1024) {
      device.isMobile = false; device.isTablet = true; device.isDesktop = false;
      device.screenType = 'tablet';
    } else {
      device.isMobile = false; device.isTablet = false; device.isDesktop = true;
      device.screenType = 'desktop';
    }

    // Orientation
    device.orientation = w > window.innerHeight ? 'landscape' : 'portrait';

    // Performance estimation
    const cores = navigator.hardwareConcurrency || 2;
    const ram = navigator.deviceMemory || 4;
    if (device.isMobile && (cores <= 2 || ram <= 2)) device.performanceLevel = 'low';
    else if (device.isMobile || cores <= 4) device.performanceLevel = 'medium';
    else device.performanceLevel = 'high';

    // Apply CSS classes to body
    document.body.className = '';
    document.body.classList.add(`device-${device.screenType}`);
    document.body.classList.add(`orient-${device.orientation}`);
    document.body.classList.add(`perf-${device.performanceLevel}`);
    if (device.isTouchDevice) document.body.classList.add('touch-device');
    if (device.isIOS) document.body.classList.add('ios');
    if (device.isAndroid) document.body.classList.add('android');

    // Expose globally
    window._device = device;
  }

  // Detect on load and resize
  detect();
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(detect, 200);
  });

  // Log device info
  console.log(`[Device] ${device.screenType} | ${device.orientation} | touch=${device.isTouchDevice} | perf=${device.performanceLevel} | dpr=${device.dpr}`);
})();
