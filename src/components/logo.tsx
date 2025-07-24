import { Scaling } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Scaling className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
        BetValuator Edge
      </h1>
    </div>
  );
}
