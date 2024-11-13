import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import type { MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { Heading, Paragraph } from "~/components/ui/text";
import { api } from "~/lib/api";
import { ExercisesResponse, WorkoutExercisesResponse } from "~/lib/types";
import { formatDate } from "~/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Workout Tracker" }];
};

export const clientLoader = async ({}: ClientLoaderFunctionArgs) => {
  const [workouts, exercises, workoutExercises] = await Promise.all([
    api.collection("workouts").getFullList({ sort: "-date" }),
    api.collection("exercises").getFullList(),
    api
      .collection("workout_exercises")
      .getFullList<WorkoutExercisesResponse<ExerciseRep[], { exercise_id: ExercisesResponse }>>({
        sort: "-created",
        expand: "exercise_id",
      }),
  ]);

  return { workouts, exercises, workoutExercises };
};

export default function Index() {
  const { workouts, workoutExercises } = useLoaderData<typeof clientLoader>();

  // workoutExercises.reduce((prev, curr) => {
  //   return prev;
  // }, {});

  return (
    <div className="space-y-6 container my-12">
      <Heading>Workout Tracker</Heading>

      <div className="flex flex-col gap-3">
        {workouts.map((workout) => (
          <Collapsible>
            <div className="flex items-center justify-between gap-4">
              <Heading variant="h4">{formatDate(workout.date)}</Heading>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              {workoutExercises
                .filter((e) => e.workout_id === workout.id)
                .map((exercise) => (
                  <WorkoutExercise key={exercise.id} exercise={exercise} />
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

type ExerciseRep = { weight: number; reps: number };
function WorkoutExercise({
  exercise,
}: {
  exercise: WorkoutExercisesResponse<ExerciseRep[], { exercise_id: ExercisesResponse }>;
}) {
  const exerciseInfo = exercise.expand?.exercise_id!;
  const exerciseReps = exercise.reps;

  return (
    <>
      <div>
        <Heading variant="h4">{exerciseInfo.name}</Heading>
        {exerciseReps?.map((rep, idx) => (
          <div key={idx} className="flex gap-4">
            <Paragraph>Weight: {rep.weight}</Paragraph>
            <Paragraph>Reps: {rep.reps}</Paragraph>
          </div>
        ))}
      </div>
    </>
  );
}
