"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [prs, setPrs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/github/pulls")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPrs(data);
        } else {
          console.error("PR API error:", data);
          setPrs([]);
        }
      });
  }, []);

  return (
    <>
      <section>
        <div className="p-2">
          <h1>Open Pull Requests</h1>

          {prs.map((pr) => (
            <div key={pr.id}>
              <h3>
                #{pr.number} {pr.title}
              </h3>

              <p>
                {pr.head.ref} → {pr.base.ref}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}