
import React, { useState } from 'react';
import { 
  Vehicle, 
  ParkingState, 
  formatDateTime, 
  exitVehicle, 
  saveParkingState,
  formatCurrency,
  formatDuration
} from '@/utils/parkingUtils';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Car, CircleParking } from 'lucide-react';

interface VehicleListProps {
  parkingState: ParkingState;
  setParkingState: React.Dispatch<React.SetStateAction<ParkingState>>;
}

export const VehicleList: React.FC<VehicleListProps> = ({ parkingState, setParkingState }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showHistory, setShowHistory] = useState(false);

  const currentVehicles = parkingState.vehicles.filter(v => !v.exitTime);
  const historyVehicles = parkingState.vehicles.filter(v => v.exitTime);

  const handleExit = (vehicleId: string) => {
    const result = exitVehicle(vehicleId, parkingState.vehicles, parkingState.hourlyRate);
    
    if (result.success && result.vehicle) {
      // Update state with the updated vehicle
      const updatedVehicles = parkingState.vehicles.map(v => 
        v.id === vehicleId ? result.vehicle! : v
      );
      
      const updatedState = { ...parkingState, vehicles: updatedVehicles };
      
      setParkingState(updatedState);
      saveParkingState(updatedState);
      
      toast.success(
        <div>
          <p className="font-medium">Véhicule sorti</p>
          <p className="text-sm">{result.vehicle.licensePlate}</p>
          <p className="text-sm">Durée: {formatDuration(result.duration!)}</p>
          <p className="text-sm">Montant: {formatCurrency(result.fee!)}</p>
        </div>
      );
    } else {
      toast.error(result.message || "Erreur lors de la sortie du véhicule");
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortVehicles = (vehicles: Vehicle[]) => {
    return [...vehicles].sort((a, b) => {
      const timeA = a.entryTime.getTime();
      const timeB = b.entryTime.getTime();
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
  };

  const sortedCurrentVehicles = sortVehicles(currentVehicles);
  const sortedHistoryVehicles = sortVehicles(historyVehicles);

  return (
    <div className="glass-card rounded-lg p-6 animate-slide-up animate-delay-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <CircleParking className="mr-2 h-5 w-5 text-primary" />
          Véhicules dans le parking
        </span>
        <button 
          onClick={toggleSortDirection}
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
          aria-label="Changer l'ordre de tri"
          title="Changer l'ordre de tri"
        >
          {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </h2>
      
      {sortedCurrentVehicles.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Aucun véhicule dans le parking</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">Place</th>
                <th className="pb-2 font-medium">Immatriculation</th>
                <th className="pb-2 font-medium">Entrée</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sortedCurrentVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-muted hover:bg-muted/50 transition-colors">
                  <td className="py-3">{vehicle.spot}</td>
                  <td className="py-3 font-mono">{vehicle.licensePlate}</td>
                  <td className="py-3">{formatDateTime(vehicle.entryTime)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleExit(vehicle.id)}
                      className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                    >
                      Sortie
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {historyVehicles.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showHistory ? (
              <>Masquer l'historique ({historyVehicles.length})</>
            ) : (
              <>Afficher l'historique ({historyVehicles.length})</>
            )}
            <span className="ml-1">
              {showHistory ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </span>
          </button>
          
          {showHistory && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-2 font-medium">Place</th>
                    <th className="pb-2 font-medium">Immatriculation</th>
                    <th className="pb-2 font-medium">Entrée</th>
                    <th className="pb-2 font-medium">Sortie</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-muted-foreground">
                  {sortedHistoryVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-muted hover:bg-muted/50 transition-colors">
                      <td className="py-2">{vehicle.spot}</td>
                      <td className="py-2 font-mono">{vehicle.licensePlate}</td>
                      <td className="py-2">{formatDateTime(vehicle.entryTime)}</td>
                      <td className="py-2">{vehicle.exitTime ? formatDateTime(vehicle.exitTime) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
