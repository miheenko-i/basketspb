'use client';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowUpRight, ArrowRight, MapPin, X, Pause, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { BookingForm } from '@/components/booking-form';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { visitRules } from '@/lib/site';
import { HeroTitle } from '@/components/hero-title';
import { createHeroPlayback } from '@/lib/hero-playback';
import { NewsFeed } from '@/components/news-feed';
import { ProgramSkills } from '@/components/program-skills';

const venues = [
 {id:'chkalovskaya',line:5,color:'#8b4a96',name:'Чкаловская',address:'Газовая улица, 10, корпус Ж',place:'м. Чкаловская / Петроградская',kids:'6–13 лет',sessions:[{days:'Понедельник, пятница',adult:'20:30 — 21:30',child:'19:30 — 20:30'}]},
 {id:'lesnaya',line:1,color:'#d32932',name:'Лесная',address:'Улица Карбышева, 9',place:'Спортивный центр «Триада»',kids:'7–13 лет',sessions:[{days:'Вторник, четверг',adult:'18:30 — 19:30',child:'18:30 — 19:30'}]},
 {id:'vyborgskaya',line:1,color:'#d32932',name:'Выборгская',address:'Евпаторийский переулок, 7Д',place:'Спортивный центр BASKET SPACE',kids:null,sessions:[{days:'Воскресенье',adult:'18:00 — 19:00',child:null}]},
 {id:'begovaya',line:3,color:'#178f54',name:'Беговая',address:'Приморский проспект, 72',place:'ТРК «Питерлэнд», 3 этаж',kids:'7–13 лет',sessions:[{days:'Понедельник',adult:'19:00 — 20:00',child:'18:00 — 19:00'},{days:'Суббота',adult:'20:00 — 21:00',child:'20:00 — 21:00'}]},
 {id:'park',line:2,color:'#2373b6',name:'Парк Победы',address:'Бассейная улица, 38к',place:'Спортивный центр URBO',kids:'7–13 лет',sessions:[{days:'Среда',adult:'19:00 — 20:00',child:'19:00 — 20:00'}]},
];
export default function Home() {
 const [venueId,setVenueId]=useState('chkalovskaya');
 const [audience,setAudience]=useState('adult');
 const [booking,setBooking]=useState(false);
 const [program,setProgram]=useState('Баскетбольные навыки');
 const videoRef=useRef<HTMLVideoElement>(null);
 const [videoPlaying,setVideoPlaying]=useState(false);
 const [videoReady,setVideoReady]=useState(false);
 const playbackRef=useRef<ReturnType<typeof createHeroPlayback> | null>(null);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video)return;
  const playback=createHeroPlayback(video,{document,window,motion:window.matchMedia('(prefers-reduced-motion: reduce)')},state=>{
   setVideoPlaying(state.playing);
   setVideoReady(state.ready);
  });
  playbackRef.current=playback;
  return()=>{playbackRef.current=null;playback.dispose()};
 },[]);
 const toggleVideo=()=>playbackRef.current?.toggle();

 const openBooking=(choice='Баскетбольные навыки',location?:string)=>{if(location)setVenueId(location);setProgram(choice);setBooking(true)};
 useEffect(()=>{
  type ToolContext={registerTool:(tool:Record<string,unknown>,options:{signal:AbortSignal})=>void|Promise<void>};
  const context=(document as Document & {modelContext?:ToolContext}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  try{Promise.resolve(context.registerTool({name:'show_training_schedule',title:'Показать расписание тренировок',description:'Перейти к расписанию зала. Все возрастные группы видны одновременно. Не создаёт запись и не отправляет сообщения.',inputSchema:{type:'object',properties:{venue:{type:'string',enum:venues.map(v=>v.id)}},required:['venue'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input:unknown){const value=input as {venue?:string};if(!value||!venues.some(v=>v.id===value.venue))throw new Error('Укажите существующий зал.');const chosen=venues.find(v=>v.id===value.venue)!;flushSync(()=>setVenueId(chosen.id));document.getElementById('venue-'+chosen.id)?.scrollIntoView({behavior:'instant'});return {venue:chosen.name,address:chosen.address,sessions:chosen.sessions.map(s=>({days:s.days,children:s.child,adults:s.adult})),bookingCreated:false}}},{signal:lifecycle.signal})).catch(()=>{});}catch{/* The site works without the optional browser API. */}
  return()=>lifecycle.abort();
 },[]);
 return <div id="top" className="home-page">
  <a className="announcement" href="#schedule">Новый сезон 2026 / 27 <span>Первая тренировка — бесплатно</span><ArrowUpRight size={14}/></a>
  <SiteHeader onBooking={()=>openBooking()}/>
  <main id="main">
   <section className="hero" aria-labelledby="hero-title"><div className="hero-media"><img className="hero-image" src="/basketspb/images/hero-poster.jpg" alt="Баскетбольная тренировка" fetchPriority="high" width="1600" height="900"/><video ref={videoRef} className={`hero-video ${videoReady?'is-ready':''}`} muted loop playsInline preload="auto" poster="/basketspb/images/hero-poster.jpg" aria-label="Видео баскетбольной тренировки"><source src="/basketspb/videos/hero.mp4" type="video/mp4"/></video><div className="hero-shade"/><button className="hero-video-control" onClick={toggleVideo} aria-label={videoPlaying?'Приостановить видео':'Воспроизвести видео'}>{videoPlaying?<Pause size={17}/>:<Play size={17}/>}</button></div><div className="hero-main"><HeroTitle id="hero-title" lines={["БАСКЕТБОЛ", "В СПБ."]} subtitle="Для новичков и любителей"/><div className="hero-bottom"><button className="button orange-button" onClick={()=>openBooking()}>Начать бесплатно <ArrowUpRight size={20}/></button><p>Взрослые и дети.<br/>Баскетбол и баскетбольный фристайл.</p></div></div><a className="hero-down" href="#programs" aria-label="К направлениям"><ArrowDown size={20}/></a></section>
   <div className="facts-strip"><span>ЛЮБОЙ УРОВЕНЬ</span><span>5 ЗАЛОВ В ГОРОДЕ</span><span>ДЕТИ И ВЗРОСЛЫЕ</span><span>ПРОБНОЕ ЗАНЯТИЕ БЕСПЛАТНО</span></div>
   <section className="section programs" id="programs"><div className="section-heading"><div><h2>НАПРАВЛЕНИЯ</h2></div><p>Научиться мастерски играть в баскетбол или же виртуозно овладеть баскетбольным мячом?</p></div><div className="program-grid">
    <article className="program-card"><button className="program-media" onClick={()=>openBooking('Баскетбольные навыки')} aria-label="Баскетбол — записаться на пробное"><img src="/basketspb/images/basketball.jpg" alt="Групповая тренировка по дриблингу" loading="lazy" width="1680" height="1120"/><span className="program-cta" aria-hidden="true"><span>Записаться на пробное</span><ArrowUpRight size={22}/></span></button><div className="program-copy"><h3 className="program-title">БАСКЕТБОЛ</h3><ProgramSkills label="Навыки на тренировках по баскетболу" skills={['Постановка броска', 'Дриблинг', 'Финты', 'Скорость', 'Координация', 'Выносливость', 'Общая физическая подготовка']}/></div></article>
    <article className="program-card freestyle-card"><button className="program-media" onClick={()=>openBooking('Баскетбольный фристайл')} aria-label="Баскетбольный фристайл — записаться на пробное"><img src="/basketspb/images/freestyle.jpg" alt="Баскетбольный фристайлер выполняет трюк с мячом" loading="lazy" width="1680" height="1120"/><span className="program-cta" aria-hidden="true"><span>Записаться на пробное</span><ArrowUpRight size={22}/></span></button><div className="program-copy"><h3 className="program-title">ФРИСТАЙЛ</h3><ProgramSkills label="Навыки на тренировках по фристайлу" skills={['Ловкость', 'Выносливость', 'Креативность', 'Нестандартное мышление', 'Физическая сила', 'Настойчивость', 'Упорство']}/></div></article>
   </div><div className="program-footnote"><a href="#team">Познакомиться с преподавателями <ArrowRight size={17}/></a></div></section>
   <section className="section growth-section" id="growth"><div className="section-heading"><h2>ПРОСТАЯ СИСТЕМА РОСТА<br/>ОТ НОВИЧКА ДО ЛЮБИТЕЛЯ</h2></div><ol className="growth-steps">
    <li><span className="growth-number" aria-hidden="true">01</span><h3>Групповые тренировки</h3><p>Осваивай и отрабатывай базовые навыки баскетбола — становись увереннее на площадке.</p></li>
    <li><span className="growth-number" aria-hidden="true">02</span><h3>Попадание в любительскую команду</h3><p>Осваивай простые взаимодействия в команде и учись играть вместе.</p></li>
    <li><span className="growth-number" aria-hidden="true">03</span><h3>Участие в любительских лигах города</h3><p>Погружайся в любительский баскетбол Санкт-Петербурга и становись частью его жизни.</p></li>
   </ol><button className="button orange-button" onClick={()=>openBooking()}>Присоединиться <ArrowUpRight size={20}/></button></section>
   <section id="schedule" className="section schedule-section"><div className="section-heading"><div><h2>РАСПИСАНИЕ ТРЕНИРОВОК</h2></div><p>Сезон 2026/2027. Набор открыт. Группы для взрослых и детей.</p></div>
    <div className="all-venues"><nav className="venue-anchors" aria-label="Перейти к расписанию зала">{venues.map(v=><a href={`#venue-${v.id}`} key={v.id}><span className="metro-dot" style={{backgroundColor:v.color,borderColor:v.color}} aria-hidden="true"/>{v.name}<ArrowDown size={14}/></a>)}</nav>{venues.map(v=><article className="venue-section" id={`venue-${v.id}`} key={v.id}><div className="schedule-body"><div className="venue-info"><h3>{v.name}</h3><p className="venue-address"><a href={`https://yandex.ru/maps/?text=${encodeURIComponent('Санкт-Петербург, '+v.address)}`} target="_blank" rel="noreferrer" aria-label={`Открыть на карте: ${v.address}`}><MapPin size={16}/><span>{v.address}</span></a><span className="venue-place">{v.place}</span></p></div><div className="sessions"><Table className="schedule-table"><TableHeader><TableRow><TableHead>Дни</TableHead><TableHead>Дети<small>{v.kids||'До 14 лет'}</small></TableHead><TableHead>Взрослые<small>14–65 лет</small></TableHead></TableRow></TableHeader><TableBody>{v.sessions.map(session=><TableRow key={session.days}><TableCell className="session-days">{session.days}</TableCell><TableCell>{session.child?<button className="time-button" onClick={()=>{setAudience('child');openBooking('Баскетбольные навыки',v.id)}} aria-label={`Записаться: ${v.name}, дети, ${session.days}, ${session.child}`}><span className="time-range">{session.child}</span><ArrowUpRight size={16}/></button>:<span className="no-session" title="Детское расписание не опубликовано">—</span>}</TableCell><TableCell><button className="time-button" onClick={()=>{setAudience('adult');openBooking('Баскетбольные навыки',v.id)}} aria-label={`Записаться: ${v.name}, от 14 лет, ${session.days}, ${session.adult}`}><span className="time-range">{session.adult}</span><ArrowUpRight size={16}/></button></TableCell></TableRow>)}</TableBody></Table></div></div></article>)}</div>
   </section>
   <section className="section price-section" id="prices"><div className="section-heading"><div><h2>СТОИМОСТЬ ЗАНЯТИЙ</h2></div><p>Групповые и индивидуальные занятия. Продолжительность — 60 минут.</p></div><div className="price-grid">{[{label:'Разовое занятие',price:'1 200',note:'Одна тренировка · 60 минут'},{label:'4 занятия',price:'4 000',note:'1 000 ₽ за тренировку'},{label:'8 занятий',price:'7 200',note:'900 ₽ за тренировку'},{label:'Индивидуально',price:'от 3 000',note:'Занятие с тренером один на один'}].map((p,i)=><button key={p.label} className={`price-card ${i===2?'featured-price':''}`} onClick={()=>openBooking(i===3?'Индивидуальная тренировка':'Баскетбольные навыки')}><span className="price-label">{p.label}{i===2&&<span className="saving-badge">НА 25% ВЫГОДНЕЕ</span>}</span><strong>{p.price}<small> ₽</small></strong><span className="price-note">{p.note}</span><span className="price-action">{i===3?'Обсудить с тренером':'Выбрать'}<ArrowUpRight size={21}/></span></button>)}</div><div className="price-terms"><p className="season-note">Сезон 2025/26. Стоимость сезона 2026/27 уточняйте при записи.</p><div className="price-documents"><details><summary>Условия абонемента</summary><p>Абонемент действует 4 недели со следующего дня после покупки. О пропуске необходимо предупредить администратора минимум за 24 часа. При отмене тренировки школой занятие сохраняется. Условия продления, оплаты и возврата уточняйте у администратора до покупки.</p></details><a className="rules-link" href={visitRules} target="_blank" rel="noreferrer"><span>Правила посещения<small>Открыть документ · PDF</small></span><ArrowUpRight size={21}/></a></div></div></section>
   <section className="section about-section" id="team"><div className="about-heading"><h2>ПРЕПОДАВАТЕЛИ</h2></div><div className="about-grid"><div><p className="about-intro">Мяч в нашем сердце<br/>уже с первого занятия!</p><p className="about-description">Осваивай базовые навыки на групповых тренировках. Учись взаимодействовать в команде и участвуй в любительских лигах Санкт-Петербурга.</p><a className="text-link" href="https://vk.com/yoballerspb" target="_blank" rel="noreferrer">Жизнь школы во ВКонтакте <ArrowUpRight size={18}/></a></div><div className="coaches"><article><div className="coach-photo ruslan-photo"><img src="/basketspb/images/coach-ruslan-original.png" alt="Руслан Боравский — тренер по баскетболу и фристайлу" width="415" height="652" loading="lazy"/></div><h3>Руслан Боравский</h3><p>Основатель школы. Баскетбол и фристайл. Более 10 лет преподавания. Чемпион мира по баскетбольному фристайлу в составе сборной России, 2017.</p></article><article><div className="coach-photo denis-photo"><img src="/basketspb/images/coach-denis-original.png" alt="Денис Гилязев — тренер по баскетболу" width="415" height="474" loading="lazy"/></div><h3>Денис Гилязев</h3><p>Тренер по баскетболу. 17 лет в баскетболе, 7 лет тренерского опыта. Чемпион Медиа Лиги в составе Underground Bizne$, весна 2026.</p></article></div></div></section>
   <section className="section teams-section" id="teams"><div className="section-heading"><div><h2>ЛЮБИТЕЛЬСКИЕ КОМАНДЫ</h2></div></div><div className="team-cards">{[
    {id:'men',name:'Ballers from the Hood',label:'Мужская команда',description:'Выступаем в любительских лигах города: СЛПРО, Невская Лига, Все Смарт.',width:1680,height:1521},
    {id:'kids',name:'Ballers from the Street',label:'Детская команда',description:'Чемпионы зимнего этапа лиги Дабл-С 2026 года.',width:884,height:783},
    {id:'women',name:'Girls Ballers',label:'Женская команда',description:'Новая глава для женского баскетбола.',width:632,height:789}
   ].map(team=><article key={team.id}><img src={`/basketspb/images/team-${team.id}.jpg`} alt={`${team.label} ${team.name}`} width={team.width} height={team.height} loading="lazy"/><h3>{team.name}</h3><p className="team-label">{team.label}</p><p className="team-description">{team.description}</p></article>)}</div></section>
   <NewsFeed/>
   <section className="trial-section"><div><h2>БЕСПЛАТНАЯ<br/>ПРОБНАЯ ТРЕНИРОВКА</h2><p className="section-intro">Запишись на первое пробное занятие. Для новичков и любителей, взрослых и детей.</p></div><div className="trial-action"><button className="button dark-button" onClick={()=>openBooking()}>Записаться на тренировку <ArrowUpRight size={20}/></button></div></section>
  </main>
  <SiteFooter/>
  <Dialog open={booking} onOpenChange={setBooking}><DialogContent className="booking-dialog" showCloseButton={false}><DialogClose className="modal-close" aria-label="Закрыть"><X size={22}/></DialogClose><BookingForm venues={venues} venueId={venueId} program={program} audience={audience} onVenueChange={setVenueId} onProgramChange={setProgram} onAudienceChange={setAudience} onClose={()=>setBooking(false)}/></DialogContent></Dialog>

 </div>;
}

