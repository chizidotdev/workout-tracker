import { createContext, useContext } from "react";

import { ExercisesResponse, WorkoutsResponse } from "~/lib/types";

type WorkoutsContextType = {
  workouts: WorkoutsResponse[];
  exercises: ExercisesResponse[];
};
export const WorkoutsContext = createContext({} as WorkoutsContextType);

export function useWorkouts() {
  const context = useContext(WorkoutsContext);

  if (!context) {
    throw Error("useWorkouts must be used within a WorkoutsContext Provider");
  }

  return context;
}
