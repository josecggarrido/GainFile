import { MuscleGroup, Equipment } from '../types/database';

interface SeedExercise {
  name: string;
  muscle_group: MuscleGroup;
  equipment: Equipment;
}

export const PREDEFINED_EXERCISES: SeedExercise[] = [
  // Chest
  { name: 'Press de Banca', muscle_group: 'chest', equipment: 'barbell' },
  { name: 'Press de Banca Inclinado', muscle_group: 'chest', equipment: 'barbell' },
  { name: 'Flexiones', muscle_group: 'chest', equipment: 'bodyweight' },
  { name: 'Apertura con Mancuernas', muscle_group: 'chest', equipment: 'dumbbell' },
  { name: 'Cruce de Cables', muscle_group: 'chest', equipment: 'cable' },
  // Back
  { name: 'Dominadas', muscle_group: 'back', equipment: 'bodyweight' },
  { name: 'Remo con Barra', muscle_group: 'back', equipment: 'barbell' },
  { name: 'Jalón al Pecho', muscle_group: 'back', equipment: 'machine' },
  { name: 'Remo en Polea Baja', muscle_group: 'back', equipment: 'cable' },
  { name: 'Peso Muerto', muscle_group: 'back', equipment: 'barbell' },
  // Shoulders
  { name: 'Press Militar', muscle_group: 'shoulders', equipment: 'barbell' },
  { name: 'Elevaciones Laterales', muscle_group: 'shoulders', equipment: 'dumbbell' },
  { name: 'Face Pull', muscle_group: 'shoulders', equipment: 'cable' },
  { name: 'Press Arnold', muscle_group: 'shoulders', equipment: 'dumbbell' },
  // Arms
  { name: 'Curl de Bíceps con Barra', muscle_group: 'arms', equipment: 'barbell' },
  { name: 'Curl Martillo', muscle_group: 'arms', equipment: 'dumbbell' },
  { name: 'Extensión de Tríceps en Polea', muscle_group: 'arms', equipment: 'cable' },
  { name: 'Press Francés', muscle_group: 'arms', equipment: 'barbell' },
  // Legs
  { name: 'Sentadilla', muscle_group: 'legs', equipment: 'barbell' },
  { name: 'Peso Muerto Rumano', muscle_group: 'legs', equipment: 'barbell' },
  { name: 'Prensa de Piernas', muscle_group: 'legs', equipment: 'machine' },
  { name: 'Zancadas', muscle_group: 'legs', equipment: 'dumbbell' },
  { name: 'Elevación de Talones en Máquina', muscle_group: 'legs', equipment: 'machine' },
  // Core
  { name: 'Plancha', muscle_group: 'core', equipment: 'bodyweight' },
  { name: 'Crunch Abdominal', muscle_group: 'core', equipment: 'bodyweight' },
  { name: 'Giro Ruso', muscle_group: 'core', equipment: 'bodyweight' },
];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  arms: 'Brazos',
  legs: 'Piernas',
  core: 'Core',
  cardio: 'Cardio',
  other: 'Otro',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Barra',
  dumbbell: 'Mancuerna',
  machine: 'Máquina',
  cable: 'Polea',
  bodyweight: 'Peso corporal',
  other: 'Otro',
};

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: '#EF4444',
  back: '#3B82F6',
  shoulders: '#8B5CF6',
  arms: '#F97316',
  legs: '#10B981',
  core: '#F59E0B',
  cardio: '#EC4899',
  other: '#6B7280',
};
