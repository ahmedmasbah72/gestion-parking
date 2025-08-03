
import React from 'react';
import { CarFront, CircleParking } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingSpotProps {
  number: number;
  occupied: boolean;
  licensePlate?: string;
  onClick?: () => void;
  animationDelay?: string;
}

export const ParkingSpot: React.FC<ParkingSpotProps> = ({
  number,
  occupied,
  licensePlate,
  onClick,
  animationDelay = 'animate-delay-0'
}) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 animate-scale-in cursor-pointer transform hover:scale-105",
        animationDelay,
        occupied 
          ? "bg-destructive/10 dark:bg-destructive/20 border border-destructive/30" 
          : "glass-card bg-success/10 dark:bg-success/20 border border-success/30"
      )}
      onClick={onClick}
    >
      <div className="absolute top-2 left-2 text-sm font-medium">
        {number}
      </div>
      <div className="flex items-center justify-center h-16 w-16">
        {occupied ? (
          <div className="flex flex-col items-center">
            <CarFront className="h-10 w-10 text-destructive" />
            {licensePlate && (
              <div className="text-xs font-mono mt-1 bg-background/80 px-1 rounded">
                {licensePlate}
              </div>
            )}
          </div>
        ) : (
          <CircleParking className={cn(
            "h-10 w-10 text-success animate-pulse-light",
          )} />
        )}
      </div>
    </div>
  );
};
