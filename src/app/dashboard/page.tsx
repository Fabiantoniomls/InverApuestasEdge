
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingMatches } from "./upcoming-matches";
import Loading from './partidos/loading';
import { DashboardClientPage } from './_components/dashboard-client-page';


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    return (
        <div className="space-y-12">
            <Suspense fallback={<Loading />}>
                <DashboardClientPage />
            </Suspense>

            <Suspense fallback={<div>Cargando partidos...</div>}>
                 <UpcomingMatches />
            </Suspense>
        </div>
    );
}
