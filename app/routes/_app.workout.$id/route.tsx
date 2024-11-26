import { Link } from "@remix-run/react";

import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import { Paragraph } from "~/components/ui/text";

import { SelectExercise } from "./select-exercise";
import { action, loader } from "./server";
import { WorkoutExercise } from "./workout-exercise";

export { action, loader };
export const clientLoader = cacheClientLoader;
clientLoader.hydrate = true;

export default function WorkoutDetails() {
  const { workout, workoutExercises } = useCachedLoaderData<typeof loader>();

  return (
    <div className="space-y-6 pt-20">
      <hgroup className="header flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2">
          <ChevronLeft size={20} />
          <Paragraph>Home</Paragraph>
        </Link>

        <Paragraph className="capitalize" variant="label">
          {format(workout.date, "eeee - MMM dd, yyy")}
        </Paragraph>
      </hgroup>

      <div className="space-y-4">
        {workoutExercises.map((exercise) => (
          <WorkoutExercise key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="flex justify-end">
        <SelectExercise key={workoutExercises.length} workout={workout} />
      </div>
    </div>
  );
}
