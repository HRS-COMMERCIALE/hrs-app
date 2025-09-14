import React from 'react';

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}
