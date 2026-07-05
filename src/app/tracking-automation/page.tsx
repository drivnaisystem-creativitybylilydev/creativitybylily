export const metadata = {
  title: 'Order Delivery Automation — Build Proposal',
  robots: { index: false, follow: false },
};

const STYLES = `
  :root {
    --ta-ink: #2b241f;
    --ta-paper: #faf3ef;
    --ta-paper-raised: #ffffff;
    --ta-accent: #c96e84;
    --ta-accent-soft: #f2dbe1;
    --ta-accent-deep: #a85a6d;
    --ta-sage: #6f8461;
    --ta-sage-soft: #e3e9dc;
    --ta-line: #e6d7d0;
    --ta-shadow: 0 1px 2px rgba(43,36,31,0.04), 0 8px 24px rgba(43,36,31,0.06);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ta-ink: #f2e9e3; --ta-paper: #211a17; --ta-paper-raised: #2a2220;
      --ta-accent: #ec9fb0; --ta-accent-soft: #40282e; --ta-accent-deep: #f2b4c1;
      --ta-sage: #9db28c; --ta-sage-soft: #2c3226; --ta-line: #3d322d;
      --ta-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 12px 32px rgba(0,0,0,0.35);
    }
  }
  #tracking-automation-page * { box-sizing: border-box; }
  #tracking-automation-page {
    margin: 0;
    background: var(--ta-paper);
    color: var(--ta-ink);
    font-family: var(--font-inter), system-ui, sans-serif;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  #tracking-automation-page .page {
    max-width: 760px;
    margin: 0 auto;
    padding: clamp(28px, 6vw, 72px) clamp(20px, 5vw, 40px) 64px;
  }
  #tracking-automation-page .brandline {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 12px; padding-bottom: 22px; border-bottom: 1px solid var(--ta-line);
    margin-bottom: 40px; flex-wrap: wrap;
  }
  #tracking-automation-page .brandline .name {
    font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ta-accent-deep); font-weight: 600;
  }
  #tracking-automation-page .brandline .tag { font-size: 13px; opacity: 0.55; }
  #tracking-automation-page .hero { margin-bottom: 56px; }
  #tracking-automation-page .eyebrow {
    font-size: 12.5px; letter-spacing: 0.09em; text-transform: uppercase;
    opacity: 0.5; margin: 0 0 14px;
  }
  #tracking-automation-page h1 {
    font-family: var(--font-playfair), Georgia, serif;
    font-weight: 400; font-style: italic; font-size: clamp(30px, 4.6vw, 44px); line-height: 1.18;
    letter-spacing: -0.01em; margin: 0 0 18px; text-wrap: balance; max-width: 16ch;
  }
  #tracking-automation-page .hero p { max-width: 56ch; font-size: 17px; opacity: 0.82; margin: 0; }
  #tracking-automation-page .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 56px; }
  @media (max-width: 620px) { #tracking-automation-page .compare { grid-template-columns: 1fr; } }
  #tracking-automation-page .panel {
    background: var(--ta-paper-raised); border: 1px solid var(--ta-line);
    border-radius: 14px; padding: 22px 22px 24px; box-shadow: var(--ta-shadow);
  }
  #tracking-automation-page .panel.after { border-color: var(--ta-accent); }
  #tracking-automation-page .panel-label {
    font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase;
    font-weight: 700; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
  }
  #tracking-automation-page .panel.today .panel-label { opacity: 0.55; }
  #tracking-automation-page .panel.after .panel-label { color: var(--ta-accent-deep); }
  #tracking-automation-page .panel ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
  #tracking-automation-page .panel li { display: flex; gap: 10px; font-size: 14.5px; align-items: flex-start; }
  #tracking-automation-page .mark { flex: none; width: 18px; height: 18px; margin-top: 1px; }
  #tracking-automation-page .panel.today .step-muted { opacity: 0.45; text-decoration: line-through; text-decoration-thickness: 1px; }
  #tracking-automation-page .panel.today .mark.cross { opacity: 0.35; }
  #tracking-automation-page .panel.after .mark.check { color: var(--ta-sage); }
  #tracking-automation-page .section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
  #tracking-automation-page .section-head h2 {
    font-family: var(--font-playfair), Georgia, serif; font-weight: 400; font-style: italic; font-size: 23px; margin: 0;
  }
  #tracking-automation-page .section-sub { font-size: 14px; opacity: 0.62; margin: 0 0 26px; max-width: 54ch; }
  #tracking-automation-page .flow { display: flex; flex-direction: column; gap: 0; margin-bottom: 56px; }
  #tracking-automation-page .flow-step {
    display: grid; grid-template-columns: 34px 1fr; gap: 16px; padding: 18px 0; border-top: 1px solid var(--ta-line);
  }
  #tracking-automation-page .flow-step:last-child { border-bottom: 1px solid var(--ta-line); }
  #tracking-automation-page .flow-num {
    font-family: var(--font-playfair), Georgia, serif; font-style: italic; font-size: 19px; color: var(--ta-accent-deep); opacity: 0.75; line-height: 1.4;
  }
  #tracking-automation-page .flow-body h3 { margin: 0 0 4px; font-size: 15.5px; font-weight: 600; }
  #tracking-automation-page .flow-body p { margin: 0; font-size: 14px; opacity: 0.72; max-width: 56ch; }
  #tracking-automation-page .flow-tag {
    display: inline-block; margin-top: 8px; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
    font-weight: 700; padding: 3px 9px; border-radius: 100px; background: var(--ta-sage-soft); color: var(--ta-sage);
  }
  #tracking-automation-page .flow-tag.new { background: var(--ta-accent-soft); color: var(--ta-accent-deep); }
  #tracking-automation-page .investment {
    background: var(--ta-paper-raised); border: 1px solid var(--ta-line); border-radius: 16px;
    padding: clamp(24px, 4vw, 36px); box-shadow: var(--ta-shadow); margin-bottom: 40px;
    display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;
  }
  @media (max-width: 560px) { #tracking-automation-page .investment { grid-template-columns: 1fr; text-align: left; } }
  #tracking-automation-page .seal {
    flex: none; width: 104px; height: 104px; border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, var(--ta-accent), var(--ta-accent-deep) 78%);
    color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(169,90,109,0.35), inset 0 0 0 3px rgba(255,255,255,0.25);
  }
  #tracking-automation-page .seal .amt { font-family: var(--font-playfair), Georgia, serif; font-style: italic; font-size: 30px; line-height: 1; }
  #tracking-automation-page .seal .unit { font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.9; margin-top: 4px; }
  #tracking-automation-page .investment-copy h3 { margin: 0 0 8px; font-size: 17px; font-weight: 700; }
  #tracking-automation-page .investment-copy p { margin: 0; font-size: 14.5px; opacity: 0.78; }
  #tracking-automation-page .investment-copy .no-change {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 13px; color: var(--ta-sage); font-weight: 600;
  }
  #tracking-automation-page .safety { display: flex; gap: 12px; font-size: 13.5px; opacity: 0.7; align-items: flex-start; padding-left: 2px; }
  #tracking-automation-page .safety svg { flex: none; margin-top: 2px; }
  #tracking-automation-page footer {
    margin-top: 64px; padding-top: 20px; border-top: 1px solid var(--ta-line);
    display: flex; justify-content: space-between; gap: 12px; font-size: 12px; opacity: 0.5; flex-wrap: wrap;
  }
`;

