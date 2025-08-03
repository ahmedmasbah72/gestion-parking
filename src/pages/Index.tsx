
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { VehicleForm } from '@/components/VehicleForm';
import { VehicleList } from '@/components/VehicleList';
import { ParkingState, loadParkingState, TOTAL_SPOTS, HOURLY_RATE } from '@/utils/parkingUtils';
import { Toaster } from 'sonner';

const Index = () => {
  const [parkingState, setParkingState] = useState<ParkingState>({
    totalSpots: TOTAL_SPOTS,
    vehicles: [],
    hourlyRate: HOURLY_RATE
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedState = loadParkingState();
      setParkingState(savedState);
    } catch (error) {
      console.error('Failed to load parking state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <Header />
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <VehicleForm parkingState={parkingState} setParkingState={setParkingState} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Dashboard parkingState={parkingState} />
          <VehicleList parkingState={parkingState} setParkingState={setParkingState} />
        </div>
      </main>
    </div>
  );
};

export default Index;
