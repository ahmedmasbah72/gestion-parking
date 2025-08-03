
import { toast } from "sonner";

// Types
export interface Vehicle {
  id: string;
  licensePlate: string;
  entryTime: Date;
  exitTime?: Date;
  spot: number;
}

export interface ParkingState {
  totalSpots: number;
  vehicles: Vehicle[];
  hourlyRate: number;
}

// Constants
export const TOTAL_SPOTS = 20;
export const HOURLY_RATE = 2;

// Helper functions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const calculateDuration = (entryTime: Date, exitTime: Date): number => {
  const durationMs = exitTime.getTime() - entryTime.getTime();
  return Math.max(Math.ceil(durationMs / (1000 * 60 * 60)), 1); // Minimum 1 hour
};

export const calculateFee = (entryTime: Date, exitTime: Date, hourlyRate: number): number => {
  const hours = calculateDuration(entryTime, exitTime);
  return hours * hourlyRate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return "Moins d'une heure";
  } else if (hours === 1) {
    return "1 heure";
  } else {
    return `${hours} heures`;
  }
};

export const findAvailableSpot = (vehicles: Vehicle[]): number | null => {
  const occupiedSpots = vehicles.map(v => v.spot);
  for (let i = 1; i <= TOTAL_SPOTS; i++) {
    if (!occupiedSpots.includes(i)) {
      return i;
    }
  }
  return null;
};

// Local Storage functions
export const saveParkingState = (state: ParkingState): void => {
  try {
    const serializedState = JSON.stringify({
      ...state,
      vehicles: state.vehicles.map(v => ({
        ...v,
        entryTime: v.entryTime.toISOString(),
        exitTime: v.exitTime ? v.exitTime.toISOString() : undefined
      }))
    });
    localStorage.setItem('parkingState', serializedState);
  } catch (err) {
    console.error('Could not save parking state', err);
    toast.error("Erreur lors de la sauvegarde des données");
  }
};

export const loadParkingState = (): ParkingState => {
  try {
    const serializedState = localStorage.getItem('parkingState');
    if (!serializedState) {
      return {
        totalSpots: TOTAL_SPOTS,
        vehicles: [],
        hourlyRate: HOURLY_RATE
      };
    }
    const parsedState = JSON.parse(serializedState);
    return {
      ...parsedState,
      vehicles: parsedState.vehicles.map((v: any) => ({
        ...v,
        entryTime: new Date(v.entryTime),
        exitTime: v.exitTime ? new Date(v.exitTime) : undefined
      }))
    };
  } catch (err) {
    console.error('Could not load parking state', err);
    toast.error("Erreur lors du chargement des données");
    return {
      totalSpots: TOTAL_SPOTS,
      vehicles: [],
      hourlyRate: HOURLY_RATE
    };
  }
};

// Parking operations
export const parkVehicle = (
  licensePlate: string,
  vehicles: Vehicle[],
  totalSpots: number
): { success: boolean; vehicle?: Vehicle; message?: string } => {
  // Validate input
  if (!licensePlate.trim()) {
    return { success: false, message: "La plaque d'immatriculation est requise" };
  }
  
  // Check if vehicle already exists in the parking
  const existingVehicle = vehicles.find(
    v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && !v.exitTime
  );
  
  if (existingVehicle) {
    return { 
      success: false, 
      message: `Un véhicule avec la plaque ${licensePlate} est déjà présent dans le parking`
    };
  }
  
  // Check if there's an available spot
  const availableSpot = findAvailableSpot(vehicles.filter(v => !v.exitTime));
  
  if (availableSpot === null) {
    return { success: false, message: "Le parking est complet" };
  }
  
  // Create new vehicle
  const newVehicle: Vehicle = {
    id: generateId(),
    licensePlate,
    entryTime: new Date(),
    spot: availableSpot
  };
  
  return { success: true, vehicle: newVehicle };
};

export const exitVehicle = (
  vehicleId: string,
  vehicles: Vehicle[],
  hourlyRate: number
): { 
  success: boolean;
  vehicle?: Vehicle;
  fee?: number;
  duration?: number;
  message?: string 
} => {
  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId && !v.exitTime);
  
  if (vehicleIndex === -1) {
    return { success: false, message: "Véhicule non trouvé" };
  }
  
  const exitTime = new Date();
  const updatedVehicle = { ...vehicles[vehicleIndex], exitTime };
  
  const duration = calculateDuration(updatedVehicle.entryTime, exitTime);
  const fee = calculateFee(updatedVehicle.entryTime, exitTime, hourlyRate);
  
  return { 
    success: true, 
    vehicle: updatedVehicle,
    fee,
    duration
  };
};
