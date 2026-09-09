import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://basketspb-court.miheenko.chatgpt.site'),
 title: 'Баскетбол для новичков и любителей в Санкт-Петербурге | BASKETSPB',
 description: 'Баскетбол для новичков и любителей в Санкт-Петербурге. Групповые тренировки для взрослых и детей, баскетбольный фристайл. Расписание пяти залов, стоимость и бесплатное пробное занятие.',
 robots: {index:false,follow:false},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="ru"><body><a className="skip-link" href="#main">Перейти к содержимому</a>{children}</body></html>;
}
