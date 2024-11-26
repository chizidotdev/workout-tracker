import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { loadAPI, requireAuth } from "~/lib/api";

export const action = async ({ request }: ActionFunctionArgs) => {
  const api = await loadAPI(request);
  const userData = await requireAuth(api);

  const formData = await request.formData();
  const date = formData.get("date")!.toString();
  const notes = formData.get("notes")!.toString();

  if (!date) {
    return { error: "Date is required" };
  }

  try {
    const workout = await api.collection("workouts").create({
      user_id: userData.id,
      date: new Date(date),
      notes,
    });

    return redirect(`/workout/${workout.id}`);
  } catch (e) {
    console.log(e);
    return { error: e };
  }
};
