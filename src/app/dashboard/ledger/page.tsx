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
        <>
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Betting Ledger</h2>
                <p className="text-gray-500 mt-1">A complete history of all your wagers.</p>
            </header>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake (€)</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L (€)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                        {allBets.map((bet) => (
                            <TableRow key={bet.id}>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bet.timestamp}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.sport}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bet.match}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.selection}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bet.odds.toFixed(2)}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bet.stake.toFixed(2)}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge variant={bet.status === 'Won' ? 'default' : 'destructive'} className={bet.status === 'Won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {bet.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${bet.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {bet.pnl > 0 ? '+' : ''}{bet.pnl.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
