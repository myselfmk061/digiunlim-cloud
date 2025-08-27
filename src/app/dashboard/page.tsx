
import { Suspense } from 'react';
import { Dashboard } from '@/components/dashboard';
import { Loader2 } from 'lucide-react';

function DashboardLoading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4">Loading Dashboard...</p>
        </div>
    )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Dashboard />
    </Suspense>
  );
}
