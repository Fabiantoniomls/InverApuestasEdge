
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { handleImageAnalysis } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from './results-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analizando Imagen...' : 'Extraer Partidos de la Imagen'}
        </Button>
    );
}

export function ImageAnalysisForm() {
    const [state, formAction] = useActionState(handleImageAnalysis, initialState);
    const [preview, setPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Análisis desde Imagen</CardTitle>
                    <CardDescription>Sube una captura de pantalla de un sitio de apuestas (ej. Betano) y la IA extraerá los partidos y las cuotas por ti.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="image">Archivo de Imagen</Label>
                        <div 
                            className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="text-center">
                                {preview ? (
                                    <Image src={preview} alt="Image preview" width={400} height={200} className="mx-auto h-auto w-auto max-h-48 rounded-lg"/>
                                ) : (
                                    <>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <p className="pl-1">Sube un archivo o arrástralo y suéltalo</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 10MB</p>
                                    </>
                                )}
                                <Input 
                                    ref={fileInputRef}
                                    id="image" 
                                    name="image" 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleImageChange}
                                    required 
                                />
                            </div>
                        </div>
                        {state.fields?.image && <p className="text-red-500 text-sm mt-2">{state.fields.image}</p>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
            
            {state.message && !state.data && (
                 <Alert variant={state.issues ? "destructive" : "default"}>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}

            {state.data && <ResultsDisplay data={state.data} />}
        </form>
    );
}

