import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const strategies = [
    {
        plan: "Fixed Stake",
        how: "Bet a fixed amount (€X) each time.",
        risk: "Low",
        useCase: "Beginners, testing new models, low-risk profiles.",
    },
    {
        plan: "Percentage Stake",
        how: "Bet a fixed % of the current bankroll.",
        risk: "Moderate",
        useCase: "Long-term growth, balancing risk/reward, proven models.",
    },
    {
        plan: "Fractional Kelly",
        how: "Bet a % based on the size of the value.",
        risk: "High",
        useCase: "Advanced users, maximizing growth with a quantified, high-confidence edge.",
    },
]

export function StakingStrategyTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Staking Strategy Reference</CardTitle>
                <CardDescription>Context for selecting a staking plan for your analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staking Plan</TableHead>
                            <TableHead>How It Works</TableHead>
                            <TableHead>Risk Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {strategies.map((strategy) => (
                             <TableRow key={strategy.plan}>
                                <TableCell className="font-semibold">{strategy.plan}</TableCell>
                                <TableCell>{strategy.how}</TableCell>
                                <TableCell>{strategy.risk}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
