'use client';

import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { visitRules } from '@/lib/site';

const mainNav = [
  { href: '#programs', label: 'Направления' },
  { href: '#schedule', label: 'Расписание' },
  { href: '#prices', label: 'Стоимость' },
  { href: '#team', label: 'Преподаватели' },
  { href: '#teams', label: 'Команды' },
  { href: '#news', label: 'Новости' },
  { href: '/basketspb/summercamp/', label: 'Летний лагерь' },
];
export function Brand({ camp = false }: { camp?: boolean }) {
  return <a className="wordmark" href={camp ? '/basketspb/' : '#top'} aria-label="YO BALLER, главная"><img src="/basketspb/images/yo-baller.svg" alt="YO BALLER" width="1061" height="119"/></a>;
}
export function SiteHeader({ camp = false, onBooking }: { camp?: boolean; onBooking?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = camp ? [
    { href: '/basketspb/', label: 'Главная' },
    { href: '#camp-program', label: 'Программа' },
    { href: '#camp-shifts', label: 'Смены' },
    { href: '#camp-prices', label: 'Стоимость' },
    { href: '#camp-booking', label: 'Записаться' },
  ] : mainNav;
  return <>
    <header className="site-header"><Brand camp={camp}/><nav aria-label="Основная навигация">{nav.map(item => <a key={item.href} href={item.href} aria-current={camp && item.label === 'Летний лагерь' ? 'page' : undefined}>{item.label}</a>)}</nav><div className="header-actions">{camp ? <a href="#camp-booking" className="button small dark-button">На смену <ArrowUpRight size={17}/></a> : <button className="button small dark-button" onClick={onBooking}>На тренировку <ArrowUpRight size={17}/></button>}<button className="mobile-menu-button" aria-label="Открыть меню" onClick={() => setMenuOpen(true)}><Menu size={24}/></button></div></header>
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="mobile-menu-dialog" showCloseButton={false}><DialogClose className="modal-close" aria-label="Закрыть меню"><X size={24}/></DialogClose><DialogTitle>МЕНЮ</DialogTitle><DialogDescription className="sr-only">Навигация по сайту школы</DialogDescription><nav aria-label="Мобильная навигация">{nav.map(item => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={24}/></a>)}</nav></DialogContent></Dialog>
  </>;
}
export function SiteFooter({ camp = false }: { camp?: boolean }) {
  const home = camp ? '/basketspb/' : '';
  return <footer className="site-footer">
    <div className="footer-top"><div><Brand camp={camp}/><p>Баскетбол для новичков и любителей.<br/>Санкт-Петербург.</p></div><div className="footer-links"><a href={home + '#schedule'}>Расписание</a><a href={home + '#team'}>Преподаватели</a><a href={home + '#teams'}>Команды</a><a href="/basketspb/summercamp/">Летний лагерь</a></div><div className="footer-contact"><a href="tel:+79117292545">+7 911 729-25-45</a><a href="mailto:rasseloneup@mail.ru">rasseloneup@mail.ru</a><span>Офис: пн–пт, 12:00–17:00</span></div></div>
    <nav className="footer-socials" aria-label="Социальные сети"><span>МЫ В СОЦСЕТЯХ</span><a href="https://vk.com/yoballerspb" target="_blank" rel="noreferrer">ВКонтакте <ArrowUpRight size={16}/></a><a href="https://t.me/yoballerspb" target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={16}/></a><a href="https://www.youtube.com/channel/UCwAA_JZ8-31jW-zqcY6mXOg" target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={16}/></a></nav>
    <div className="footer-bottom"><span>© 2026 YO BALLER</span><a href={visitRules} target="_blank" rel="noreferrer">Правила посещения <ArrowUpRight size={13}/></a><span>Концепция редизайна</span><a href="#top" aria-label="Наверх">Наверх ↑</a></div>
    <div className="footer-legal"><span>ИП Боравский Руслан Генрихович</span><span>ИНН 781901726463</span><span>ОГРНИП 325784700268009</span></div>
  </footer>;
}
