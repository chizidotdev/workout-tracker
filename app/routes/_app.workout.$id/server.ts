import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";

import { loadAPI, parseError, requireAuth } from "~/lib/api";
import { ExerciseSet } from "~/lib/custom-types";
import { ExercisesResponse, WorkoutExercisesResponse } from "~/lib/types";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.id) return redirect("/");

  const api = await loadAPI(request);

  const workout = await api.collection("workouts").getOne(params.id);
  const [workoutExercises, exercises] = await Promise.all([
    api
      .collection("workout_exercises")
      .getFullList<WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>>({
        filter: `workout_id="${workout.id}"`,
        sort: "+created",
        expand: "exercise_id",
      }),
    api.collection("exercises").getFullList(),
  ]);

  return { workout, workoutExercises, exercises };
};

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "POST":
      return await createExercise(args);
    case "PUT":
      return await updateExercises(args);
    case "PATCH":
      return await completeWorkout(args);
  }
};

const completeWorkout = async ({ request }: ActionFunctionArgs) => {
  const api = await loadAPI(request);

  const formData = await request.formData();
  const workout_id = formData.get("workout_id")!.toString();

  try {
    await api.collection("workouts").update(workout_id, { status: "completed" });
    return redirect("/logs");
  } catch (error) {
    return { error: parseError(error) };
  }

  return {};
};

const updateExercises = async ({ request }: ActionFunctionArgs) => {
  const api = await loadAPI(request);

  const formData = await request.formData();
  const exercise_id = formData.get("exercise_id")!.toString();
  const sets = formData.get("sets")?.toString();

  try {
    await api.collection("workout_exercises").update(exercise_id, { sets });
  } catch (error) {
    return { error: parseError(error) };
  }

  return {};
};

const createExercise = async ({ request, params }: ActionFunctionArgs) => {
  if (!params.id) return redirect("/");

  const api = await loadAPI(request);
  const userData = await requireAuth(api);

  const formData = await request.formData();
  const exercise_id = formData.get("exercise_id")!.toString();

  try {
    await api.collection("workout_exercises").create({
      user_id: userData.id,
      sets: [{ reps: 10, weight: 10 }],
      workout_id: params.id,
      exercise_id,
    });
  } catch (error) {
    return { error: parseError(error) };
  }

  return {};
};
