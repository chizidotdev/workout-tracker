import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";
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
    <div>
      <div className="flex flex-col items-center pb-4">
        <div>Radar Chart - Grid Circle</div>
        <div>Showing total of sets and reps per muscle group.</div>
      </div>
      <div className="pb-0">
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
      </div>
      <div className="flex-col gap-2 text-sm">
        <Paragraph variant="label" className="mt-4 text-sm">
          The closer this chart is to a circle, the more balanced your workout routine is. See for
          yourself
        </Paragraph>
      </div>
    </div>
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
