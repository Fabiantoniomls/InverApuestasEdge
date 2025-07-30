
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MatchCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-6 w-1/5 ml-auto" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-6 w-1/5 ml-auto" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t pt-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-9 w-1/2" />
                </div>
            </CardContent>
        </Card>
    );
}
