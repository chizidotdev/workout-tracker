import { useState } from "react";

import { Link } from "@remix-run/react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, Dumbbell, History, MoveUpRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Heading, Paragraph } from "~/components/ui/text";
import { useWorkouts } from "~/hooks/use-workouts";
import { WorkoutsResponse } from "~/lib/types";
import { cn } from "~/lib/utils";

export default function Logs() {
  const { workouts } = useWorkouts();

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const selectedDayMeetings = workouts.filter((workout) =>
    isSameDay(parseISO(workout.date), selectedDay)
  );

  return (
    <div className="pt-10">
      <div className="flex items-center">
        <h2 className="flex-auto font-semibold">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
        <Button onClick={previousMonth} variant="ghost" size="icon">
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button onClick={nextMonth} variant="ghost" size="icon">
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-7 text-center text-xs font-medium leading-6 text-muted-foreground">
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
        <div>S</div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-sm">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={cn(dayIdx === 0 && colStartClasses[getDay(day)], "relative")}
          >
            {workouts.some((meeting) => isSameDay(parseISO(meeting.date), day)) && (
              <div className="absolute inset-x-0 bottom-4 mx-auto size-1 rounded-full bg-primary" />
            )}

            <button
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                isEqual(day, selectedDay) && "",
                !isEqual(day, selectedDay) && isToday(day) && "text-primary",
                // !isEqual(day, selectedDay) &&
                //   !isToday(day) &&
                //   isSameMonth(day, firstDayCurrentMonth) &&
                //   "text-gray-900",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-muted",
                isEqual(day, selectedDay) && isToday(day) && "bg-muted text-primary",
                isEqual(day, selectedDay) && !isToday(day) && "bg-muted",
                !isEqual(day, selectedDay) && "hover:bg-muted",
                (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                "mx-auto flex size-full items-center justify-center rounded-lg pb-10 pt-2"
              )}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
            </button>
          </div>
        ))}
      </div>

      <section className="mt-4 border-t pt-6">
        <Heading variant="h4">
          <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
            {format(selectedDay, "eeee - MMMM dd, yyy")}
          </time>
        </Heading>
        <ol className="mt-4 space-y-2">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((workout) => (
              <WorkoutEntry workout={workout} key={workout.id} />
            ))
          ) : (
            <Paragraph variant="label">No workouts logged for today.</Paragraph>
          )}
        </ol>

        <Link to="/workout" className="mt-8 flex justify-center">
          <Button>
            <Dumbbell />
            New workout
          </Button>
        </Link>
      </section>
    </div>
  );
}

function WorkoutEntry({ workout }: { workout: WorkoutsResponse }) {
  const startDateTime = parseISO(workout.date);

  return (
    <Link to={`/workout/${workout.id}`} className="flex w-full items-center gap-2 py-3">
      <li className="flex w-full items-center gap-2">
        <History className="size-4 text-muted-foreground" />
        <Paragraph>Log</Paragraph> -{" "}
        <time dateTime={workout.date}>{format(startDateTime, "h:mm a")}</time>
        <MoveUpRight className="ml-auto size-4" />
      </li>
    </Link>
  );
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
