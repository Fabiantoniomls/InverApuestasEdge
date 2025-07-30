
'use client';

import * as React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart, Bar, Legend } from 'recharts';
import { Button } from '@/components/ui/button';

const profitLossData = [
    { name: '11 May', 'Beneficio Acumulado (€)': -40 },
    { name: '12 May', 'Beneficio Acumulado (€)': 22.5 },
    { name: '14 May', 'Beneficio Acumulado (€)': 122.5 },
    { name: '15 May', 'Beneficio Acumulado (€)': 197.5 },
    { name: '16 May', 'Beneficio Acumulado (€)': 172.5 },
    { name: '17 May', 'Beneficio Acumulado (€)': 72.5 },
    { name: '18 May', 'Beneficio Acumulado (€)': 115 },
];

const plBySportData = [
    { name: 'Fútbol', pl: 140.00 },
    { name: 'Tenis', pl: 100.00 },
    { name: 'Baloncesto', pl: 0.00 },
    { name: 'Fórmula 1', pl: -25.00 },
    { name: 'eSports', pl: -60.00 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p>{`${payload[0].name}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};


const PLBySport = () => {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">P/L por Deporte</h2>
            <div className="space-y-4">
                {plBySportData.map((sport) => {
                    const isProfit = sport.pl > 0;
                    const isLoss = sport.pl < 0;
                    const width = isLoss ? Math.abs(sport.pl) / 60 * 100 : sport.pl / 140 * 100;
                    
                    return (
                        <div key={sport.name}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-600">{sport.name}</span>
                                <span className={`font-semibold ${isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'}`}>
                                    {sport.pl.toFixed(2)}€
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${isProfit ? 'bg-green-500' : isLoss ? 'bg-red-500' : 'bg-gray-400'}`}
                                    style={{ width: `${width}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};


export function SummaryCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Evolución de Ganancias/Pérdidas</h2>
                <div className="flex space-x-2">
                     {['1M', '3M', '6M', 'YTD', '1A'].map((filter) => (
                        <Button key={filter} variant="outline" size="sm" className={filter === '1M' ? 'bg-accent' : ''}>
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={profitLossData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#4a5568" />
                        <YAxis stroke="#4a5568" tickFormatter={(value) => `${value}€`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="Beneficio Acumulado (€)"
                            stroke="#2b6cb0"
                            strokeWidth={2}
                            dot={{ stroke: '#2b6cb0', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <PLBySport />
    </div>
  );
}
