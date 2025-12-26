'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Dialog } from '@/components/ui/dialog';
import { RegisterDialogContent } from '@/components/auth/register-dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ResourcesPage() {
    const resourceImage = PlaceHolderImages.find(img => img.id === '2');

    return (
        <Dialog>
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-16">
                        <div className="text-center">
                            <h1 className="mt-2 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Resources and Documents
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                                The RUIMUN Comprehensive Library is under development.
                            </p>
                        </div>
                        
                        {resourceImage && (
                          <div className="my-12 overflow-hidden rounded-lg shadow-xl">
                            <Image
                              src={resourceImage.imageUrl}
                              alt={resourceImage.description}
                              data-ai-hint={resourceImage.imageHint}
                              width={1200}
                              height={600}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="mt-12 flex justify-center">
                            <Card className="w-full max-w-lg">
                                <CardHeader>
                                    <CardTitle>Under Development</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We are currently building a comprehensive library of resources, including past conference documents, delegate guides, and research materials. Please check back soon for updates.
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
