"use client";

import { FolderGit2, Globe2, LockKeyhole } from "lucide-react";

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  url: string;
  owner: string;
};

type RepositoriesProps = { repos: Repository[]; loading: boolean; error: boolean };

export default function Repositories({ repos, loading, error }: RepositoriesProps) {
  return (
    <section className="min-w-0 rounded-[20px] border border-[#eeebf3] bg-[#fdfcfe] p-[18px] shadow-[0_3px_10px_#30254702] max-[541px]:rounded-[17px] max-[541px]:p-3.5" aria-busy={loading}>
      <div className="mb-4 flex min-h-7 items-center justify-between gap-3 max-[541px]:gap-2 [&_h2]:m-0 [&_h2]:text-[17px] [&_h2]:font-medium [&_h2]:tracking-[-0.4px] max-[541px]:[&_h2]:text-[15px]"><h2>Connected Repositories</h2><span className="rounded-[7px] border border-[#f0edf5] bg-[#f8f7fb] px-[9px] py-1.5 text-[10px] text-[#81798d] max-[541px]:px-1.5 max-[541px]:py-[5px] max-[541px]:text-[8px]">GitHub repositories</span></div>
      {loading ? (
        <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]" role="status">Loading repositories…</div>
      ) : error ? (
        <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]" role="status"><FolderGit2 size={25} /><h3>Repositories are unavailable</h3><p>We couldn’t load your connected repositories. Please try again later.</p></div>
      ) : repos.length === 0 ? (
        <div className="flex min-h-[168px] flex-col items-center justify-center gap-[9px] rounded-[14px] border border-dashed border-[#e8e2f2] bg-[#faf9fd] px-3 py-6 text-center text-xs text-[#93869f] [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:text-[#53485f] [&_p]:m-0 [&_p]:max-w-[340px] [&_p]:text-[11px] [&_p]:leading-[1.7] [&_p]:text-[#8d8396]"><FolderGit2 size={25} /><h3>No connected repositories</h3><p>Your connected GitHub repositories will appear here.</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 max-[541px]:grid-cols-1 max-[541px]:gap-3">
          {repos.map((repo) => (
            <article key={repo.id} className="min-w-0 rounded-[18px] border border-[#eeebf3] bg-[#fefdff] p-[17px] shadow-[0_2px_6px_#30254703] min-[1500px]:p-[22px] max-[768px]:p-3.5 max-[541px]:p-4 [&_h3]:mt-0 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-[550] [&_h3]:tracking-[-0.25px] [&_h3]:[overflow-wrap:anywhere]">
              <div className="mb-3 flex items-center justify-between gap-3"><span className="grid size-[31px] place-items-center rounded-[9px] border border-[#f0ebfc] bg-[#faf8ff] text-[#7851e5] shadow-[0_3px_8px_#7540e808]"><FolderGit2 size={21} strokeWidth={1.5} /></span><span className={`inline-flex shrink-0 items-center gap-[5px] rounded-md px-2 py-[5px] text-[10px] leading-[1.3] font-normal [&>span]:size-1 [&>span]:shrink-0 [&>span]:rounded-full [&>span]:bg-current ${repo.private ? "bg-[#f4f0fb] text-[#8967b7]" : "bg-[#eff8f2] text-[#32965d]"}`}><span />{repo.private ? "Private" : "Public"}</span></div>
              <h3>{repo.name}</h3>
              <p className="m-0 text-[11px] leading-[1.6] text-[#918a99] [overflow-wrap:anywhere]">{repo.fullName}</p>
              <div className="mt-[18px] grid grid-cols-2 gap-2.5 max-[768px]:gap-2 [&>div]:flex [&>div]:min-w-0 [&>div]:flex-col [&>div]:gap-[7px] [&>div]:rounded-[11px] [&>div]:bg-[#f6f5f9] [&>div]:p-[11px] [&>div>span]:text-[10px] [&>div>span]:text-[#7b7385] [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.5 [&_strong]:text-xs [&_strong]:font-medium [&_strong]:[overflow-wrap:anywhere] [&_strong_svg]:shrink-0 [&_strong_svg]:text-[#9990a5]">
                <div><span>Owner</span><strong>{repo.owner}</strong></div>
                <div><span>Visibility</span><strong>{repo.private ? <LockKeyhole size={14} /> : <Globe2 size={14} />}{repo.private ? "Private" : "Public"}</strong></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
