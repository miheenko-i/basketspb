import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

type Props = {
  muted: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
};

export function HeroAudioControl({ muted, volume, onToggle, onVolumeChange }: Props) {
  return <div className="hero-audio-control">
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
  </div>;
}
