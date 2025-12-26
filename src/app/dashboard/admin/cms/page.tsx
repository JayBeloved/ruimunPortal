'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function CMSPage() {
    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Content Management</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Archive
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Past Conferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No conference archives have been created yet. Click the button above to get started.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
