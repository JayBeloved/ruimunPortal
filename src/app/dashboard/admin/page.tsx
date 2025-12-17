
import { SummarySection } from "@/components/dashboard/admin/summary-section";
import { delegates, committees } from "@/lib/data";

export default function AdminDashboardPage() {
  // In a real app, this data would be fetched from Firestore
  const allDelegates = delegates;
  const allCommittees = committees;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
            <p className="text-muted-foreground">
                A high-level overview of RUIMUN '26 statistics.
            </p>
        </div>
      </div>
      <SummarySection delegates={allDelegates} committees={allCommittees} />
    </div>
  );
}
