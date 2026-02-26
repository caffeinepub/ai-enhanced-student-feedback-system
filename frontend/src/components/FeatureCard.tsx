interface FeatureCardProps {
  title: string;
  description: string;
  iconSrc: string;
  accentColor?: 'amber' | 'teal' | 'green';
}

const accentMap = {
  amber: 'bg-primary/10 border-primary/20',
  teal: 'bg-teal-light/50 border-teal/20',
  green: 'bg-green-50 border-green-200',
};

export default function FeatureCard({ title, description, iconSrc, accentColor = 'amber' }: FeatureCardProps) {
  return (
    <div className="group flex flex-col items-start p-6 rounded-2xl bg-card border border-border shadow-card card-hover">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border ${accentMap[accentColor]} transition-transform duration-200 group-hover:scale-105`}>
        <img src={iconSrc} alt={title} className="h-8 w-8 object-contain" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
