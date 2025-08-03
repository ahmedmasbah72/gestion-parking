
import React from 'react';
import { ParkingState } from '@/utils/parkingUtils';
import { ParkingSpot } from './ParkingSpot';

interface DashboardProps {
  parkingState: ParkingState;
}

export const Dashboard: React.FC<DashboardProps> = ({ parkingState }) => {
  const { totalSpots, vehicles } = parkingState;
  const currentVehicles = vehicles.filter(v => !v.exitTime);
  
  // Create an array of spots with their status
  const spots = Array.from({ length: totalSpots }, (_, i) => {
    const spotNumber = i + 1;
    const vehicle = currentVehicles.find(v => v.spot === spotNumber);
    
    return {
      number: spotNumber,
      occupied: !!vehicle,
      licensePlate: vehicle?.licensePlate,
    };
  });
  
  // Calculate available and occupied counts
  const occupiedCount = currentVehicles.length;
  const availableCount = totalSpots - occupiedCount;
  const occupancyRate = (occupiedCount / totalSpots) * 100;
  
  return (
    <div className="glass-card rounded-lg p-6 animate-slide-up animate-delay-200">
      <h2 className="text-xl font-semibold mb-4">État du parking</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Places disponibles</h3>
          <p className="text-2xl font-bold text-success">{availableCount}</p>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Places occupées</h3>
          <p className="text-2xl font-bold text-destructive">{occupiedCount}</p>
        </div>
      </div>
      
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-700 ease-in-out"
          style={{ width: `${occupancyRate}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {spots.map((spot, index) => (
          <ParkingSpot
            key={spot.number}
            number={spot.number}
            occupied={spot.occupied}
            licensePlate={spot.licensePlate}
            animationDelay={`animate-delay-${(index % 5) * 100}`}
          />
        ))}
      </div>
    </div>
  );
};
