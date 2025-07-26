

const strategies = [
    {
        plan: "Fixed Stake",
        description: "Bet a fixed amount (€/£) each time. Ideal for beginners, it provides predictability and control over your bankroll.",
        risk: "Low Risk",
        riskColor: "green"
    },
    {
        plan: "Percentage Stake",
        description: "Bet a fixed percentage of your current bankroll. Your stake size adjusts with your bankroll's fluctuations.",
        risk: "Moderate Risk",
        riskColor: "yellow"
    },
    {
        plan: "Fractional Kelly",
        description: "Bet a percentage of your bankroll based on the calculated value of the bet. Aims to maximize long-term growth.",
        risk: "High Risk",
        riskColor: "red"
    },
]

const riskColors = {
    green: {
        border: "border-green-500",
        bg: "bg-green-50",
        title: "text-green-800",
        badgeBg: "bg-green-100",
        description: "text-green-700"
    },
    yellow: {
        border: "border-yellow-500",
        bg: "bg-yellow-50",
        title: "text-yellow-800",
        badgeBg: "bg-yellow-100",
        description: "text-yellow-700"
    },
    red: {
        border: "border-red-500",
        bg: "bg-red-50",
        title: "text-red-800",
        badgeBg: "bg-red-100",
        description: "text-red-700"
    }
};

export function StakingStrategyTable() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Staking Strategy Reference</h2>
            <p className="text-gray-500 mb-6">Context for selecting a staking plan for your analysis.</p>
            <div className="space-y-4">
                {strategies.map((strategy) => {
                    const colors = riskColors[strategy.riskColor as keyof typeof riskColors];
                    return (
                        <div key={strategy.plan} className={`border-l-4 ${colors.border} ${colors.bg} p-4 rounded-r-lg`}>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`font-bold ${colors.title}`}>{strategy.plan}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badgeBg} ${colors.title}`}>
                                    {strategy.risk}
                                </span>
                            </div>
                            <p className={`text-sm ${colors.description}`}>{strategy.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
