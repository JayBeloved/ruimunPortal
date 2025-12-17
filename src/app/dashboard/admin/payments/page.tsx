
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminPaymentsPage() {
  return (
    <div>
        <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Payment Management</h2>
            <p className="text-muted-foreground">
                This feature is under development.
            </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            A dedicated interface for tracking and managing delegate payments will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You will be able to view detailed payment logs, send reminders, and generate financial reports.</p>
        </CardContent>
      </Card>
    </div>
  );
}
