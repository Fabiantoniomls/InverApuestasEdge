import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const allBets = [
    { id: 1, sport: "Football", match: "Man City vs Arsenal", selection: "Man City", odds: 1.85, stake: 50, status: "Won", pnl: 42.50, timestamp: "2024-05-18" },
    { id: 2, sport: "Tennis", match: "Nadal vs Djokovic", selection: "Djokovic", odds: 2.10, stake: 100, status: "Lost", pnl: -100.00, timestamp: "2024-05-17" },
    { id: 3, sport: "Football", match: "Bayern Munich vs Dortmund", selection: "Draw", odds: 3.50, stake: 25, status: "Lost", pnl: -25.00, timestamp: "2024-05-16" },
    { id: 4, sport: "Football", match: "Liverpool vs Chelsea", selection: "Liverpool", odds: 2.00, stake: 75, status: "Won", pnl: 75.00, timestamp: "2024-05-15" },
    { id: 5, sport: "Tennis", match: "Alcaraz vs Sinner", selection: "Alcaraz", odds: 1.50, stake: 200, status: "Won", pnl: 100.00, timestamp: "2024-05-14" },
    { id: 6, sport: "Football", match: "Inter vs Milan", selection: "Inter", odds: 2.25, stake: 50, status: "Won", pnl: 62.50, timestamp: "2024-05-12" },
    { id: 7, sport: "Football", match: "Barcelona vs Real Madrid", selection: "Real Madrid", odds: 2.75, stake: 40, status: "Lost", pnl: -40.00, timestamp: "2024-05-11" },
];

export default function LedgerPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Betting Ledger</CardTitle>
                <CardDescription>A complete history of all your wagers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Sport</TableHead>
                            <TableHead>Match</TableHead>
                            <TableHead>Selection</TableHead>
                            <TableHead className="text-right">Odds</TableHead>
                            <TableHead className="text-right">Stake (€)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">P/L (€)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allBets.map((bet) => (
                            <TableRow key={bet.id}>
                                <TableCell>{bet.timestamp}</TableCell>
                                <TableCell>{bet.sport}</TableCell>
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
                                    {bet.pnl > 0 ? '+' : ''}{bet.pnl.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
