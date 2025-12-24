import { Loader2 } from 'lucide-react';

export function AdminPageLoader() {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-lg text-muted-foreground">Loading Data...</p>
        </div>
    );
}
