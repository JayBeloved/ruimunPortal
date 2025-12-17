
import { StatusCards } from "@/components/dashboard/delegate/status-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { delegates, committees } from "@/lib/data";

export default function DelegateDashboardPage() {
    // This is a mock data fetch. In a real app, you'd get the logged-in user's ID.
    const delegate = delegates.find(d => d.email === 'delegate@ruimun.com');
    const committee = delegate?.committeeId ? committees.find(c => c.id === delegate.committeeId) : null;
    
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, {delegate?.name || 'Delegate'}!</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s an overview of your RUIMUN &apos;26 journey.
                    </p>
                </div>
            </div>
            
            <StatusCards delegate={delegate || null} committee={committee || null} />
            
            {committee && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Committee Details</CardTitle>
                        <CardDescription>{committee.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Topic</h3>
                            <p className="text-muted-foreground">{committee.topic}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-muted-foreground">{committee.description}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
