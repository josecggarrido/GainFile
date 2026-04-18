export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio' | 'other';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'other';

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group: MuscleGroup;
          equipment: Equipment;
          is_custom: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          muscle_group: MuscleGroup;
          equipment: Equipment;
          is_custom?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          muscle_group?: MuscleGroup;
          equipment?: Equipment;
          is_custom?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      routine_exercises: {
        Row: {
          id: string;
          routine_id: string;
          exercise_id: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          routine_id: string;
          exercise_id: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          routine_id?: string;
          exercise_id?: string;
          order_index?: number;
        };
        Relationships: [];
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          routine_id: string | null;
          started_at: string;
          finished_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          routine_id?: string | null;
          started_at?: string;
          finished_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          routine_id?: string | null;
          started_at?: string;
          finished_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      sets: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          set_number: number;
          reps: number | null;
          weight_kg: number | null;
          rpe: number | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          set_number: number;
          reps?: number | null;
          weight_kg?: number | null;
          rpe?: number | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          set_number?: number;
          reps?: number | null;
          weight_kg?: number | null;
          rpe?: number | null;
          completed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      muscle_group: MuscleGroup;
      equipment: Equipment;
    };
  };
}
