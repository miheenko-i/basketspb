'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { CampBookingForm } from '@/components/camp-booking-form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { campShifts, campPrices } from '@/lib/camp';

const activities = [
  ['2–3 тренировки в день', 'На уличных площадках города. При плохой погоде — в залах.'],
  ['Матчи и фильмы', 'Смотрим легендарные матчи НБА и не только.'],
  ['Площадки города', 'Посещаем интересные баскетбольные корты и проводим на них занятия.'],
  ['Тактика и движения', 'Разбираем игровые приёмы: от кроссовера до командной тактики.'],
  ['Мастер-классы', 'Работаем над увеличением прыжка и баскетбольным фристайлом.'],
  ['Призы и подарки', 'Награждаем лучших памятными аксессуарами.'],
];
export default function CampPage() {
  const [shift, setShift] = useState<string | null>(null);
  const [packageChoice, setPackageChoice] = useState('');
  function goToBooking() { document.getElementById('camp-booking')?.scrollIntoView({ behavior: 'smooth' }); }
  return <div id="top" className="camp-page">

    <SiteHeader camp/>
    <main id="main">
      <section className="camp-hero" aria-labelledby="camp-title">
        <img className="camp-hero-image" src="/basketspb/images/camp-hero.jpg" alt="Участники баскетбольного лагеря с мячами на открытой площадке" width="1680" height="907" fetchPriority="high"/>
        <div className="camp-hero-shade"/>
        <div className="camp-hero-content"><h1 id="camp-title">ГОРОДСКОЙ<br/>ЛЕТНИЙ ЛАГЕРЬ</h1><p className="camp-hero-description">4 летние смены. С понедельника по пятницу,<br/>с 10:00 до 17:00.</p><div className="camp-hero-actions"><a href="#camp-booking" className="button orange-button">Записаться на смену <ArrowUpRight size={20}/></a><a href="#camp-program" className="camp-explore">Что мы будем делать? <ArrowDown size={18}/></a></div></div>
      </section>
      <div className="facts-strip camp-facts"><span>10–18 ЛЕТ</span><span>2–3 ТРЕНИРОВКИ В ДЕНЬ</span><span>ПН–ПТ · 10:00–17:00</span><span>4 ЛЕТНИЕ СМЕНЫ</span></div>
      <section className="section camp-program" id="camp-program"><div className="section-heading"><div><h2>ПРОГРАММА ЛАГЕРЯ</h2></div><p>Для новичков и любителей<br/>от 10 до 18 лет.</p></div><div className="camp-activities">{activities.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="section camp-shifts" id="camp-shifts"><div className="section-heading"><div><h2>ЛЕТНИЕ СМЕНЫ</h2></div><p>С мая по август.<br/>Понедельник — пятница, 10:00–17:00.</p></div><div className="camp-shift-list">{campShifts.map(item => <button className="camp-shift" key={item.id} onClick={() => { setShift(item.id); goToBooking(); }}><span>{item.name}</span><strong>{item.dates}</strong><ArrowUpRight size={24}/></button>)}</div><p className="camp-date-note">Даты и наличие мест подтвердит администратор при записи.</p></section>
      <section className="section price-section camp-prices" id="camp-prices"><div className="section-heading"><div><h2>СТОИМОСТЬ ЛАГЕРЯ</h2></div><p>На день, неделю или смену.<br/>С питанием или без.</p></div><Table className="camp-price-table"><TableHeader><TableRow><TableHead>Продолжительность</TableHead><TableHead>Без питания</TableHead><TableHead>С питанием</TableHead></TableRow></TableHeader><TableBody>{campPrices.map(price => <TableRow key={price.id}><TableCell className="camp-price-name">{price.name}</TableCell>{[false, true].map(meals => <TableCell key={String(meals)}><button className="camp-price-choice" onClick={() => { setPackageChoice(`${price.name} · ${meals ? 'с питанием' : 'без питания'} · ${meals ? price.withMeals : price.withoutMeals} ₽`); goToBooking(); }} aria-label={`Записаться: ${price.name}, ${meals ? 'с питанием' : 'без питания'}`}><strong>{meals ? price.withMeals : price.withoutMeals}<small> ₽</small></strong><span>{meals ? price.withDaily : price.withoutDaily}</span><ArrowUpRight size={20}/></button></TableCell>)}</TableRow>)}</TableBody></Table></section>
      <section className="section camp-life" id="camp-life"><div className="section-heading"><div><h2>КАК ПРОХОДИЛ<br/>ЛАГЕРЬ В 2025 ГОДУ</h2></div><p>Не только тренируемся,<br/>но и весело проводим время.</p></div><div className="camp-life-grid"><article><img src="/basketspb/images/camp-court.jpg" alt="Участники лагеря с тренером едут в метро" width="1280" height="960" loading="lazy"/><h3>Исследуем город</h3><p>Посещали легендарные площадки Петербурга и участвовали в открытии магазина Super Step.</p><a className="text-link" href="https://youtube.com/shorts/uU5kmgxURTI?si=5TcxYooakshFM1hW" target="_blank" rel="noreferrer">Смотреть видео <ArrowUpRight size={18}/></a></article><article><img src="/basketspb/images/camp-life-group.jpg" alt="Участник летнего лагеря с баскетбольным мячом" width="1200" height="1800" loading="lazy"/><h3>Тренировки и отдых</h3><p>Играли в NBA 2K, тренировались и плавали в аквапарке.</p><a className="text-link" href="https://youtube.com/shorts/PGJiwJUACKQ?si=aSqOhSFVe2lTs3jQ" target="_blank" rel="noreferrer">Ещё видео из лагеря <ArrowUpRight size={18}/></a></article></div></section>
      <section className="section camp-booking-section" id="camp-booking"><div className="camp-booking-intro"><h2>ЗАПИСАТЬСЯ<br/>НА СМЕНУ</h2><p>Оставьте контакты для связи.<br/>Администратор подтвердит даты и наличие мест.</p><div className="camp-contact-details"><a href="tel:+79117292545"><Phone size={18}/>+7 911 729-25-45</a><a href="mailto:rasseloneup@mail.ru">rasseloneup@mail.ru</a><p className="venue-address"><a href="https://yandex.ru/maps/?text=Санкт-Петербург%2C%20Пироговская%20набережная%2017%20корпус%205" target="_blank" rel="noreferrer"><MapPin size={16}/><span>Пироговская набережная, 17, корпус 5</span></a><span className="venue-place">м. Выборгская · BASKET SPACE</span></p><p>Офис: пн–пт, 12:00–17:00</p></div></div><CampBookingForm shift={shift} onShiftChange={setShift} packageChoice={packageChoice}/></section>
    </main>
    <SiteFooter camp/>
  </div>;
}

