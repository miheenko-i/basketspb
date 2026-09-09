import { Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type Props = {
  muted: boolean;
  volume: number;
  needsPlay: boolean;
  onPlay: () => void;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
};

export function HeroAudioControl({ muted, volume, needsPlay, onPlay, onToggle, onVolumeChange }: Props) {
  return <>
    {needsPlay && <Button className="hero-play-button" onClick={onPlay}><Play size={18}/>Воспроизвести видео</Button>}
    <div className="hero-audio-control">
    <button className="hero-video-control" onClick={onToggle}
      aria-label={muted ? 'Включить звук видео' : 'Выключить звук видео'}
      title={muted ? 'Включить звук' : 'Выключить звук'}>
      {muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}
    </button>
    <span className="sr-only" id="hero-volume-label">Громкость видео</span>
    <Slider className="hero-volume" aria-labelledby="hero-volume-label"
      min={0} max={1} step={.01} largeStep={.1} value={[volume]}
      locale="ru-RU" format={{ style: 'percent' }}
      onValueChange={value => onVolumeChange(Array.isArray(value) ? value[0] : value)}/>
    </div>
  </>;
}
