import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBookingRepresentative } from '../lib/privacy.ts';

test('a minor in either form requires a named representative', () => {
  for (const field of ['Возраст ученика', 'Возраст']) {
    const data = new FormData();
    data.set(field, '17');
    assert.throws(() => validateBookingRepresentative(data), /представителя/);
    data.set('ФИО законного представителя', '   ');
    assert.throws(() => validateBookingRepresentative(data), /представителя/);
    data.set('ФИО законного представителя', 'Тестовый представитель');
    assert.doesNotThrow(() => validateBookingRepresentative(data));
  }
});

test('an adult application does not require an unrelated representative', () => {
  const data = new FormData();
  data.set('Возраст', '18');
  assert.doesNotThrow(() => validateBookingRepresentative(data));
});

test('submitting an application does not manufacture consent or alter the payload', () => {
  const data = new FormData();
  data.set('Возраст ученика', '25');
  data.set('Зал', 'Лесная');
  const original = [...data.entries()];
  validateBookingRepresentative(data);
  assert.deepEqual([...data.entries()], original);
});
