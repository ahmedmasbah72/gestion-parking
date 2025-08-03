
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Car } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glass-card rounded-lg mb-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Car className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">ParkSpace</h1>
      </div>
      <ThemeToggle />
    </header>
  );
};
