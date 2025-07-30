
'use client';

import { FilterSidebar } from './_components/filter-sidebar';

export default function PartidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <FilterSidebar />
      <main className="flex-1 overflow-y-auto">
          {children}
      </main>
    </div>
  );
}