export default function TrackingAutomationPage() {
  return (
    <div id="tracking-automation-page">
      <style>{STYLES}</style>
      <div className="page">
        <div className="brandline">
          <span className="name">Drivn.AI</span>
          <span className="tag">Build proposal for Creativity by Lily · July 2026</span>
        </div>

        <div className="hero">
          <p className="eyebrow">Order tracking · new automation</p>
          <h1>Customers find out the second their order arrives.</h1>
          <p>
            No more opening Rollo to check. When USPS scans a package as delivered, the site sees it
            instantly and lets the customer know — automatically.
          </p>
        </div>

        <div className="compare">
          <div className="panel today">
            <p className="panel-label">
              <svg className="mark cross" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Today
            </p>
            <ul>
              <li>
                <svg className="mark" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5L7.5 13L14 5" stroke="var(--ta-sage)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                You mark the order shipped &amp; enter tracking
              </li>
              <li className="step-muted">
                <svg className="mark cross" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                You open the Rollo app to check delivery
              </li>
              <li className="step-muted">
                <svg className="mark cross" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                You manually flip the order to &quot;delivered&quot;
              </li>
              <li className="step-muted">
                <svg className="mark cross" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Customer never hears it arrived
              </li>
            </ul>
          </div>
          <div className="panel after">
            <p className="panel-label">
              <svg className="mark check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9.5L7.5 13L14 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              After this build
            </p>
            <ul>
              <li>
                <svg className="mark check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5L7.5 13L14 5" stroke="var(--ta-sage)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                You mark the order shipped — exactly like today
              </li>
              <li>
                <svg className="mark check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5L7.5 13L14 5" stroke="var(--ta-sage)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                The site watches that tracking number for you
              </li>
              <li>
                <svg className="mark check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5L7.5 13L14 5" stroke="var(--ta-sage)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Delivered scan → order updates itself
              </li>
              <li>
                <svg className="mark check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5L7.5 13L14 5" stroke="var(--ta-sage)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Customer gets an &quot;it&apos;s arrived&quot; email, same moment
              </li>
            </ul>
          </div>
        </div>

        <div className="section-head">
          <h2>What&apos;s actually getting built</h2>
        </div>
        <p className="section-sub">
          This touches four separate parts of the system — it&apos;s a real feature, not a settings change.
          Here&apos;s the sequence, in the order it happens.
        </p>

        <div className="flow">
          <div className="flow-step">
            <div className="flow-num">1</div>
            <div className="flow-body">
              <h3>Tracking watch starts automatically</h3>
              <p>
                The moment you click &quot;mark shipped,&quot; the site quietly registers that tracking number
                for live monitoring — no extra step for you, no change to how you use Rollo.
              </p>
              <span className="flow-tag new">New connection</span>
            </div>
          </div>
          <div className="flow-step">
            <div className="flow-num">2</div>
            <div className="flow-body">
              <h3>A delivery listener, built from scratch</h3>
              <p>
                A new piece of the site is built specifically to receive the instant a package is scanned
                &quot;delivered&quot; by USPS — this doesn&apos;t exist anywhere in the system today.
              </p>
              <span className="flow-tag new">New endpoint</span>
            </div>
          </div>
          <div className="flow-step">
            <div className="flow-num">3</div>
            <div className="flow-body">
              <h3>The order updates itself, and a new email goes out</h3>
              <p>
                Status flips to &quot;delivered&quot; with no click from you, and a brand-new customer email —
                designed to match your site — sends automatically.
              </p>
              <span className="flow-tag new">New email template</span>
            </div>
          </div>
          <div className="flow-step">
            <div className="flow-num">4</div>
            <div className="flow-body">
              <h3>A daily safety check, in case anything&apos;s missed</h3>
              <p>
                Real-time signals occasionally drop. A quiet daily check re-confirms any shipped order that
                hasn&apos;t heard back, so nothing ever gets stuck.
              </p>
              <span className="flow-tag">Backup net</span>
            </div>
          </div>
        </div>

        <div className="investment">
          <div className="seal">
            <span className="amt">$150</span>
            <span className="unit">one-time</span>
          </div>
          <div className="investment-copy">
            <h3>One-time build fee</h3>
            <p>
              Covers the new tracking connection, delivery listener, arrival email, and backup check above —
              real new automation, built once.
            </p>
            <span className="no-change">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M4 9.5L7.5 13L14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Your $75/month stays exactly the same
            </span>
          </div>
        </div>

        <div className="safety">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--ta-sage)' }}>
            <path d="M9 2L15 4.5V9C15 12.5 12.5 14.8 9 16C5.5 14.8 3 12.5 3 9V4.5L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          Built and tested privately first — nothing touches your live store or current orders while this is
          in progress.
        </div>

        <footer>
          <span>Prepared by Finn — Drivn.AI</span>
          <span>Reply anytime to confirm and I&apos;ll get started</span>
        </footer>
      </div>
    </div>
  );
}
