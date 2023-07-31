import { json } from "@remix-run/node";

export function loader() {
  return json({
    test: true
  });
}

export default function Page() {
  const { test } = useLoaderData();
  return (
    <article>
      <h1>Test</h1>
      <p>{test}</p>
    </article>
  )
}
