import { redirect, json } from "@remix-run/node";
import { json as wJson, redirect as wRedirect } from "@remix-run/router";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";

// `_app.flights.[$id].jsx` -- -> `/flights/:id`

export function loader() {
  return json({
    flights: [
      {
        date: "2023-07-01T23:30:00",
        arrival: "EZE",
        departure: "ARN",
        flightId: 1,
        flightNumber: "SK0000",
      },
      {
        date: "2023-07-06T07:35:00",
        arrival: "ARN",
        departure: "EZE",
        flightId: 2,
        flightNumber: "SK0001",
      },
    ],
  });
}

export const workerAction = async ({ request }) => {
  const r = request.clone();
  const formData = await r.formData();
  console.log(Object.fromEntries(formData.entries()), "client form data");

  return fetch(request.clone());
};

export const workerLoader = async () => {
  // can't use same `json` here because is only for node
  return wJson({
    flights: [
      {
        date: "2023-10-01T11:30:00",
        arrival: "BRC",
        departure: "ARN",
        flightId: 3,
        flightNumber: "SK0020",
      },
      {
        date: "2023-10-06T19:35:00",
        arrival: "ARN",
        departure: "BRC",
        flightId: 4,
        flightNumber: "SK0021",
      },
    ],
  });
};

export async function action({ request }) {
  const formData = await request.formData();
  const flight = formData.get("flightId");

  console.log(flight, "here is the flight id");

  return redirect("/server-redirect");
}

export default function FlightsRoute() {
  const { flights } = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";

  console.log(flights, "flights");

  return (
    <div>
      <h1>Flights</h1>

      <section>
        <Form method="post">
          <fieldset disabled={loading}>
            {flights.map((flight) => (
              <div key={flight.flightId}>
                <label>
                  <input type="radio" name="flightId" value={flight.flightId} />
                  {flight.flightNumber}
                </label>
              </div>
            ))}
          </fieldset>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </Form>
      </section>
    </div>
  );
}
