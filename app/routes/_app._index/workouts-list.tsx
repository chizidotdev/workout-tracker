import { Link } from "@remix-run/react";

import { format, formatDistanceToNow } from "date-fns";
import { Dumbbell, History, MoveUpRight } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useCachedLoaderData } from "remix-client-cache";

import { Button } from "~/components/ui/button";
import { Heading, Paragraph } from "~/components/ui/text";
import { cn } from "~/lib/utils";

import { loader } from "./server";

export function WorkoutsList() {
  const { workouts } = useCachedLoaderData<typeof loader>();

  if (!workouts.length) {
    return (
      <div className="my-10 space-y-4 text-center">
        <Paragraph variant="label">No workouts logged.</Paragraph>
        <Link to="/workout" className="mx-auto mt-8 block w-fit">
          <Button>
            <Dumbbell />
            New workout
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Heading className="mb-4" variant="h3">
        Recent Activity
      </Heading>

      {workouts.slice(0, 5).map((workout, idx) => (
        <Fragment key={workout.id}>
          <div className={cn("w-full", idx !== 0 && "border-t")} />
          <Link to={`/workout/${workout.id}`} className="flex items-center gap-2 py-4">
            <History className="size-4 text-muted-foreground" />
            <Paragraph>
              {format(workout.date, "eee do")} -{" "}
              {formatDistanceToNow(workout.date, { addSuffix: true })}
            </Paragraph>

            <MoveUpRight className="ml-auto size-4 text-muted-foreground" />
          </Link>
        </Fragment>
      ))}

      <Link to="/workout" className="mx-auto mt-8 block w-fit">
        <Button>
          <Dumbbell />
          New workout
        </Button>
      </Link>
    </div>
  );
}
