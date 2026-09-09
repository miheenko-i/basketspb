export type CampPhoto = { id: string; alt: string; width: number; height: number };
export type CampAlbum = { id: string; title: string; description: string; photos: CampPhoto[] };

export const campAlbums: CampAlbum[] = [
  {
    id: 'city',
    title: 'Исследуем город',
    description: 'Посещали легендарные площадки Петербурга и участвовали в открытии магазина Super Step.',
    photos: [
      { id: 'city-01', alt: 'Участники лагеря с тренером едут в метро', width: 1280, height: 960 },
      { id: 'city-02', alt: 'Участники лагеря на открытой баскетбольной площадке', width: 960, height: 1280 },
      { id: 'city-03', alt: 'Обед участников летнего лагеря', width: 960, height: 1280 },
      { id: 'city-04', alt: 'Участник лагеря отдыхает после тренировки на улице', width: 960, height: 1280 },
      { id: 'city-05', alt: 'Баскетбольный фристайл на мероприятии Super Step', width: 848, height: 1280 },
      { id: 'city-06', alt: 'Руслан Боравский показывает трюк с баскетбольным мячом', width: 848, height: 1280 },
      { id: 'city-07', alt: 'Общее фото участников лагеря с тренером у баскетбольного кольца', width: 1193, height: 1800 },
      { id: 'city-08', alt: 'Участники лагеря на эскалаторе в петербургском метро', width: 960, height: 1280 },
    ],
  },
  {
    id: 'life',
    title: 'Тренировки и отдых',
    description: 'Играли в NBA 2K, тренировались и плавали в аквапарке.',
    photos: [
      { id: 'life-01', alt: 'Участники лагеря на тренировке в баскетбольном зале', width: 1350, height: 1800 },
      { id: 'life-02', alt: 'Участник летнего лагеря с баскетбольным мячом', width: 1200, height: 1800 },
      { id: 'life-03', alt: 'Групповое фото участников лагеря в спортивном зале', width: 1350, height: 1800 },
      { id: 'life-04', alt: 'Участники лагеря играют в NBA 2K', width: 1350, height: 1800 },
      { id: 'life-05', alt: 'Участники лагеря отдыхают в бассейне аквапарка', width: 1350, height: 1800 },
      { id: 'life-06', alt: 'Участник лагеря с мячом на уличной площадке', width: 1350, height: 1800 },
      { id: 'life-07', alt: 'Участники лагеря с тренером под баскетбольным кольцом', width: 1680, height: 1680 },
      { id: 'life-08', alt: 'Общее фото участников летнего лагеря в аквапарке', width: 1350, height: 1800 },
    ],
  },
];

export const campVideos = [
  { id: 'camp-first-shift', title: 'Первая смена в полном разгаре', duration: '0:27' },
  { id: 'camp-basketball-dna', title: 'Баскетбол уже в нашем ДНК', duration: '0:22' },
];
