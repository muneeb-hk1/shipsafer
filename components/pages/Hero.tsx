import Link from "next/link";
import type { SVGProps } from "react";
import { Activity, Check, ChevronDown, CircleDot, FolderGit2, GitBranch, GitPullRequest, Globe2, LayoutGrid, LockKeyhole, ShieldCheck } from "lucide-react";
import styles from "./Home.module.css";

const installationUrl = "https://github.com/apps/shipsaferauth/installations/new";

function Github({ size = 18, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.63 0c2.15-1.46 3.09-1.16 3.09-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" /></svg>;
}

function ConnectGitHub() {
  return (
    <a className={styles.primaryButton} href={installationUrl} target="_blank" rel="noopener noreferrer">
      <Github size={18} aria-hidden="true" />Connect GitHub
    </a>
  );
}

function RepositoryPreview() {
  return (
    <figure className={styles.preview} aria-label="Illustrative ShipSafer repository dashboard">
      <div className={styles.windowBar}>
        <span className={styles.windowDots} aria-hidden="true"><i /><i /><i /></span>
        <span><LockKeyhole size={12} aria-hidden="true" /> shipsafer / workspace</span>
        <span className={styles.exampleLabel}>Example workspace</span>
      </div>
      <div className={styles.appPreview}>
        <div className={styles.previewSidebar} aria-hidden="true">
          <div className={styles.previewBrand}><ShieldCheck size={23} /> ShipSafer</div>
          <span className={styles.sidebarHeading}>WORKSPACE</span>
          <div className={styles.selectedNav}><LayoutGrid size={16} /> Overview</div>
          <div className={styles.sidebarNav}><Activity size={16} /> Recent activity</div>
          <div className={styles.sidebarBottom}><span>Y</span> Your workspace <ChevronDown size={14} /></div>
        </div>
        <div className={styles.previewContent}>
          <div className={styles.previewHeading}><div><h2>Repository overview</h2><p>A little clarity before your next big release.</p></div><span className={styles.githubBadge}><Github size={15} /> Connected</span></div>
          <div className={styles.metrics}>
            {[
              { label: "Repositories", value: "06", icon: FolderGit2 },
              { label: "Open pull requests", value: "12", icon: GitPullRequest },
              { label: "Public repositories", value: "02", icon: Globe2 },
              { label: "Private repositories", value: "04", icon: LockKeyhole },
            ].map(({ label, value, icon: Icon }) => (
              <div className={styles.metric} key={label}><span><Icon size={15} />{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <div className={styles.repositoryBar}><span><FolderGit2 size={17} /> acme / storefront <ChevronDown size={14} /></span><span>Open pull requests</span></div>
          <div className={styles.pullList}>
            {[
              { title: "Improve the checkout experience", branch: "feat/checkout", number: "128", time: "2 hours ago" },
              { title: "Update account settings", branch: "feat/settings", number: "127", time: "4 hours ago" },
              { title: "Fix mobile navigation", branch: "fix/mobile-nav", number: "126", time: "6 hours ago" },
            ].map((pull) => (
              <div className={styles.pullRow} key={pull.number}>
                <GitPullRequest size={19} className={styles.pullIcon} aria-hidden="true" />
                <div><strong>{pull.title}</strong><span>#{pull.number} <GitBranch size={12} aria-hidden="true" /> {pull.branch}</span></div>
                <span className={styles.pullTime}>{pull.time}</span><span className={styles.openBadge}>Open</span>
              </div>
            ))}
          </div>
          <div className={styles.previewNote}><Check size={14} aria-hidden="true" /> Your repositories. Your pull requests. One place.</div>
        </div>
      </div>
    </figure>
  );
}

export default function Hero() {
  return (
    <main className={styles.home} id="top">
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><ShieldCheck size={15} aria-hidden="true" /> A little more confidence. Every push.</span>
          <h1 id="hero-title">Meet ShipSafer.</h1>
          <p>Your next push to production, with peace of mind.<br className={styles.desktopBreak} /> Catch broken flows, API failures, and performance<br className={styles.desktopBreak} /> regressions before they reach your users.</p>
          <div className={styles.actions}><ConnectGitHub /><Link href="/login" className={styles.secondaryButton}>Get started</Link></div>
        </div>
        <div className={styles.previewStage}><RepositoryPreview /></div>
      </section>
      <section className={styles.statement} id="workflow" aria-labelledby="statement-title">
        <h2 id="statement-title">Build freely.<br />Ship with confidence.</h2>
        <div><p>Great releases start with a clear view of what’s changing. Bring your GitHub repositories and open pull requests into one workspace.</p><p>Less jumping between tabs. More focus on the code that matters.</p></div>
      </section>
      <section className={styles.features} id="features" aria-labelledby="features-title">
        <div className={styles.sectionHeading}><h2 id="features-title">Your workflow. A clearer view.</h2><p>Keep your projects close and your next release in sight.</p></div>
        <div className={styles.featureGrid}>
          <article className={styles.featureCard}>
            <h3>All your repositories, together</h3><p>Connect GitHub and find your public and private projects in one place.</p>
            <div className={styles.repoExample} aria-label="Example repository list">
              <div className={styles.snippetTitle}><Github size={19} /> Your repositories <span>Example</span></div>
              {[{ name: "storefront", icon: Globe2, branch: "TypeScript" }, { name: "api-service", icon: LockKeyhole, branch: "TypeScript" }, { name: "design-system", icon: Globe2, branch: "CSS" }].map(({ name, icon: Icon, branch }) => (
                <div className={styles.repoExampleRow} key={name}><FolderGit2 size={18} /><strong>{name}</strong><span>{branch}</span><Icon size={14} /></div>
              ))}
            </div>
          </article>
          <article className={styles.featureCard}>
            <h3>Stay close to every pull request</h3><p>Pick a repository and see its open pull requests, with automatic refreshes as you work.</p>
            <div className={styles.prExample}>
              <div className={styles.snippetTitle}><GitPullRequest size={19} /> Pull request <span>Example</span></div>
              <h4>Improve the checkout experience</h4>
              <div className={styles.branchPills}><span><GitBranch size={13} /> feat/checkout</span><span>main</span></div>
              <div className={styles.prExampleBottom}><span><CircleDot size={15} /> Open</span><span>#128 in storefront</span></div>
            </div>
          </article>
        </div>
      </section>
      <section className={styles.finalCta} aria-labelledby="cta-title">
        <ShieldCheck size={42} strokeWidth={1.4} aria-hidden="true" />
        <h2 id="cta-title">Make your next push a safer one.</h2><p>Bring your GitHub workflow into ShipSafer.</p>
        <div className={styles.actions}><ConnectGitHub /><Link href="/login" className={styles.secondaryButton}>Get started</Link></div>
      </section>
      <footer className={styles.footer}><Link href="/" className={styles.footerBrand}><ShieldCheck size={22} aria-hidden="true" /> ShipSafer</Link><p>Built for the confidence to ship.</p><Link href="/login">Get started</Link></footer>
    </main>
  );
}
