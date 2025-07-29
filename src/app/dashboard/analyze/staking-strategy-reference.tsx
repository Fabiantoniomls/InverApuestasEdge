import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


interface StakingStrategyReferenceProps {
    title: string;
    description: string;
}

export function StakingStrategyReference({ title, description }: StakingStrategyReferenceProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>¿Qué es el Criterio de Kelly?</AccordionTrigger>
                        <AccordionContent>
                        El Criterio de Kelly es una fórmula matemática que determina el tamaño óptimo de la apuesta para maximizar el crecimiento del capital a largo plazo. La fórmula es: `(Probabilidad * Cuota - 1) / (Cuota - 1)`. Un "Full Kelly" puede ser muy agresivo, por lo que se suelen usar fracciones (Medio, Cuarto) para reducir la volatilidad.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>¿Qué es una Apuesta de Valor?</AccordionTrigger>
                        <AccordionContent>
                        Una apuesta de valor (Value Bet) ocurre cuando la probabilidad de que un evento ocurra es mayor de lo que las cuotas de la casa de apuestas sugieren. La fórmula para identificar valor es: `(Probabilidad Estimada * Cuota Decimal) - 1 > 0`. Un resultado positivo indica una apuesta de valor.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>¿Cómo funciona el modelo Poisson-xG?</AccordionTrigger>
                        <AccordionContent>
                        Este modelo utiliza los Goles Esperados (xG), que miden la calidad de las oportunidades de gol, en lugar de solo los goles reales. La distribución de Poisson se usa para calcular la probabilidad de que cada equipo marque un número específico de goles, permitiendo simular el partido miles de veces para obtener las probabilidades de victoria, empate o derrota.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
