import { MuscleGroup, Equipment } from '../../types/database';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  isCustom: boolean;
  createdBy: string | null;
  createdAt: string;
}

export function rowToExercise(row: {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  equipment: Equipment;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
}): Exercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
    equipment: row.equipment,
    isCustom: row.is_custom,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
