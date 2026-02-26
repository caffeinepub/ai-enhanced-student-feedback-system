import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import FeatureCard from '../components/FeatureCard';
import { ArrowRight, Sparkles, BarChart3, Clock } from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Analysis',
    description:
      'Our intelligent system analyzes your submission for depth, structure, and clarity — providing a comprehensive score and detailed insights.',
    iconSrc: '/assets/generated/icon-ai.dim_128x128.png',
    accentColor: 'amber' as const,
  },
  {
    title: 'Instant Feedback',
    description:
      'Receive detailed, actionable feedback within seconds of submitting your work. No more waiting days for instructor responses.',
    iconSrc: '/assets/generated/icon-submit.dim_128x128.png',
    accentColor: 'teal' as const,
  },
  {
    title: 'Progress Tracking',
    description:
      'Monitor your improvement over time with a personal dashboard showing all your submissions, scores, and feedback history.',
    iconSrc: '/assets/generated/icon-progress.dim_128x128.png',
    accentColor: 'green' as const,
  },
];

const stats = [
  { label: 'Students Helped', value: '2,400+', icon: <Sparkles className="h-5 w-5" /> },
  { label: 'Feedback Generated', value: '18,000+', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Avg. Response Time', value: '< 2s', icon: <Clock className="h-5 w-5" /> },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-light/60 via-background to-teal-light/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Enhanced Learning Platform
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-5">
                Smarter Feedback,{' '}
                <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
                  Better Results
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                SmartFeedback uses AI to analyze student submissions and deliver instant, personalized
                feedback — helping students improve faster and instructors save time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/submit">
                  <Button size="lg" className="gradient-amber-teal text-white border-0 hover:opacity-90 font-semibold shadow-sm">
                    Submit Your Work
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-border font-semibold hover:bg-muted">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative animate-fade-in hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-card-hover border border-border">
                <img
                  src="/assets/generated/hero-banner.dim_1200x400.png"
                  alt="AI-powered student feedback illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-card flex items-center gap-3">
                <div className="h-9 w-9 rounded-full gradient-amber flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Score</p>
                  <p className="font-display font-bold text-foreground">92/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  {stat.icon}
                  <span className="font-display font-bold text-2xl">{stat.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
              excel
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            SmartFeedback combines AI analysis with intuitive tools to create a seamless feedback
            experience for students and instructors alike.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl gradient-amber-teal p-8 md:p-12 text-center text-white shadow-card-hover">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            Ready to get smarter feedback?
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Submit your first assignment today and experience AI-powered feedback in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/submit">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-sm">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold">
                Instructor Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
