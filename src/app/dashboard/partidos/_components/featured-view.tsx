
import { getMatchesByValue } from '../actions';
import { MatchCard } from './match-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export async function FeaturedView() {
    const { data: matches, error } = await getMatchesByValue();

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de Conexión con la Base de Datos</AlertTitle>
                <AlertDescription>
                    No se pudieron cargar los partidos destacados debido a un problema de conexión con el servidor. Por favor, inténtalo de nuevo más tarde.
                </AlertDescription>
            </Alert>
        )
    }

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
