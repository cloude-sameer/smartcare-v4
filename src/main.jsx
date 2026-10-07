import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import DashboardApp from './dashboard/App.jsx';

const modules = [
  { id: 'queue', title: 'Appointments & queue', label: 'Appointments', icon: '🗓️', description: 'Issue appointment tokens, organize doctor queues and see estimated waiting times.', outcome: 'A clearer view of who is waiting, who is being seen and what comes next.', color: 'blue' },
  { id: 'beds', title: 'Rooms & beds', label: 'Rooms & Beds', icon: '🛏️', description: 'See bed availability across General, ICU and Private wards. Admit and discharge from one view.', outcome: 'Understand ward occupancy at a glance and keep bed status current.', color: 'violet' },
  { id: 'pharm', title: 'Pharmacy', label: 'Pharmacy', icon: '💊', description: 'Dispense medicines, maintain stock, flag low quantities and identify expired items.', outcome: 'Keep dispensing and inventory activity together with visible stock alerts.', color: 'amber' },
  { id: 'lab', title: 'Laboratory', label: 'Laboratory', icon: '🧪', description: 'Create test orders, record sample collection and enter or print lab results.', outcome: 'Follow the test workflow from order to reported result.', color: 'cyan' },
  { id: 'blood', title: 'Blood bank', label: 'Blood Bank', icon: '🩸', description: 'Track units by group, record donations, log requests and check compatible stock.', outcome: 'See blood stock and requests in a single operational view.', color: 'rose' },
  { id: 'amb', title: 'Ambulance dispatch', label: 'Ambulance', icon: '🚑', description: 'Log emergency calls, prioritize requests and dispatch available vehicles.', outcome: 'Keep calls, fleet status and dispatch actions visible to the team.', color: 'orange' },
  { id: 'fb', title: 'Patient feedback', label: 'Feedback', icon: '⭐', description: 'Collect patient ratings and comments by department or service.', outcome: 'Bring patient feedback into the same overview as daily operations.', color: 'yellow' },
  { id: 'dash', title: 'Live overview', label: 'Overview', icon: '📊', description: 'Review key hospital activity, alerts, queues, beds and recent actions.', outcome: 'Start the day with one concise snapshot of the demo hospital.', color: 'teal' },
];

const ThemeContext = createContext(null);
const basePath = import.meta.env.BASE_URL;
const routerBasename = basePath === '/' ? undefined : basePath.replace(/\/$/, '');

