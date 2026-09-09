'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { ArrowRight, Check, LoaderCircle, Phone } from 'lucide-react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { sendBooking } from '@/lib/booking';

type Venue = {
  id: string;
  name: string;
  kids: string | null;
  sessions: { days: string; adult: string; child: string | null }[];
};
type Props = {
  venues: Venue[];
  venueId: string;
  program: string;
  audience: string;
  onVenueChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onAudienceChange: (value: string) => void;
  onClose: () => void;
};
const programs = ['Баскетбольные навыки', 'Баскетбольный фристайл', 'Индивидуальная тренировка'];
const sources = ['Поиск Яндекс', 'Поиск 2 GIS', 'Поиск Google', 'Узнали от друзей', 'Instagram', 'VK', 'YouTube'];

export function BookingForm({ venues, venueId, program, audience, onVenueChange, onProgramChange, onAudienceChange, onClose }: Props) {
  const [contactMethod, setContactMethod] = useState('Telegram');
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const venue = venues.find(v => v.id === venueId)!;
  const schedule = program === 'Баскетбольные навыки' && !(audience === 'child' && !venue.kids)
    ? venue.sessions.map(s => `${s.days}: ${audience === 'adult' ? s.adult : s.child}`).join('; ')
    : 'Расписание и доступность группы уточнит администратор.';

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const phoneValue = data.get('Телефон');
    const phone = (typeof phoneValue === 'string' ? phoneValue : '').replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 15) {
      setError('Укажите номер телефона полностью, с кодом страны.');
      event.currentTarget.querySelector<HTMLInputElement>('[name="Телефон"]')?.focus();
      return;
    }
    if (!source) { setError('Выберите, откуда вы о нас узнали.'); return; }
    data.set('Направление', program);
    data.set('Зал', venue.name);
    data.set('Связаться через', contactMethod);
    data.set('Откуда о нас узнали', source);
    data.set('_subject', 'BASKETSPB — заявка на тренировку');
    data.set('_template', 'table');
    data.set('_url', 'https://miheenko-i.github.io/basketspb/');
    submitting.current = true;
    setStatus('sending');
    setError('');
    try {
      await sendBooking(data);
      setStatus('success');
    } catch (problem) {
      setStatus('idle');
      setError(problem instanceof Error && problem.name === 'Error'
        ? problem.message
        : 'Не удалось подтвердить отправку. Проверьте соединение или позвоните нам.');
    } finally {
      submitting.current = false;
    }
  }

  if (status === 'success') return <div className="booking-success" aria-live="polite">
    <span className="booking-success-icon"><Check size={28}/></span>
    <DialogTitle className="booking-title">ЗАЯВКА ОТПРАВЛЕНА</DialogTitle>
    <DialogDescription className="booking-description">Мы свяжемся с вами, чтобы подтвердить время тренировки.</DialogDescription>
    <button type="button" className="button dark-button" onClick={onClose}>Готово</button>
  </div>;

  return <>
    <span className="eyebrow muted">БАСКЕТБОЛ И ФРИСТАЙЛ</span>
    <DialogTitle className="booking-title">ЗАПИСЬ НА ТРЕНИРОВКУ</DialogTitle>
    <DialogDescription className="booking-description">Отправьте свои контакты, и мы свяжемся с вами.</DialogDescription>
    <form onSubmit={handleSubmit} className="booking-form" aria-busy={status === 'sending'}>
      <p className="required-note">* Обязательные поля</p>
      <fieldset disabled={status === 'sending'} className="booking-fields">
        <label htmlFor="booking-name">Фамилия и имя ученика *<Input id="booking-name" name="Фамилия и имя ученика" autoComplete="name" placeholder="Фамилия и имя" required maxLength={120} className="booking-input"/></label>
        <label htmlFor="booking-age">Возраст ученика *<Input id="booking-age" name="Возраст ученика" type="number" inputMode="numeric" placeholder="Полных лет" required min={1} max={99} step={1} className="booking-input" onChange={event => { const age = Number(event.target.value); if (age > 0) onAudienceChange(age < 14 ? 'child' : 'adult'); }}/></label>
        <label htmlFor="booking-phone">Ваш номер телефона *<Input id="booking-phone" name="Телефон" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" required maxLength={25} className="booking-input"/></label>
        <label htmlFor="booking-email">Ваша почта *<Input id="booking-email" name="email" type="email" autoComplete="email" placeholder="mail@example.ru" required maxLength={160} className="booking-input"/></label>
        <fieldset className="booking-contact booking-full">
          <legend>Страница ВК или Telegram *</legend>
          <RadioGroup value={contactMethod} onValueChange={value => setContactMethod(String(value))} className="contact-methods" aria-label="Способ связи">
            <label htmlFor="contact-telegram"><RadioGroupItem id="contact-telegram" value="Telegram"/>Telegram</label>
            <label htmlFor="contact-vk"><RadioGroupItem id="contact-vk" value="ВК"/>ВК</label>
          </RadioGroup>
          <label htmlFor="booking-contact" className="sr-only">{contactMethod === 'Telegram' ? 'Имя пользователя или телефон в Telegram' : 'Ссылка на страницу ВК'}</label>
          <Input id="booking-contact" name="Страница или контакт" placeholder={contactMethod === 'Telegram' ? '@username или номер телефона' : 'Ссылка на страницу ВК'} required maxLength={200} className="booking-input"/>
        </fieldset>
        <label htmlFor="booking-program">Направление *<Select value={program} onValueChange={value => value && onProgramChange(value)}><SelectTrigger id="booking-program" className="booking-select"><SelectValue/></SelectTrigger><SelectContent>{programs.map(value => <SelectItem value={value} key={value}>{value}</SelectItem>)}</SelectContent></Select></label>
        <label htmlFor="booking-venue">Зал *<Select value={venueId} onValueChange={value => value && onVenueChange(value)}><SelectTrigger id="booking-venue" className="booking-select"><SelectValue>{venue.name}</SelectValue></SelectTrigger><SelectContent>{venues.map(v => <SelectItem value={v.id} key={v.id}>{v.name}</SelectItem>)}</SelectContent></Select></label>
        <label htmlFor="booking-source" className="booking-full">Откуда о нас узнали *<Select value={source} onValueChange={setSource}><SelectTrigger id="booking-source" className="booking-select"><SelectValue placeholder="Выберите вариант"/></SelectTrigger><SelectContent>{sources.map(value => <SelectItem value={value} key={value}>{value}</SelectItem>)}</SelectContent></Select></label>
        <label htmlFor="booking-message" className="booking-full">Сообщение <span className="optional-label">Необязательно</span><Textarea id="booking-message" name="Сообщение" placeholder="Что нам стоит знать перед тренировкой?" maxLength={3000} rows={3} className="booking-input booking-textarea"/></label>
        <label htmlFor="booking-promo" className="booking-full">Промокод <span className="optional-label">Если есть</span><Input id="booking-promo" name="Промокод" placeholder="Введите промокод" autoComplete="off" maxLength={60} className="booking-input"/></label>
        <div className="booking-honeypot" aria-hidden="true"><label htmlFor="booking-website">Оставьте пустым<Input id="booking-website" name="_honey" tabIndex={-1} autoComplete="off"/></label></div>
      </fieldset>
      <div className="booking-summary"><Check size={18}/><span>{program === 'Индивидуальная тренировка' ? 'Индивидуальное занятие — от 3 000 ₽.' : 'Первое групповое занятие — бесплатно.'}<small>{schedule}</small></span></div>
      {error && <p className="booking-error" role="alert">{error}</p>}
      <button type="submit" className="button orange-button booking-submit" disabled={status === 'sending'}>{status === 'sending' ? <>Отправляем… <LoaderCircle size={20} className="submission-spinner"/></> : <>Отправить заявку <ArrowRight size={20}/></>}</button>
      <p className="booking-note">Нажимая на кнопку, вы соглашаетесь с <a href="https://basketspb.ru/#popup:infoblock" target="_blank" rel="noreferrer">политикой обработки персональных данных</a>.</p>
      <a className="booking-phone" href="tel:+79117292545"><Phone size={16}/>Или позвоните: +7 911 729-25-45</a>
    </form>
  </>;
}
