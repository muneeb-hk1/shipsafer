"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FolderGit2, GitPullRequest, Globe2, LockKeyhole } from "lucide-react";
import Repositories, { type Repository } from "./Repositories";

type PullRequest = {
  id: number;
  number: number;
  title: string;
  head: { ref: string };
  base: { ref: string };
};

export default function Hero() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [pullsLoading, setPullsLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  const [pullsError, setPullsError] = useState(false);
  const [reposError, setReposError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load<T>(url: string, setData: (data: T[]) => void, setError: (error: boolean) => void, setLoading: (loading: boolean) => void) {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) throw new Error("Unable to load GitHub data");
        setData(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load<PullRequest>("/api/github/pulls", setPrs, setPullsError, setPullsLoading);
    void load<Repository>("/api/github/repositories", setRepos, setReposError, setReposLoading);
    return () => controller.abort();
  }, []);

  const metrics = [
    { label: "Connected Repositories", value: repos.length, icon: FolderGit2, loading: reposLoading, error: reposError, note: "Your GitHub projects" },
    { label: "Open Pull Requests", value: prs.length, icon: GitPullRequest, loading: pullsLoading, error: pullsError, note: "Awaiting review" },
    { label: "Public Repositories", value: repos.filter((repo) => !repo.private).length, icon: Globe2, loading: reposLoading, error: reposError, note: "Public visibility" },
    { label: "Private Repositories", value: repos.filter((repo) => repo.private).length, icon: LockKeyhole, loading: reposLoading, error: reposError, note: "Restricted access" },
  ];

  return (
    <div className="flex flex-col gap-[18px] px-5 pt-6 pb-5 min-[1500px]:gap-[22px] min-[1500px]:p-[30px] max-[768px]:px-[18px] max-[768px]:pt-[22px] max-[768px]:pb-6 max-[541px]:gap-4 max-[541px]:px-3 max-[541px]:py-5">
      <div className="pb-0.5 max-[541px]:px-[3px] [&_h1]:m-0 [&_h1]:text-[23px] [&_h1]:leading-[1.35] [&_h1]:font-[550] [&_h1]:tracking-[-0.8px] max-[768px]:[&_h1]:text-[22px] max-[541px]:[&_h1]:text-[21px] [&_p]:mt-[5px] [&_p]:mb-0 [&_p]:text-xs [&_p]:leading-[1.6] [&_p]:text-[#817b89] max-[541px]:[&_p]:text-[11px]">
        <h1>Repository Overview</h1>
        <p>Your connected projects and pull requests, all in one place.</p>
      </div>
      <div className="grid grid-cols-4 gap-3 max-[1151px]:grid-cols-2 max-[541px]:gap-[9px]">
        {metrics.map(({ label, value, icon: Icon, loading, error, note }) => (
          <section key={label} className="min-w-0 rounded-[18px] border border-[#eeebf3] bg-[#fdfcfe] px-[11px] pt-[13px] pb-2.5 shadow-[0_3px_7px_#30254702] max-[541px]:rounded-[14px] max-[541px]:px-2 max-[541px]:pt-2.5 max-[541px]:pb-2" aria-label={label} aria-busy={loading}>
            <div className="mb-[9px] flex min-h-[23px] items-center gap-1.5 text-[11px] leading-normal text-[#38313f] max-[541px]:gap-1 max-[541px]:text-[10px]"><span className="grid size-[22px] shrink-0 place-items-center rounded-[7px] bg-white shadow-[0_2px_5px_#31264405]"><Icon size={15} strokeWidth={1.6} /></span>{label}</div>
            <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-1.5 rounded-[11px] bg-[#f6f5f9] p-[9px] max-[541px]:gap-1 max-[541px]:p-2 [&_strong]:text-[23px] [&_strong]:leading-[1.2] [&_strong]:font-medium [&_strong]:tracking-[-1px] max-[541px]:[&_strong]:text-[21px] [&>span]:text-[9px] [&>span]:leading-[1.4] [&>span]:text-[#8b8494] max-[1151px]:[&>span]:text-[10px] max-[541px]:[&>span]:text-[8px]"><strong>{loading || error ? "—" : value.toLocaleString()}</strong><span>{loading ? "Loading…" : error ? "Unavailable" : note}</span></div>
          </section>
        ))}
      </div>
      <Repositories repos={repos} loading={reposLoading} error={reposError} />
      <section className="min-w-0 rounded-[20px] border border-[#eeebf3] bg-[#fdfcfe] p-[18px] shadow-[0_3px_10px_#30254702] max-[541px]:rounded-[17px] max-[541px]:p-3.5" aria-busy={pullsLoading}>
        <div className="mb-4 flex min-h-7 items-center justify-between gap-3 max-[541px]:gap-2 [&_h2]:m-0 [&_h2]:text-[17px] [&_h2]:font-medium [&_h2]:tracking-[-0.4px] max-[541px]:[&_h2]:text-[15px]"><h2>Open Pull Requests</h2><span className="rounded-[7px] border border-[#f0edf5] bg-[#f8f7fb] px-[9px] py-1.5 text-[10px] text-[#81798d] max-[541px]:px-1.5 max-[541px]:py-[5px] max-[541px]:text-[8px]">Pull requests</span></div>
        {pullsLoading ? <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]" role="status">Loading pull requests…</div> : pullsError ? (
          <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]" role="status"><GitPullRequest size={25} /><h3>Pull requests are unavailable</h3><p>We couldn’t load your GitHub pull requests. Please try again later.</p></div>
        ) : prs.length === 0 ? (
          <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]"><GitPullRequest size={25} /><h3>No open pull requests</h3><p>Open pull requests will appear here.</p></div>
        ) : (
          <div className="flex flex-col gap-[9px]">{prs.map((pr) => (
            <article key={pr.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#eeebf3] p-3.5 max-[541px]:items-start max-[541px]:gap-2 max-[541px]:p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f4f0fd] text-[#8864ce] max-[541px]:h-7 max-[541px]:w-[25px]"><GitPullRequest size={18} /></span>
              <div className="min-w-0 flex-1 [&_h3]:m-0 [&_h3]:text-xs [&_h3]:leading-[1.6] [&_h3]:font-medium [&_h3]:[overflow-wrap:anywhere] [&_h3>span]:mr-1 [&_h3>span]:font-normal [&_h3>span]:text-[#a39aaa] [&_p]:mt-[5px] [&_p]:mb-0 [&_p]:flex [&_p]:flex-wrap [&_p]:items-center [&_p]:gap-1.5 [&_p]:text-[10px] [&_p]:text-[#978ba3] [&_p>span]:[overflow-wrap:anywhere]"><h3><span>#{pr.number}</span> {pr.title}</h3><p><span>{pr.head.ref}</span><ArrowRight size={13} /><span>{pr.base.ref}</span></p></div>
              <span className="inline-flex shrink-0 items-center gap-[5px] rounded-md px-2 py-[5px] text-[10px] leading-[1.3] font-normal [&>span]:size-1 [&>span]:shrink-0 [&>span]:rounded-full [&>span]:bg-current bg-[#eff8f2] text-[#32965d] max-[541px]:px-1.5 max-[541px]:py-1 max-[541px]:text-[9px]"><span />Open</span>
            </article>
          ))}</div>
        )}
      </section>
    </div>
  );
}
