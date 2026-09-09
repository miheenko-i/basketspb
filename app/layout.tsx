import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://miheenko-i.github.io/basketspb/'),
 title: 'Баскетбол для новичков и любителей в Санкт-Петербурге | YO BALLER',
 description: 'Баскетбол для новичков и любителей в Санкт-Петербурге. Групповые тренировки для взрослых и детей, баскетбольный фристайл. Расписание пяти залов, стоимость и бесплатное пробное занятие.',
 alternates: {canonical:'https://miheenko-i.github.io/basketspb/'},
 icons: {icon:'/basketspb/favicon.svg'},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="ru"><body><a className="skip-link" href="#main">Перейти к содержимому</a>{children}</body></html>;
}
