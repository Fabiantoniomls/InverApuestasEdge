import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, DollarSign, Plus } from "lucide-react";

const recentBets = [
    { match: "Man City vs Arsenal", selection: "Man City", odds: 1.85, stake: 50, status: "Won", pnl: 42.50 },
    { match: "Nadal vs Djokovic", selection: "Djokovic", odds: 2.10, stake: 100, status: "Lost", pnl: -100.00 },
    { match: "Bayern Munich vs Dortmund", selection: "Draw", odds: 3.50, stake: 25, status: "Lost", pnl: -25.00 },
    { match: "Liverpool vs Chelsea", selection: "Liverpool", odds: 2.00, stake: 75, status: "Won", pnl: 75.00 },
];

export default function DashboardPage() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bankroll</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">€10,483.21</div>
                    <p className="text-xs text-muted-foreground">+12.1% from last month</p>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bets</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">5</div>
                    <p className="text-xs text-muted-foreground">+2 since last week</p>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall P/L</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500 font-headline">+€483.21</div>
                    <p className="text-xs text-muted-foreground">Total since inception</p>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Recent Bets</CardTitle>
                        <CardDescription>An overview of your most recent wagers.</CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/dashboard/analyze">
                            New Analysis
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Match</TableHead>
                                <TableHead>Selection</TableHead>
                                <TableHead className="text-right">Odds</TableHead>
                                <TableHead className="text-right">Stake (€)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">P/L (€)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentBets.map((bet) => (
                                <TableRow key={bet.match}>
                                    <TableCell className="font-medium">{bet.match}</TableCell>
                                    <TableCell>{bet.selection}</TableCell>
                                    <TableCell className="text-right">{bet.odds.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{bet.stake.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={bet.status === 'Won' ? 'default' : 'destructive'} className={bet.status === 'Won' ? 'bg-green-500/20 text-green-700' : ''}>
                                            {bet.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right font-medium ${bet.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {bet.pnl.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
