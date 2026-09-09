import test from 'node:test';
import assert from 'node:assert/strict';
import { createHeroPlayback } from '../lib/hero-playback.ts';

const settle = () => new Promise(resolve => setImmediate(resolve));

class Video extends EventTarget {
  paused = true;
  ended = false;
  error = null;
  readyState = 0;
  playCalls = 0;
  attempts = [];
  play() {
    this.playCalls++;
    if (this.attempts.length) return this.attempts.shift()();
    this.paused = false;
    this.readyState = 4;
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }
}

function setup({ video = new Video(), hidden = false, reduced = false } = {}) {
  const page = Object.assign(new EventTarget(), { visibilityState: hidden ? 'hidden' : 'visible' });
  const browser = new EventTarget();
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const states = [];
  const playback = createHeroPlayback(video, { document: page, window: browser, motion }, state => states.push(state));
  return { video, page, browser, motion, states, playback };
}

test('cached media is visible without waiting for another canplay event', async () => {
  const video = new Video();
  video.readyState = 4;
  const { playback, states } = setup({ video });
  await settle();
  assert.equal(video.autoplay, true);
  assert.equal(video.muted, true);
  assert.equal(video.defaultMuted, true);
  assert.deepEqual(states.at(-1), { playing: true, ready: true });
  playback.dispose();
});

test('a failed early attempt retries when the media becomes ready', async () => {
  const video = new Video();
  video.attempts.push(() => Promise.reject(new DOMException('Interrupted load', 'AbortError')));
  const { playback } = setup({ video });
  await settle();
  assert.equal(video.paused, true);
  video.readyState = 4;
  video.dispatchEvent(new Event('canplay'));
  await settle();
  assert.equal(video.playCalls, 2);
  assert.equal(video.paused, false);
  playback.dispose();
});

test('a page loaded in the background starts when it becomes visible', async () => {
  const { video, page, browser, playback } = setup({ hidden: true });
  browser.dispatchEvent(new Event('pageshow'));
  assert.equal(video.playCalls, 0);
  page.visibilityState = 'visible';
  page.dispatchEvent(new Event('visibilitychange'));
  await settle();
  assert.equal(video.paused, false);
  playback.dispose();
});

test('manual pause survives readiness events and a page restore', async () => {
  const { video, browser, page, playback } = setup();
  await settle();
  playback.toggle();
  video.dispatchEvent(new Event('canplay'));
  page.visibilityState = 'hidden';
  page.dispatchEvent(new Event('visibilitychange'));
  page.visibilityState = 'visible';
  browser.dispatchEvent(new Event('pageshow'));
  page.dispatchEvent(new Event('visibilitychange'));
  await settle();
  assert.equal(video.playCalls, 1);
  assert.equal(video.paused, true);
  assert.equal(video.autoplay, false);
  playback.dispose();
});

test('a restore received during an interrupted play request is not lost', async () => {
  const video = new Video();
  let rejectAttempt;
  video.attempts.push(() => new Promise((_, reject) => { rejectAttempt = reject; }));
  const { page, browser, playback } = setup({ video });
  page.visibilityState = 'hidden';
  page.dispatchEvent(new Event('visibilitychange'));
  page.visibilityState = 'visible';
  browser.dispatchEvent(new Event('pageshow'));
  rejectAttempt(new DOMException('Interrupted by backgrounding', 'AbortError'));
  await settle();
  assert.equal(video.playCalls, 2);
  assert.equal(video.paused, false);
  playback.dispose();
});

test('reduced motion disables autoplay but still permits explicit playback', async () => {
  const { video, motion, playback } = setup({ reduced: true });
  assert.equal(video.playCalls, 0);
  assert.equal(video.autoplay, false);
  playback.toggle();
  await settle();
  assert.equal(video.paused, false);
  motion.dispatchEvent(new Event('change'));
  assert.equal(video.paused, true);
  assert.equal(video.autoplay, false);
  playback.dispose();
});

test('blocked autoplay does not loop and the play button can retry', async () => {
  const video = new Video();
  video.attempts.push(() => Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError')));
  const { playback, states } = setup({ video });
  await settle();
  assert.equal(video.playCalls, 1);
  assert.equal(states.at(-1).playing, false);
  playback.toggle();
  await settle();
  assert.equal(video.paused, false);
  playback.dispose();
});

test('disposing removes lifecycle listeners and ignores a pending attempt', async () => {
  const video = new Video();
  let resolveAttempt;
  video.attempts.push(() => new Promise(resolve => { resolveAttempt = resolve; }));
  const { playback, states, browser } = setup({ video });
  playback.dispose();
  const reports = states.length;
  resolveAttempt();
  browser.dispatchEvent(new Event('pageshow'));
  await settle();
  assert.equal(video.playCalls, 1);
  assert.equal(states.length, reports);
});
