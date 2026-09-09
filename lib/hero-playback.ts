type PlaybackEnvironment = {
  document: Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'>;
  window: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  motion: Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'>;
};

/** Start on readiness/lifecycle events; sound stays off until explicitly enabled. */
export function createHeroPlayback(
  video: HTMLVideoElement,
  environment: PlaybackEnvironment,
  onState: (state: { playing: boolean; ready: boolean; muted: boolean; volume: number; needsPlay: boolean }) => void,
) {
  const { document: page, window: browser, motion } = environment;
  let intent: 'auto' | 'play' = 'auto';
  let disposed = false;
  let pending: Promise<void> | null = null;
  let retryAfterPending = false;
  let audibleVolume = .5;
  let playRejected = false;

  function report() {
    if (video.volume > 0) audibleVolume = video.volume;
    if (!disposed) onState({
      playing: !video.paused && !video.ended && !video.error,
      ready: video.readyState >= 2 && !video.error,
      muted: video.muted || video.volume === 0,
      volume: video.volume,
      needsPlay: page.visibilityState === 'visible' && video.paused && !video.error && !pending
        && (playRejected || motion.matches || video.readyState >= 2),
    });
  }

  function allowed() {
    return !disposed && page.visibilityState === 'visible'
      && (intent === 'play' || !motion.matches);
  }

  function start() {
    video.autoplay = allowed();
    if (!allowed() || video.error) return;
    if (pending) {
      if (video.paused) retryAfterPending = true;
      return;
    }
    if (!video.paused) return;
    playRejected = false;
    pending = video.play();
    const attempt = pending;
    void attempt.catch(() => {
      // A separate play button lets users keep sound off when autoplay is blocked.
      if (!disposed) playRejected = true;
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
  video.volume = .5;
  video.playsInline = true;
  video.addEventListener('loadeddata', onReady);
  video.addEventListener('loadedmetadata', onReady);
  video.addEventListener('canplay', onReady);
  video.addEventListener('playing', report);
  video.addEventListener('pause', report);
  video.addEventListener('volumechange', report);
  video.addEventListener('error', report);
  page.addEventListener('visibilitychange', sync);
  browser.addEventListener('pageshow', sync);
  browser.addEventListener('pagehide', onPageHide);
  motion.addEventListener('change', onMotionChange);
  sync();

  return {
    refresh() { sync(); },
    play() {
      if (disposed) return;
      intent = 'play';
      start();
    },
    toggleSound() {
      if (disposed) return;
      const enableSound = video.muted || video.volume === 0;
      video.muted = !enableSound;
      if (enableSound) {
        if (video.volume === 0) video.volume = audibleVolume;
        intent = 'play';
        start();
      }
      report();
    },
    setVolume(volume: number) {
      if (disposed || !Number.isFinite(volume)) return;
      video.volume = Math.max(0, Math.min(1, volume));
      video.muted = video.volume === 0;
      if (!video.muted) {
        intent = 'play';
        start();
      }
      report();
    },
    dispose() {
      disposed = true;
      video.autoplay = false;
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('playing', report);
      video.removeEventListener('pause', report);
      video.removeEventListener('volumechange', report);
      video.removeEventListener('error', report);
      page.removeEventListener('visibilitychange', sync);
      browser.removeEventListener('pageshow', sync);
      browser.removeEventListener('pagehide', onPageHide);
      motion.removeEventListener('change', onMotionChange);
      video.pause();
    },
  };
}
