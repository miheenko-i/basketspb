import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ProgramSkills({ skills, label }: { skills: readonly string[]; label: string }) {
  return <ul className="program-skills" aria-label={label}>
    {skills.map(skill => <Badge render={<li/>} variant="secondary" className="program-skill" key={skill}>
      <span className="program-skill-check" aria-hidden="true"><Check size={16} strokeWidth={2.5}/></span>
      <span className="program-skill-label">{skill}</span>
    </Badge>)}
  </ul>;
}
