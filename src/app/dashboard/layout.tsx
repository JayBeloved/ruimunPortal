'use client';

import { usePathname } from 'next/navigation';
import { DelegateLayout } from '@/components/dashboard/delegate/delegate-layout';
import { AdminHeader } from '@/components/dashboard/admin/dashboard-header';
import { AdminNav } from '@/components/dashboard/admin/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/dashboard/admin');

    if (isAdmin) {
        return (
            <div className="min-h-screen w-full flex">
                <AdminNav />
                <div className="flex flex-col w-full md:ml-64">
                    <AdminHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // Default to delegate layout
    return (
        <DelegateLayout>
            {children}
        </DelegateLayout>
    );
}
