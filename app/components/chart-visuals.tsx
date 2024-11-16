import { format } from "date-fns";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { WorkoutExercisesExpanded } from "~/lib/custom-types";

import { Paragraph } from "./ui/text";

const chartConfig = {
  reps: {
    label: "Reps",
    color: "hsl(var(--chart-1))",
  },
  dots: {
    label: "Dots",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function RepsPerMuscle({
  workoutExercises,
}: {
  workoutExercises: WorkoutExercisesExpanded[];
}) {
  const muscleGroupReps = workoutExercises.reduce(
    (groups, item) => {
      const muscleGroup = item.expand?.exercise_id.muscle_group || "Unknown";
      const reps = item.sets?.reduce((sum, set) => sum + set.reps, 0) ?? 0;
      groups[muscleGroup] = (groups[muscleGroup] || 0) + reps;
      return groups;
    },
    {} as { [key: string]: number }
  );

  const repsPerMuscleData = Object.entries(muscleGroupReps).map(([group, reps]) => ({
    group,
    reps,
  }));

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Grid Circle</CardTitle>
        <CardDescription>Showing total of sets and reps per muscle group.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-[1.3]">
          <RadarChart data={repsPerMuscleData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarAngleAxis dataKey="group" />
            <PolarGrid gridType="circle" />
            <Radar
              dataKey="reps"
              fill="var(--color-reps)"
              fillOpacity={0.5}
              dot={{ r: 2, fillOpacity: 1, fill: "var(--color-dots)" }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Paragraph variant="label" className="mt-4 text-sm">
          The closer this chart is to a circle, the more balanced your workout routine is. See for
          yourself
        </Paragraph>
      </CardFooter>
    </Card>
  );
}

export function MostRecurringWorkout({
  workoutExercises,
}: {
  workoutExercises: WorkoutExercisesExpanded[];
}) {
  const exercisesReps = workoutExercises.reduce(
    (groups, item) => {
      const muscleGroup = item.expand?.exercise_id.name || "Unknown";
      const reps = item.sets?.reduce((sum, set) => sum + set.reps, 0) ?? 0;
      groups[muscleGroup] = (groups[muscleGroup] || 0) + reps;
      return groups;
    },
    {} as { [key: string]: number }
  );

  const highestExercise = Object.entries(exercisesReps).reduce(
    (prev, [group, reps]) => (reps > prev.reps ? { group, reps } : prev),
    { group: Object.keys(exercisesReps)[0], reps: Object.values(exercisesReps)[0] }
  );

  // Aggregate weight progression
  const weightProgression = workoutExercises.map((item) => ({
    date: item.expand?.workout_id.date,
    exercise: item.expand?.exercise_id.name,
    volume: item.sets?.reduce((sum, set) => sum + set.weight * set.reps, 0) ?? 0,
  }));

  const benchPressChartData = weightProgression
    .filter((p) => p.exercise === highestExercise.group)
    // @ts-expect-error
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    // @ts-expect-error
    .map((p) => ({ date: format(p.date, "yyyy-MM-dd"), volume: p.volume }));

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={benchPressChartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="volume"
              type="natural"
              stroke="var(--color-reps)"
              strokeWidth={2}
              dot={{ fill: "var(--color-dots)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </ChartContainer>
    </div>
  );
}
