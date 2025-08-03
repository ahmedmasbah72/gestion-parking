
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ParkingState, Vehicle, parkVehicle, saveParkingState } from '@/utils/parkingUtils';
import { Car } from 'lucide-react';

interface VehicleFormProps {
  parkingState: ParkingState;
  setParkingState: React.Dispatch<React.SetStateAction<ParkingState>>;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ parkingState, setParkingState }) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = parkVehicle(licensePlate, parkingState.vehicles, parkingState.totalSpots);

      if (result.success && result.vehicle) {
        // Update state with new vehicle
        const updatedVehicles = [...parkingState.vehicles, result.vehicle];
        const updatedState = { ...parkingState, vehicles: updatedVehicles };

        setParkingState(updatedState);
        saveParkingState(updatedState);
        setLicensePlate('');
        
        toast.success(`Véhicule ${result.vehicle.licensePlate} enregistré à l'emplacement ${result.vehicle.spot}`);
      } else {
        toast.error(result.message || "Erreur lors de l'enregistrement du véhicule");
      }
    } catch (error) {
      console.error('Error parking vehicle:', error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSpots = parkingState.totalSpots - parkingState.vehicles.filter(v => !v.exitTime).length;

  return (
    <div className="glass-card rounded-lg p-6 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Car className="mr-2 h-5 w-5 text-primary" />
        Enregistrer une entrée
      </h2>
      
      <div className="bg-primary/10 text-primary rounded-md p-3 mb-4">
        <p className="text-sm font-medium">
          {availableSpots === 0 
            ? "Le parking est complet" 
            : `${availableSpots} place${availableSpots > 1 ? 's' : ''} disponible${availableSpots > 1 ? 's' : ''}`}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium mb-1">
            Plaque d'immatriculation
          </label>
          <input
            id="licensePlate"
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="AB-123-CD"
            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting || availableSpots === 0}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !licensePlate.trim() || availableSpots === 0}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 px-4 py-2 rounded-md transition-colors"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer le véhicule"}
        </button>
      </form>
    </div>
  );
};
