import type { Metadata } from 'next';
import CampPage from './camp-page';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Городской летний баскетбольный лагерь в Санкт-Петербурге | YO BALLER',
  description: 'Летний городской баскетбольный лагерь для новичков и любителей 10–18 лет. Четыре смены с мая по август, 2–3 тренировки в день. Программа, даты, стоимость и запись.',
  alternates: { canonical: 'https://miheenko-i.github.io/basketspb/summercamp/' },
};
export default function Page() { return <CampPage/>; }
