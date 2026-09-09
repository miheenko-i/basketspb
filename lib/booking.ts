export const bookingEndpoint = 'https://formsubmit.co/ajax/rasseloneup@mail.ru';

export async function sendBooking(data: FormData, request: typeof fetch = fetch) {
  const response = await request(bookingEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: data,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
  const result: { success?: boolean | string; message?: string } = await response.json();
  if (/activat|confirm.*email/i.test(result.message || '')) {
    throw new Error('Приём заявок ещё подключается. Пожалуйста, свяжитесь с нами по телефону.');
  }
  if (result.success !== true && result.success !== 'true') {
    throw new Error('Сервис не принял заявку. Попробуйте ещё раз или позвоните нам.');
  }
}
