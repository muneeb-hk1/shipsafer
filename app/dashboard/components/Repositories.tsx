"use client";

import { useEffect, useState } from "react";

type Repository = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  url: string;
  owner: string;
};

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRepositories() {
      try {
        const res = await fetch("/api/github/repositories");
        const data = await res.json();

        if (Array.isArray(data)) {
          setRepos(data);
        }
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      } finally {
        setLoading(false);
      }
    }

    getRepositories();
  }, []);

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold">
        Connected Repositories
      </h2>

      <div className="mt-4 space-y-3">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="rounded-lg border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {repo.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {repo.fullName}
                </p>
              </div>

              <span className="text-sm">
                {repo.private ? "Private" : "Public"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}