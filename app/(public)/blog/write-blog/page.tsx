"use client";
import { Suspense } from "react";

const markdown = `
first content

***

second content
`.trim();

export default function Home() {
  return (
    <section className="min-h-dvh">
      <p>
        This is a bare-bones unstyled MDX editor without any plugins and no
        toolbar. Check the EditorComponent.tsx file for the code.
      </p>
      <p>
        To enable more features, add the respective plugins to your instance -
        see{" "}
        <a
          className="text-blue-600"
          href="https://mdxeditor.dev/editor/docs/getting-started"
        >
          the docs
        </a>{" "}
        for more details.
      </p>
      <button className="btn btn-primary">something</button>
      <button className="btn">something</button>
      <br />
      <div style={{ border: "1px solid black" }}>
        <Suspense fallback={null}>
          <div></div>
        </Suspense>
      </div>
    </section>
  );
}