function readTheme() {
  try {
    const saved = localStorage.getItem('sc_theme');
    return saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch {
    return 'light';
  }
}

function useTheme() {
  return useContext(ThemeContext);
}

function PageStyles() {
  const { pathname } = useLocation();

  useEffect(() => {
    const stylesheet = document.getElementById('route-styles');
    const isDashboard = pathname.startsWith('/dashboard') || pathname === '/app.html';
    if (stylesheet) {
      stylesheet.setAttribute('href', `${basePath}css/${isDashboard ? 'styles' : 'landing'}.css`);
    }

    const currentModule = pathname.startsWith('/modules/')
      ? modules.find((module) => `/modules/${module.id}` === pathname)
      : null;
    const routeMetadata = isDashboard
      ? ['Dashboard · SmartCare Hospital Suite', 'Open the SmartCare hospital operations dashboard.']
      : currentModule
        ? [`${currentModule.label} · SmartCare Hospital Suite`, currentModule.description]
        : pathname === '/features'
          ? ['Features · SmartCare Hospital Suite', 'Explore appointments, beds, pharmacy, laboratory, blood bank, ambulance and feedback modules.']
          : pathname === '/platform'
            ? ['Platform · SmartCare Hospital Suite', 'Learn how the SmartCare hospital operations demo works.']
            : pathname === '/about'
              ? ['About · SmartCare Hospital Suite', 'About the SmartCare hospital operations demo.']
              : pathname === '/support'
                ? ['Support · SmartCare Hospital Suite', 'Find help and answers about the SmartCare demo.']
                : pathname === '/'
                  ? ['SmartCare Hospital Suite · One system for every ward', 'Bring hospital appointments, pharmacy, blood bank, laboratory, ambulance dispatch and bed management into one responsive workspace.']
                  : ['Page not found · SmartCare Hospital Suite', 'The requested SmartCare page could not be found.'];
    document.title = routeMetadata[0];
    document.querySelector('meta[name="description"]')?.setAttribute('content', routeMetadata[1]);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', routeMetadata[0]);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register(`${basePath}sw.js`).catch(() => {});
    }
  }, []);

  return null;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1220' : '#f6f8fc');
    try {
      localStorage.setItem('sc_theme', theme);
    } catch {
      // Keep the selected theme active when storage is unavailable.
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button className="theme-toggle" type="button" aria-label={`Switch to ${nextTheme} theme`} onClick={() => setTheme(nextTheme)}>
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}

function MarketingLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="marketing-page">
      <header className="nav">
        <Link className="lg" to="/" onClick={closeMenu}><i aria-hidden="true">+</i>SmartCare</Link>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="bg" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
        </div>
        <nav id="primary-navigation" className={menuOpen ? 'menu-open' : ''} aria-label="Main navigation">
          <NavLink to="/features" onClick={closeMenu}>Features</NavLink>
          <NavLink to="/platform" onClick={closeMenu}>Platform</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/support" onClick={closeMenu}>Support</NavLink>
          <Link className="btn" to="/dashboard" onClick={closeMenu}>Open dashboard <span aria-hidden="true">→</span></Link>
        </nav>
      </header>
      {children}
      <footer>
        <div className="footer-brand">
          <Link className="lg" to="/"><i aria-hidden="true">+</i>SmartCare</Link>
          <span>A connected demo for everyday hospital operations.</span>
        </div>
        <div className="footer-links">
          <Link to="/features">Features</Link><Link to="/platform">Platform</Link><Link to="/support">Support</Link><Link to="/about">About</Link>
        </div>
        <div className="footer-note">Demo data stays in this browser. Not for production patient records.</div>
      </footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="section-intro">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function ModuleCard({ item, index = 0 }) {
  return (
    <Link className={`module-card tone-${item.color}`} to={`/modules/${item.id}`} style={{ '--card-index': index }}>
      <span className="module-icon" aria-hidden="true">{item.icon}</span>
      <span className="module-copy"><b>{item.title}</b><span>{item.description}</span></span>
      <span className="module-arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

function HomePage() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <span className="pill"><span className="live-dot" /> Hospital operations, connected</span>
          <h1>One calm view of a <span>busy hospital.</span></h1>
          <p>Bring appointments, beds, pharmacy, laboratory, blood bank and ambulance dispatch together in one responsive workspace.</p>
          <div className="cta"><Link className="btn big" to="/dashboard">Explore the live demo <span aria-hidden="true">→</span></Link><Link className="btn ghost big" to="/features">Explore the platform</Link></div>
          <div className="trust"><span><i>✓</i> Eight connected modules</span><span><i>✓</i> Works offline after first load</span><span><i>✓</i> Light &amp; dark themes</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-top"><span><i /> SmartCare overview</span><span>●●●</span></div>
          <div className="visual-date">Today at a glance <span>Live demo</span></div>
          <div className="visual-kpis"><div><span>Waiting patients</span><b>02</b><i>Queue moving</i></div><div><span>Free beds</span><b>10</b><i>Across 3 wards</i></div><div><span>Lab orders</span><b>01</b><i>In progress</i></div><div><span>Fleet ready</span><b>03</b><i>Available units</i></div></div>
          <div className="visual-bottom"><div className="visual-bars"><span>Hospital activity</span><div>{[42, 66, 48, 78, 56, 88, 63, 74, 50, 92, 70, 84].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div><div className="visual-status"><i /> All systems at a glance</div></div>
          <span className="visual-orbit orbit-one" /><span className="visual-orbit orbit-two" />
        </div>
      </section>

      <section className="proof-strip" aria-label="SmartCare product details">
        <div><b>08</b><span>connected modules</span></div><div><b>01</b><span>shared overview</span></div><div><b>24/7</b><span>emergency call logging</span></div><div><b>Local</b><span>demo data in your browser</span></div>
      </section>

      <section className="section-block" id="modules">
        <SectionIntro eyebrow="THE WORKSPACE" title="The right tools for every hospital desk." >
          Start with a live overview, then move directly into the workflow that needs attention.
        </SectionIntro>
        <div className="module-grid">{modules.map((item, index) => <ModuleCard item={item} index={index} key={item.id} />)}</div>
        <div className="section-cta"><Link className="text-link" to="/features">Explore all platform features <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="workflow-band">
        <div className="workflow-art"><img src={`${basePath}assets/hero.svg`} alt="Hospital, ambulance and care illustration" loading="lazy" /></div>
        <div className="workflow-copy"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>Less tab-hopping.<br />More time for care.</h2><p>One familiar sidebar keeps every service close. Shared alerts help teams spot queues, low stock, pending tests and urgent requests sooner.</p><Link className="text-link" to="/platform">See how the platform works <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="section-block how-section">
        <SectionIntro eyebrow="GET STARTED" title="From overview to action in a few clicks." />
        <div className="how"><article><i>01</i><b>Open the workspace</b><span>Launch the browser-based demo on desktop, tablet or phone.</span></article><article><i>02</i><b>Choose a service</b><span>Navigate to appointments, wards, diagnostics and more.</span></article><article><i>03</i><b>Record and review</b><span>Actions update the overview and stay in your local browser data.</span></article></div>
      </section>

      <section className="sos"><div><span className="eyebrow">URGENT RESPONSE</span><h2>Every second matters.</h2><p>Log calls by priority and see available ambulance units from the dispatch module. For real emergencies in India, call 112.</p></div><Link className="btn big light" to="/dashboard/amb">Open dispatch <span aria-hidden="true">→</span></Link></section>
    </main>
  );
}

function FeaturesPage() {
  return (
    <main className="route-page">
      <section className="route-hero"><span className="eyebrow">ONE CONNECTED WORKSPACE</span><h1>Every service has a place.<br /><span>Every team has a view.</span></h1><p>Eight focused modules bring daily hospital desk work into one easy-to-navigate interface.</p><Link className="btn big" to="/dashboard">Explore the live demo <span aria-hidden="true">→</span></Link></section>
      <section className="section-block route-section"><SectionIntro eyebrow="THE MODULES" title="Built around the work teams already do." /><div className="module-grid">{modules.map((item, index) => <ModuleCard item={item} index={index} key={item.id} />)}</div></section>
      <section className="feature-callout"><div><span className="eyebrow">SHARED CONTEXT</span><h2>Alerts and activity stay connected.</h2><p>Jump from a dashboard alert to its service, review recent actions, and keep important operational details in view.</p></div><Link className="btn" to="/dashboard/dash">View overview <span aria-hidden="true">→</span></Link></section>
    </main>
  );
}

function PlatformPage() {
  const capabilities = [
    ['01', 'A shared operational view', 'Review patient queues, service alerts, bed occupancy, blood stock and recent activity from one dashboard.'],
    ['02', 'Workflows by service', 'Each module focuses on its job, from issuing an appointment token to dispatching a vehicle.'],
    ['03', 'Responsive by default', 'Use the same navigation and module workflows on a laptop, tablet or phone.'],
    ['04', 'A local-first demo', 'The demo stores its sample data in your browser and can be used offline after its files are cached.'],
  ];
  return (
    <main className="route-page">
      <section className="route-hero"><span className="eyebrow">THE SMARTCARE PLATFORM</span><h1>Operational clarity,<br /><span>without the clutter.</span></h1><p>A practical interface for coordinating the everyday details that keep hospital services moving.</p><Link className="btn big" to="/dashboard">Open the demo <span aria-hidden="true">→</span></Link></section>
      <section className="capability-list">{capabilities.map(([number, title, description]) => <article key={number}><i>{number}</i><div><h2>{title}</h2><p>{description}</p></div><span aria-hidden="true">↗</span></article>)}</section>
      <section className="notice-card"><span className="notice-icon" aria-hidden="true">ⓘ</span><div><b>Demo scope and data</b><p>This project is a client-side demo, not a production clinical system. It has no hosted database, user accounts, access controls or medical-record safeguards. Do not enter real patient data.</p></div></section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="route-page">
      <section className="route-hero about-hero"><span className="eyebrow">ABOUT SMARTCARE</span><h1>Designed to make<br /><span>busy days feel clearer.</span></h1><p>SmartCare brings a set of common hospital operations into one coherent, easy-to-explore demo.</p></section>
      <section className="about-grid"><article><span className="eyebrow">OUR APPROACH</span><h2>Practical over complicated.</h2><p>Clear module navigation, visible status, and straightforward actions keep the demo approachable for teams exploring a connected hospital workspace.</p></article><article><span className="eyebrow">BUILT FOR EXPLORATION</span><h2>Try the workflows yourself.</h2><p>Sample data lets you explore appointments, inventory, diagnostics, blood bank requests and ambulance dispatch without creating an account.</p><Link className="text-link" to="/dashboard">Open the live demo <span aria-hidden="true">→</span></Link></article></section>
      <section className="notice-card"><span className="notice-icon" aria-hidden="true">♡</span><div><b>For demonstration only</b><p>SmartCare is not a substitute for a hospital information system. Demo information is stored locally in your browser and is not suitable for real clinical, billing or emergency operations.</p></div></section>
    </main>
  );
}

function SupportPage() {
  return (
    <main className="route-page support-page">
      <section className="route-hero"><span className="eyebrow">HELP &amp; GETTING STARTED</span><h1>Quick answers.<br /><span>Clear expectations.</span></h1><p>Find your way around the demo and understand how its local data works.</p></section>
      <section className="faq-list">
        <details><summary>How do I explore a hospital module?</summary><p>Open the dashboard, then choose a module in the left navigation. You can also open a module directly from the <Link to="/features">features page</Link>.</p></details>
        <details><summary>Where is demo data stored?</summary><p>In local storage in your current browser. It is not synced across users or devices. Use “Reset demo” in the dashboard to restore the sample data.</p></details>
        <details><summary>Can I enter real patient information?</summary><p>No. This demo has no server-side security, authentication, audit controls or clinical safeguards. Use sample information only.</p></details>
        <details><summary>Does it work without an internet connection?</summary><p>After the site has loaded and its service worker has cached the assets, the demo can reopen offline in a supported browser. External NGO links require an internet connection.</p></details>
      </section>
      <section className="support-cta"><div><h2>Ready to take a look?</h2><p>Open the demo and explore the dashboard at your own pace.</p></div><Link className="btn" to="/dashboard">Open the dashboard <span aria-hidden="true">→</span></Link></section>
    </main>
  );
}

function ModulePage() {
  const { moduleId } = useParams();
  const item = modules.find((module) => module.id === moduleId);
  if (!item) return <NotFoundPage />;

  return (
    <main className="route-page module-detail">
      <Link className="back-link" to="/features">← All features</Link>
      <section className={`detail-hero tone-${item.color}`}><span className="module-icon" aria-hidden="true">{item.icon}</span><span className="eyebrow">SMARTCARE MODULE</span><h1>{item.title}</h1><p>{item.description}</p><Link className="btn big" to={`/dashboard/${item.id}`}>Open {item.label} <span aria-hidden="true">→</span></Link></section>
      <section className="detail-outcome"><span className="eyebrow">WHAT YOU CAN DO</span><h2>{item.outcome}</h2><p>Explore this workflow with sample data in the SmartCare browser demo. Actions are stored locally in this browser.</p></section>
      <section className="detail-next"><div><span className="eyebrow">CONNECTED WORKSPACE</span><h2>Part of a bigger picture.</h2><p>Return to the overview to see how this service connects with hospital-wide activity.</p></div><Link className="btn ghost" to="/dashboard/dash">Go to overview <span aria-hidden="true">→</span></Link></section>
    </main>
  );
}

function NotFoundPage() {
  return <main className="route-page not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This page isn’t on the ward list.</h1><p>The address may have changed, or the page may not exist.</p><div className="cta"><Link className="btn" to="/">Go home</Link><Link className="btn ghost" to="/dashboard">Open dashboard</Link></div></main>;
}

function LegacyDashboardRedirect() {
  const { hash } = useLocation();
  const tab = hash.slice(1);
  return <Navigate replace to={`/dashboard/${modules.some((item) => item.id === tab) ? tab : 'dash'}`} />;
}

function AppRoutes() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <PageStyles />
      <Routes>
        <Route path="/" element={<MarketingLayout><HomePage /></MarketingLayout>} />
        <Route path="/features" element={<MarketingLayout><FeaturesPage /></MarketingLayout>} />
        <Route path="/platform" element={<MarketingLayout><PlatformPage /></MarketingLayout>} />
        <Route path="/about" element={<MarketingLayout><AboutPage /></MarketingLayout>} />
        <Route path="/support" element={<MarketingLayout><SupportPage /></MarketingLayout>} />
        <Route path="/modules/:moduleId" element={<MarketingLayout><ModulePage /></MarketingLayout>} />
        <Route path="/dashboard" element={<Navigate replace to="/dashboard/dash" />} />
        <Route path="/dashboard/:tab" element={<DashboardApp theme={theme} setTheme={setTheme} />} />
        <Route path="/app.html" element={<LegacyDashboardRedirect />} />
        <Route path="*" element={<MarketingLayout><NotFoundPage /></MarketingLayout>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ThemeProvider><AppRoutes /></ThemeProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
