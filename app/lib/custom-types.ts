import { ExercisesResponse, WorkoutExercisesResponse, WorkoutsResponse } from "./types";

export type ExerciseSet = { weight: number; reps: number };
export type WorkoutExercisesExpanded = WorkoutExercisesResponse<
  ExerciseSet[],
  { exercise_id: ExercisesResponse; workout_id: WorkoutsResponse }
>;
