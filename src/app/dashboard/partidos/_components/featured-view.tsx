
import { getMatchesByValue } from '../actions';
import { MatchCard } from './match-card';

export async function FeaturedView() {
    const matches = await getMatchesByValue();

    if (!matches || matches.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron partidos destacados con valor en este momento.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    )
}
