import type { Metadata } from 'next';
import { ScrollReveals } from '@/components/scroll-reveals';
import './globals.css';
import './camp.css';
import './wide-layout.css';
import './hero-title.css';
import './section-layout.css';
import './reveals.css';
import './news.css';
import './typography.css';
import './legal.css';
import './desktop-scale.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://miheenko-i.github.io/basketspb/'),
 title: 'Баскетбол для новичков и любителей в Санкт-Петербурге | YO BALLER',
 description: 'Баскетбол для новичков и любителей в Санкт-Петербурге. Групповые тренировки для взрослых и детей, баскетбольный фристайл. Расписание пяти залов, стоимость и бесплатное пробное занятие.',
 alternates: {canonical:'https://miheenko-i.github.io/basketspb/'},
 icons: {icon:'/basketspb/favicon.svg'},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="ru"><body><a className="skip-link" href="#main">Перейти к содержимому</a>{children}<ScrollReveals/></body></html>;
}
