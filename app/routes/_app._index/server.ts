import { LoaderFunctionArgs } from "@remix-run/node";

import { loadAPI, requireAuth } from "~/lib/api";
import { WorkoutExercisesExpanded } from "~/lib/custom-types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const api = await loadAPI(request);
  const userData = await requireAuth(api);

  const [workouts, exercises, workoutExercises] = await Promise.all([
    api.collection("workouts").getFullList({
      sort: "-date",
      filter: `user_id="${userData.id}"`,
    }),
    api.collection("exercises").getFullList(),
    api.collection("workout_exercises").getFullList<WorkoutExercisesExpanded>({
      expand: "exercise_id,workout_id",
      sort: "+created",
      filter: `user_id="${userData.id}"`,
    }),
  ]);

  return { workouts, exercises, workoutExercises };
};
