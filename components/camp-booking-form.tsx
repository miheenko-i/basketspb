'use client';
import { useRef, useState, type SubmitEvent } from 'react';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { campShifts } from '@/lib/camp';
import { sendBooking } from '@/lib/booking';
import { referralSources } from '@/lib/site';

export function CampBookingForm({ shift, onShiftChange, packageChoice }: { shift: string | null; onShiftChange: (value: string | null) => void; packageChoice: string }) {
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const rawPhone = data.get('Телефон');
    const phone = typeof rawPhone === 'string' ? rawPhone.replace(/\D/g, '') : '';
    if (phone.length < 10 || phone.length > 15) { setError('Укажите номер телефона полностью, с кодом страны.'); return; }
    if (!shift) { setError('Выберите смену.'); return; }
    if (!source) { setError('Выберите, откуда вы о нас узнали.'); return; }
    const selected = campShifts.find(item => item.id === shift)!;
    data.set('Смена', `${selected.name}: ${selected.dates}`);
    data.set('Откуда о нас узнали', source);
    if (packageChoice) data.set('Тариф', packageChoice);
    data.set('_subject', 'YO BALLER — заявка в летний лагерь');
    data.set('_template', 'table');
    submitting.current = true;
    setStatus('sending');
    setError('');
    try { await sendBooking(data); setStatus('success'); }
    catch (problem) { setStatus('idle'); setError(problem instanceof Error && problem.name === 'Error' ? problem.message : 'Не удалось подтвердить отправку. Проверьте соединение или позвоните нам.'); }
    finally { submitting.current = false; }
  }
  if (status === 'success') return <div className="booking-success" aria-live="polite"><span className="booking-success-icon"><Check size={28}/></span><h3>ЗАЯВКА ОТПРАВЛЕНА</h3><p>Мы свяжемся с вами, чтобы подтвердить даты и наличие мест.</p></div>;
  return <form className="booking-form camp-booking-form" onSubmit={submit} aria-busy={status === 'sending'}>
    <p className="required-note">* Обязательные поля</p>
    <fieldset className="booking-fields" disabled={status === 'sending'}>
      <label htmlFor="camp-name">Имя и фамилия ученика *<Input id="camp-name" name="Имя и фамилия ученика" placeholder="Имя и фамилия" autoComplete="name" required maxLength={120} className="booking-input"/></label>
      <label htmlFor="camp-age">Возраст *<Input id="camp-age" name="Возраст" type="number" inputMode="numeric" placeholder="От 10 до 18 лет" required min={10} max={18} step={1} className="booking-input"/></label>
      <label htmlFor="camp-phone">Телефон *<Input id="camp-phone" name="Телефон" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" required maxLength={25} className="booking-input"/></label>
      <label htmlFor="camp-email">Email *<Input id="camp-email" name="email" type="email" autoComplete="email" placeholder="mail@example.ru" required maxLength={160} className="booking-input"/></label>
      <label htmlFor="camp-shift" className="booking-full">На какую смену записываетесь? *<Select value={shift} onValueChange={onShiftChange}><SelectTrigger id="camp-shift" className="booking-select"><SelectValue placeholder="Выберите смену">{shift ? `${campShifts.find(item => item.id === shift)!.name} · ${campShifts.find(item => item.id === shift)!.dates}` : undefined}</SelectValue></SelectTrigger><SelectContent>{campShifts.map(item => <SelectItem key={item.id} value={item.id}>{item.name} · {item.dates}</SelectItem>)}</SelectContent></Select></label>
      <label htmlFor="camp-source" className="booking-full">Откуда о нас узнали? *<Select value={source} onValueChange={setSource}><SelectTrigger id="camp-source" className="booking-select"><SelectValue placeholder="Выберите вариант"/></SelectTrigger><SelectContent>{referralSources.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label>
      <label htmlFor="camp-message" className="booking-full">Сообщение <span className="optional-label">Необязательно</span><Textarea id="camp-message" name="Сообщение" placeholder="Оставьте ваше сообщение" maxLength={3000} rows={3} className="booking-input booking-textarea"/></label>
      <div className="booking-honeypot" aria-hidden="true"><label htmlFor="camp-website">Оставьте пустым<Input id="camp-website" name="_honey" tabIndex={-1} autoComplete="off"/></label></div>
    </fieldset>
    {packageChoice && <div className="camp-selected-package"><span>Выбранный тариф</span><strong>{packageChoice}</strong></div>}
    {error && <p className="booking-error" role="alert">{error}</p>}
    <button className="button orange-button booking-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <>Отправляем… <LoaderCircle size={20} className="submission-spinner"/></> : <>Отправить заявку <ArrowRight size={20}/></>}</button>
    <p className="booking-note">Нажимая на кнопку, вы соглашаетесь с <a href="https://basketspb.ru/#popup:infoblock" target="_blank" rel="noreferrer">политикой обработки персональных данных</a>.</p>
  </form>;
}
