'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Dialog } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';

export default function GalleryPage() {
    const galleryImage = PlaceHolderImages.find(img => img.id === '1');

    return (
        <Dialog>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-16">
                        <div className="text-center">
                            <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Conference Gallery
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                                A legacy of diplomacy, debate, and discovery across our successful sessions.
                            </p>
                        </div>

                        {galleryImage && (
                          <div className="my-12 overflow-hidden rounded-lg shadow-xl">
                            <Image
                              src={galleryImage.imageUrl}
                              alt={galleryImage.description}
                              data-ai-hint={galleryImage.imageHint}
                              width={1200}
                              height={600}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {PlaceHolderImages.map((image) => (
                                <div key={image.id} className="overflow-hidden rounded-lg shadow-lg">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <RegisterDialogContent />
        </Dialog>
    );
}
