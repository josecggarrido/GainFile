import { Exercise } from '../exercises/types';

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface RoutineWithCount extends Routine {
  exerciseCount: number;
}

export interface RoutineExercise {
  id: string;
  routineId: string;
  exercise: Exercise;
  orderIndex: number;
}

export interface RoutineDetail extends Routine {
  exercises: RoutineExercise[];
}
