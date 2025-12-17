
import { DelegatesTable } from "@/components/dashboard/admin/delegates-table";
import { delegates, committees } from "@/lib/data";

export default function AdminDelegatesPage() {
    // In a real app, this data would be fetched from Firestore
    const allDelegates = delegates;
    const allCommittees = committees;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Delegate Management</h2>
                <p className="text-muted-foreground">
                    View, search, and manage all registered delegates.
                </p>
            </div>
            <DelegatesTable initialData={allDelegates} committees={allCommittees} />
        </div>
    );
}
