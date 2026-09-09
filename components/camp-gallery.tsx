'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { campAlbums, campVideos, type CampAlbum } from '@/lib/camp-media';

function PhotoAlbum({ album }: { album: CampAlbum }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const photo = album.photos[index];
  const move = (step: number) => setIndex(current => (current + step + album.photos.length) % album.photos.length);
  const rows = Array.from({ length: Math.ceil(album.photos.length / 4) }, (_, row) => album.photos.slice(row * 4, row * 4 + 4));

  return <article className="camp-album" aria-labelledby={`${album.id}-title`}>
    <h3 id={`${album.id}-title`}>{album.title}</h3>
    <p>{album.description}</p>
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="camp-photo-grid">
        {rows.map((row, rowIndex) => <div className="camp-photo-row" key={row[0].id}>
          {row.map((item, itemIndex) => {
            const photoIndex = rowIndex * 4 + itemIndex;
            const ratio = item.width / item.height;
            const pairStart = Math.floor(itemIndex / 2) * 2;
            const pairRatio = row.slice(pairStart, pairStart + 2).reduce((sum, image) => sum + image.width / image.height, 0);
            const rowRatio = row.reduce((sum, image) => sum + image.width / image.height, 0);
            const thumbWidth = Math.round(item.width * 640 / Math.max(item.width, item.height));
            const imagePath = `/basketspb/images/camp-gallery/${item.id}`;
            return <DialogTrigger
              key={item.id}
              className="camp-photo"
              style={{ '--photo-ratio': ratio, '--pair-ratio': pairRatio } as CSSProperties}
              onClick={() => setIndex(photoIndex)}
              aria-label={`Увеличить фото ${photoIndex + 1} из ${album.photos.length}: ${item.alt}`}
            >
              <img
                src={`${imagePath}-thumb.webp`}
                srcSet={`${imagePath}-thumb.webp ${thumbWidth}w, ${imagePath}.webp ${item.width}w`}
                sizes={`(max-width: 640px) ${(ratio / pairRatio * 100).toFixed(2)}vw, (min-width: 1920px) ${Math.ceil(ratio / rowRatio * 1760)}px, ${(ratio / rowRatio * 100).toFixed(2)}vw`}
                alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async"
              />
              <Expand size={18} className="camp-photo-expand" aria-hidden="true"/>
            </DialogTrigger>;
          })}
        </div>)}
      </div>
      <DialogContent className="camp-lightbox" showCloseButton={false} onKeyDown={event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      }}>
        <div className="camp-lightbox-heading">
          <DialogTitle>{album.title}</DialogTitle>
          <DialogClose className="camp-media-control" aria-label="Закрыть фотографии"><X size={23}/></DialogClose>
        </div>
        <DialogDescription className="sr-only">Фотографии летнего лагеря. Используйте стрелки для просмотра.</DialogDescription>
        {open && <img className="camp-lightbox-image" src={`/basketspb/images/camp-gallery/${photo.id}.webp`} alt={photo.alt} width={photo.width} height={photo.height}/>}
        <div className="camp-lightbox-controls">
          <button type="button" className="camp-media-control" onClick={() => move(-1)} aria-label="Предыдущее фото"><ArrowLeft size={22}/></button>
          <span aria-live="polite" aria-atomic="true">{index + 1} / {album.photos.length}</span>
          <button type="button" className="camp-media-control" onClick={() => move(1)} aria-label="Следующее фото"><ArrowRight size={22}/></button>
        </div>
      </DialogContent>
    </Dialog>
  </article>;
}

export function CampGallery() {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  return <>
    <div className="camp-albums">{campAlbums.map(album => <PhotoAlbum key={album.id} album={album}/>)}</div>
    <div className="camp-videos">
      <h3>Видео из лагеря</h3>
      <div className="camp-video-grid">{campVideos.map((video, index) => <figure key={video.id}>
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Supplied clips have no caption tracks; retain the original audio without inventing a transcript. */}
        <video
          ref={element => { videos.current[index] = element; }}
          controls playsInline preload="none"
          poster={`/basketspb/images/${video.id}.jpg`}
          width="720" height="1280"
          aria-label={video.title}
          onPlay={() => videos.current.forEach((element, other) => { if (other !== index) element?.pause(); })}
        >
          <source src={`/basketspb/videos/${video.id}.mp4`} type="video/mp4"/>
          <a href={`/basketspb/videos/${video.id}.mp4`}>Открыть видео «{video.title}»</a>
        </video>
        <figcaption><span>{video.title}</span><span>{video.duration}</span></figcaption>
      </figure>)}</div>
    </div>
  </>;
}
