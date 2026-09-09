'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { campAlbums, campVideos, type CampAlbum } from '@/lib/camp-media';

function PhotoAlbum({ album }: { album: CampAlbum }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const photo = album.photos[index];
  const move = (step: number) => setIndex(current => (current + step + album.photos.length) % album.photos.length);

  return <article className="camp-album" aria-labelledby={`${album.id}-title`}>
    <h3 id={`${album.id}-title`}>{album.title}</h3>
    <p>{album.description}</p>
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="camp-photo-grid">
        {album.photos.map((item, photoIndex) => <DialogTrigger
          key={item.id}
          className="camp-photo"
          onClick={() => setIndex(photoIndex)}
          aria-label={`Увеличить фото ${photoIndex + 1} из ${album.photos.length}: ${item.alt}`}
        >
          <img src={`/basketspb/images/camp-gallery/${item.id}-thumb.webp`} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async"/>
          <Expand size={16} className="camp-photo-expand" aria-hidden="true"/>
        </DialogTrigger>)}
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
