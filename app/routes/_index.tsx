import { Link, useRouteLoaderData } from "@remix-run/react";
import { Dumbbell, History } from "lucide-react";
import { Heading, Paragraph } from "~/components/ui/text";
import { formatDate } from "~/lib/utils";
import { clientLoader } from "~/root";

export default function Index() {
  const data = useRouteLoaderData<typeof clientLoader>("root");

  if (!data) return null;

  return (
    <>
      <div className="space-y-12 pt-20">
        <div className="header flex items-center justify-center gap-4">
          <Dumbbell />
        </div>

        <div className="flex flex-col gap-4">
          <Heading variant="h4">Recent Activity</Heading>

          {data.workouts.map((workout) => (
            <Link
              key={workout.id}
              to={`/workout/${workout.id}`}
              className="flex items-center gap-2"
            >
              <History className="size-4" />
              <Paragraph>{formatDate(workout.date)}</Paragraph>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
