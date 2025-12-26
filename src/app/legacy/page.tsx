'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Dialog } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LegacyPage() {
    const legacyImage = PlaceHolderImages.find(img => img.id === '4');

    return (
        <Dialog>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-16">
                        <div className="text-center">
                            <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                RUIMUN Legacy
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                                A rich history of diplomacy, leadership, and global engagement. Explore the archives of past Redeemers International Model UN conferences.
                            </p>
                        </div>
                        
                        {legacyImage && (
                            <div className="my-12 overflow-hidden rounded-lg shadow-xl">
                                <Image
                                    src={legacyImage.imageUrl}
                                    alt={legacyImage.description}
                                    data-ai-hint={legacyImage.imageHint}
                                    width={1200}
                                    height={600}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-12 flex justify-center">
                            <Card className="w-full max-w-lg">
                                <CardHeader>
                                    <CardTitle>Archives Under Construction</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Our digital archive of past conferences is currently being curated. Soon, you will be able to explore the themes, topics, and outcomes of previous RUIMUN sessions. Check back for a journey through our history.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <RegisterDialogContent />
        </Dialog>
    );
}
