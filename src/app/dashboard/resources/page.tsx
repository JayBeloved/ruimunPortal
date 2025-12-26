'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourcesPage() {
    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-4">Delegate Resources</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We are currently preparing a comprehensive set of resources to help you excel at the conference. Please check back later for updates.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
