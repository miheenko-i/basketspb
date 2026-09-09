import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingEndpoint, sendBooking } from '../lib/booking.ts';

test('passes all form fields to the school endpoint and requires confirmed success', async () => {
  const data = new FormData();
  data.set('Откуда о нас узнали', 'Поиск Google');
  data.set('Зал', 'Беговая');
  await sendBooking(data, async (url, options) => {
    assert.equal(url, bookingEndpoint);
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('Зал'), 'Беговая');
    assert.equal(options.body.get('Откуда о нас узнали'), 'Поиск Google');
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ success: 'true' });
  });
});

test('an HTTP error never counts as a sent application', async () => {
  await assert.rejects(sendBooking(new FormData(), async () => new Response('', { status: 503 })));
});

test('a rejected application never counts as success even with HTTP 200', async () => {
  await assert.rejects(sendBooking(new FormData(), async () => Response.json({ success: 'false' })));
});

test('an activation request never counts as a delivered application', async () => {
  await assert.rejects(sendBooking(new FormData(), async () => Response.json({ success: 'true', message: 'Please activate the form.' })), /ещё подключается/);
});

test('network failures remain failures', async () => {
  await assert.rejects(sendBooking(new FormData(), async () => { throw new TypeError('Network unavailable'); }));
});
