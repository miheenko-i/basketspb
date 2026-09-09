type PlaybackEnvironment = {
  document: Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'>;
  window: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  motion: Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'>;
};

/** Start/restart only on media readiness or page lifecycle events; preserve manual pause. */
export function createHeroPlayback(
  video: HTMLVideoElement,
  environment: PlaybackEnvironment,
  onState: (state: { playing: boolean; ready: boolean }) => void,
) {
  const { document: page, window: browser, motion } = environment;
  let intent: 'auto' | 'play' | 'pause' = 'auto';
  let disposed = false;
  let pending: Promise<void> | null = null;
  let retryAfterPending = false;

  function report() {
    if (!disposed) onState({
      playing: !video.paused && !video.ended && !video.error,
      ready: video.readyState >= 2 && !video.error,
    });
  }

  function allowed() {
    return !disposed && page.visibilityState === 'visible'
      && intent !== 'pause' && (intent === 'play' || !motion.matches);
  }

  function start() {
    video.autoplay = allowed();
    if (!allowed() || video.error) return;
    if (pending) {
      if (video.paused) retryAfterPending = true;
      return;
    }
    if (!video.paused) return;
    // Set the DOM properties too: autoplay decisions must see the muted state.
    video.muted = true;
    video.defaultMuted = true;
    pending = video.play();
    const attempt = pending;
    void attempt.catch(() => {
      // A rejected attempt keeps the play button available. Do not force a retry loop.
    }).finally(() => {
      if (pending === attempt) pending = null;
      if (disposed) return;
      if (!allowed()) video.pause();
      report();
      if (retryAfterPending) {
        retryAfterPending = false;
        start();
      }
    });
  }

  function sync() {
    if (disposed) return;
    if (allowed()) start();
    else {
      video.autoplay = false;
      video.pause();
    }
    report();
  }

  function onReady() { report(); start(); }
  function onMotionChange() {
    // A newly enabled reduced-motion preference also stops manually started video.
    if (motion.matches) intent = 'auto';
    sync();
  }
  function onPageHide() { video.autoplay = false; video.pause(); }

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.addEventListener('loadeddata', onReady);
  video.addEventListener('canplay', onReady);
  video.addEventListener('playing', report);
  video.addEventListener('pause', report);
  video.addEventListener('error', report);
  page.addEventListener('visibilitychange', sync);
  browser.addEventListener('pageshow', sync);
  browser.addEventListener('pagehide', onPageHide);
  motion.addEventListener('change', onMotionChange);
  sync();

  return {
    toggle() {
      if (!video.paused || pending) {
        intent = 'pause';
        video.autoplay = false;
        video.pause();
        report();
      } else {
        intent = 'play';
        start();
      }
    },
    dispose() {
      disposed = true;
      video.autoplay = false;
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('playing', report);
      video.removeEventListener('pause', report);
      video.removeEventListener('error', report);
      page.removeEventListener('visibilitychange', sync);
      browser.removeEventListener('pageshow', sync);
      browser.removeEventListener('pagehide', onPageHide);
      motion.removeEventListener('change', onMotionChange);
      video.pause();
    },
  };
}
