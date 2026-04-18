import { create } from 'zustand';
import { Exercise } from '../../exercises/types';

export interface ActiveSet {
  setNumber: number;
  reps: string;
  weightKg: string;
  rpe: string;
  completed: boolean;
}

export interface ActiveExercise {
  exercise: Exercise;
  sets: ActiveSet[];
}

export interface ActiveWorkout {
  id: string;
  routineId?: string;
  startedAt: string;
  exercises: ActiveExercise[];
}

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (workoutId: string, routineId?: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof Omit<ActiveSet, 'setNumber' | 'completed'>,
    value: string
  ) => void;
  toggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  clearWorkout: () => void;
}

const makeEmptySet = (setNumber: number, previous?: ActiveSet): ActiveSet => ({
  setNumber,
  reps: previous?.reps ?? '',
  weightKg: previous?.weightKg ?? '',
  rpe: '',
  completed: false,
});

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  activeWorkout: null,

  startWorkout: (workoutId, routineId) =>
    set({
      activeWorkout: {
        id: workoutId,
        routineId,
        startedAt: new Date().toISOString(),
        exercises: [],
      },
    }),

  addExercise: (exercise) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [
            ...state.activeWorkout.exercises,
            { exercise, sets: [makeEmptySet(1)] },
          ],
        },
      };
    }),

  removeExercise: (exerciseIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.filter((_, i) => i !== exerciseIndex),
        },
      };
    }),

  addSet: (exerciseIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const exercises = [...state.activeWorkout.exercises];
      const ex = exercises[exerciseIndex];
      if (!ex) return state;
      const previous = ex.sets[ex.sets.length - 1];
      exercises[exerciseIndex] = {
        ...ex,
        sets: [...ex.sets, makeEmptySet(ex.sets.length + 1, previous)],
      };
      return { activeWorkout: { ...state.activeWorkout, exercises } };
    }),

  removeSet: (exerciseIndex, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const exercises = [...state.activeWorkout.exercises];
      const ex = exercises[exerciseIndex];
      if (!ex) return state;
      const sets = ex.sets
        .filter((_, i) => i !== setIndex)
        .map((s, i) => ({ ...s, setNumber: i + 1 }));
      exercises[exerciseIndex] = { ...ex, sets };
      return { activeWorkout: { ...state.activeWorkout, exercises } };
    }),

  updateSet: (exerciseIndex, setIndex, field, value) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const exercises = [...state.activeWorkout.exercises];
      const ex = exercises[exerciseIndex];
      if (!ex) return state;
      const sets = [...ex.sets];
      const s = sets[setIndex];
      if (!s) return state;
      sets[setIndex] = { ...s, [field]: value };
      exercises[exerciseIndex] = { ...ex, sets };
      return { activeWorkout: { ...state.activeWorkout, exercises } };
    }),

  toggleSetComplete: (exerciseIndex, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const exercises = [...state.activeWorkout.exercises];
      const ex = exercises[exerciseIndex];
      if (!ex) return state;
      const sets = [...ex.sets];
      const s = sets[setIndex];
      if (!s) return state;
      sets[setIndex] = { ...s, completed: !s.completed };
      exercises[exerciseIndex] = { ...ex, sets };
      return { activeWorkout: { ...state.activeWorkout, exercises } };
    }),

  clearWorkout: () => set({ activeWorkout: null }),
}));
