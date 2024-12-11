import { useFetcher, useNavigate } from "@remix-run/react";

import { ChevronLeft } from "lucide-react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import { Button } from "~/components/ui/button";
import { Paragraph } from "~/components/ui/text";

import { SelectExercise } from "./select-exercise";
import { action, loader } from "./server";
import { WorkoutExercise } from "./workout-exercise";

export { action, loader };
export const clientLoader = cacheClientLoader;
clientLoader.hydrate = true;

export default function WorkoutDetails() {
  const navigate = useNavigate();
  const { workout, workoutExercises } = useCachedLoaderData<typeof loader>();

  return (
    <div className="space-y-6 pt-20">
      <hgroup className="header flex items-center justify-between gap-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ChevronLeft size={20} />
          <Paragraph>Back</Paragraph>
        </button>

        <CompleteWorkout />
        {/* <Paragraph className="capitalize" variant="label">
          {format(workout.date, "eeee - MMM dd, yyy")}
        </Paragraph> */}
      </hgroup>

      <div className="space-y-4">
        {workoutExercises.map((exercise) => (
          <WorkoutExercise key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <SelectExercise key={workoutExercises.length} workout={workout} />
      </div>
    </div>
  );
}

function CompleteWorkout() {
  const { workout } = useCachedLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  function onSubmit() {
    fetcher.submit({ workout_id: workout.id }, { method: "PATCH" });
  }

  return (
    <Button isLoading={fetcher.state !== "idle"} onClick={onSubmit} variant="secondary">
      Finish
    </Button>
  );
}
