import { redirect, json } from '@remix-run/node';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';

// `_app.flights.[$id].jsx` -- -> `/flights/:id`

export function loader() {
  return json({
    flights: [
      {
        date: '2023-07-01T23:30:00',
        arrival: 'EZE',
        departure: 'ARN',
        flightId: 1,
        flightNumber: 'SK0000',
      },
      {
        date: '2023-07-06T07:35:00',
        arrival: 'ARN',
        departure: 'EZE',
        flightId: 2,
        flightNumber: 'SK0001',
      },
    ],
  });
}

export const workerAction = async ({ request }) => {
  console.log('hola')
}

export const workerLoader = async ({ request }) => {
  console.log('hola')
}

export async function action({ request }) {
  const formData = await request.formData();
  const flight = formData.get('flightId');

  console.log(flight, 'here is the flight id');

  return redirect('/');
}

export default function FlightsRoute() {
  const { flights } = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state !== 'idle';

  return (
    <div>
      <h1>Flights</h1>

      <section>
        <Form method="post">
          <fieldset disabled={loading}>
            {flights.map(flight => (
              <div key={flight.flightId}>
                <label>
                  <input type="radio" name="flightId" value={flight.flightId} />
                  {flight.flightNumber}
                </label>
              </div>
            ))}
          </fieldset>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </Form>
      </section>
    </div>
  );
}
