import { Link } from "@remix-run/react";
import { Dumbbell, History, MoveUpRight } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { RepsPerMuscle } from "~/components/chart-visuals";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/text";
import { Paragraph } from "~/components/ui/text";
import { useWorkouts } from "~/hooks/use-workouts";
import { api } from "~/lib/api";
import { WorkoutExercisesExpanded } from "~/lib/custom-types";
import { WorkoutsResponse } from "~/lib/types";
import { formatDate } from "~/lib/utils";

export const loader = async () => {
  const workoutExercises = await api
    .collection("workout_exercises")
    .getFullList<WorkoutExercisesExpanded>({
      sort: "+created",
      expand: "exercise_id,workout_id",
      requestKey: null,
    });

  return { workoutExercises };
};

export const clientLoader = cacheClientLoader;
(clientLoader as any).hydrate = true;

export default function Index() {
  const { workoutExercises } = useCachedLoaderData<typeof loader>();
  const { workouts } = useWorkouts();

  return (
    <>
      <div className="space-y-12 pt-14">
        <div className="header flex items-center justify-center gap-4">
          <Dumbbell />
        </div>

        <section>
          <RepsPerMuscle workoutExercises={workoutExercises} />
          {/* <MostRecurringWorkout workoutExercises={workoutExercises} /> */}
        </section>

        <div className="flex flex-col gap-2">
          <Heading className="mb-2" variant="h3">
            Recent Activity
          </Heading>

          <WorkoutsList workouts={workouts} />
        </div>
      </div>
    </>
  );
}

export function WorkoutsList({ workouts }: { workouts: WorkoutsResponse[] }) {
  if (!workouts.length) {
    <div className="my-10 space-y-4 text-center">
      <Paragraph variant="label">No workouts logged.</Paragraph>
      <Link to="/workout" className="mx-auto mt-8 w-fit">
        <Button>
          <Dumbbell />
          New workout
        </Button>
      </Link>
    </div>;
  }

  return (
    <>
      {workouts.slice(1, 6).map((workout) => (
        <Fragment key={workout.id}>
          <div className="w-full border-t" />
          <Link to={`/workout/${workout.id}`} className="flex items-center gap-2 py-3">
            <History className="size-4" />
            <Paragraph>{formatDate(workout.date)}</Paragraph>
            <MoveUpRight className="ml-auto size-4" />
          </Link>
        </Fragment>
      ))}

      <Link to="/workout" className="mx-auto mt-8 w-fit">
        <Button>
          <Dumbbell />
          New workout
        </Button>
      </Link>
    </>
  );
}
