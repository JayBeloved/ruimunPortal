import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Briefcase, Globe, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const benefits = [
  {
    icon: GraduationCap,
    title: 'World-Class Speakers & Skill-Building',
    description: 'Gain insights from leading experts in international affairs and develop critical skills in diplomacy, public speaking, and negotiation.',
  },
  {
    icon: Globe,
    title: 'Unmatched Global Networking',
    description: 'Connect with a diverse group of delegates from around the world, building lasting relationships and expanding your professional network.',
  },
  {
    icon: Briefcase,
    title: 'Career Advancement',
    description: 'Enhance your resume and stand out to universities and employers with the prestigious experience of participating in an international MUN conference.',
  },
];

export default function Home() {
  return (
    <Dialog>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-card py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
              <div className="absolute inset-0 bg-primary/10 opacity-50"></div>
              <div className="relative z-10">
                <p className="font-headline text-lg uppercase tracking-widest text-primary">
                  6th Session of the Redeemer&apos;s University International Model United Nations
                </p>
                <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                  Better Together for Peace, Development, and Human Rights
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                  This theme underscores the importance of global cooperation in addressing the world’s most pressing
                  challenges. We believe that by uniting diverse perspectives and fostering collaborative solutions, we
                  can make significant strides towards a more peaceful, equitable, and sustainable future.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <DialogTrigger asChild>
                    <Button size="lg" variant="accent" className="w-full sm:w-auto">
                      Register Now <ArrowRight className="ml-2" />
                    </Button>
                  </DialogTrigger>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                  Why Attend RUIMUN &apos;26?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  Elevate your skills, expand your network, and engage with global issues.
                </p>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="flex flex-col items-center p-8 text-center transition-transform hover:scale-105 hover:shadow-xl">
                    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                      <benefit.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">{benefit.title}</h3>
                    <p className="mt-2 text-muted-foreground flex-1">{benefit.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                  Moments from Past Conferences
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  A legacy of diplomacy, debate, and discovery across five successful sessions.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {PlaceHolderImages.slice(0, 6).map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="cta" className="py-20">
            <div className="container mx-auto px-4">
              <Card className="bg-primary text-primary-foreground p-8 md:p-12">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <h2 className="font-headline text-3xl font-bold">Ready to Shape the Future?</h2>
                    <p className="mt-2 text-lg text-primary-foreground/80">
                      Join hundreds of delegates in a premier diplomatic simulation. Your journey starts here.
                    </p>
                  </div>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" className="flex-shrink-0 text-primary hover:bg-white/90">
                      Register Today
                    </Button>
                  </DialogTrigger>
                </div>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
        <RegisterDialogContent />
      </div>
    </Dialog>
  );
}
