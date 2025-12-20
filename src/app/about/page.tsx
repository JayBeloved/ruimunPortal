import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Globe, Lightbulb, Target } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === '3');
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="font-headline text-lg uppercase tracking-widest text-primary">
                The 6th Edition
              </p>
              <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About RUIMUN
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Forging future leaders through diplomacy and global discourse since our inception.
              </p>
            </div>

            {aboutImage && (
              <div className="my-12 overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  data-ai-hint={aboutImage.imageHint}
                  width={1200}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg mx-auto max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              <p>
                Welcome to the Redeemer&apos;s University International Model United Nations (RUIMUN) conference, a premier platform for young leaders to engage with the world&apos;s most pressing issues. Now in our sixth consecutive year, we have built a legacy of fostering diplomatic skills, critical thinking, and a deep understanding of international relations.
              </p>
              
              <div className="my-12 grid gap-8 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-primary/10 p-3 text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                  </div>
                  <p className="mt-4 text-base text-muted-foreground">
                    To empower the next generation of global leaders by providing a dynamic and educational environment where they can debate, negotiate, and collaborate on solutions to complex international challenges.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-primary/10 p-3 text-primary">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                  </div>
                  <p className="mt-4 text-base text-muted-foreground">
                    To be a leading Model UN conference that inspires positive change, promotes multicultural understanding, and cultivates a lasting commitment to peace, development, and human rights among all participants.
                  </p>
                </div>
              </div>

              <h3>A Tradition of Excellence</h3>
              <p>
                Each year, RUIMUN brings together hundreds of ambitious students from diverse backgrounds. Our commitment to a high-quality, realistic simulation of the United Nations has made us a highly anticipated event. We pride ourselves on meticulously researched topics, professionally trained chairs, and an atmosphere that is both intellectually challenging and warmly welcoming. As we mark our 6th session, we continue to innovate and enhance the delegate experience, ensuring RUIMUN remains at the forefront of collegiate Model UN conferences.
              </p>
              <div className="not-prose mt-12 text-center">
                <Dialog>
                  <DialogTrigger asChild>
                      <Button size="lg" variant="accent">
                          Join the Legacy - Register Now
                      </Button>
                  </DialogTrigger>
                  <RegisterDialogContent />
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
