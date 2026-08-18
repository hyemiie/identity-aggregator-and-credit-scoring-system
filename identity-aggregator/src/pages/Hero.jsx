import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, Layers, RefreshCw, ShieldCheck, FlaskConical, KeyRound, AlertTriangle, Webhook, Gauge } from "lucide-react";
import "../style/hero.css";

const idTypes = [
  { code: "BVN", label: "Bank Verification Number", country: "NG" },
  { code: "NIN", label: "National Identity Number", country: "NG" },
  { code: "CAC", label: "Corporate Affairs Registry", country: "NG" },
  { code: "GHA-CARD", label: "Ghana Card", country: "GH" },
  { code: "TIN", label: "Tax Identification Number", country: "NG" }
];

const providers = [
  { name: "Provider A", status: "operational", detail: "BVN · NIN · CAC — Nigeria", latency: "412ms" },
  { name: "Smile Identity", status: "operational", detail: "Ghana Card · BVN — NG / GH", latency: "780ms" }
];

const responsesByProvider = {
  "Provider A": `{
  "verification_id": "vf_8a2f01",
  "status": "verified",
  "type": "bvn",
  "matched": {
    "first_name": "AMARA",
    "last_name": "OKAFOR",
    "dob": "1994-03-11"
  },
  "provider": "provider_a",
  "consent": "granted",
  "latency_ms": 412
}`,
  "Smile Identity": `{
  "verification_id": "vf_8a2f01",
  "status": "verified",
  "type": "ghana-card",
  "matched": {
    "first_name": "AMARA",
    "last_name": "OKAFOR",
    "dob": "1994-03-11"
  },
  "provider": "smile_identity",
  "consent": "granted",
  "latency_ms": 780
}`
};

const requestJson = `POST /v1/verify
Authorization: Bearer sk_live_••••••••

{
  "type": "bvn",
  "identifier": "22134567890",
  "consent": {
    "granted": true,
    "reference": "cst_7f0a1"
  }
}`;

const features = [
  [Layers, "One endpoint, every ID type", "POST /v1/verify takes a type and an identifier. BVN, NIN, CAC, Ghana Card — same shape every time."],
  [RefreshCw, "Normalized responses", "Every provider's fields, status codes, and error shapes get mapped to one schema before they reach you."],
  [ShieldCheck, "Consent built into the lifecycle", "Requests carry a consent reference from the start, matching NIBSS/iGree requirements for Nigeria out of the box."],
  [FlaskConical, "Sandbox with realistic fixtures", "Integrate against fake — but shaped-like-real — data. No live PII, no per-call charges, until you're ready."],
  [KeyRound, "Per-client API keys", "Scoped keys, request signing, and rate limits per client, set at the level you'd expect from day one."],
  [AlertTriangle, "Errors that say what happened", "provider_down, invalid_input, verification_failed, consent_not_granted — never a bare 500."]
];

const roadmap = [
  ["v1.1", "Developer experience", ["Python & Node/TypeScript SDKs", "Interactive docs — OpenAPI + Swagger/Redoc", "Webhooks for async results", "Backoff-and-retry on flaky providers"]],
  ["v1.2", "Reliability & ops", ["Per-provider health checks", "Automatic fallback, A → B, same request", "Usage dashboard — success rate, latency"]],
  ["v2", "On the roadmap", ["Canada — bank-linked verification", "More countries, contributions welcome", "Document/ID image upload & extraction"]]
];

function Header() {
  return <header className="site-header">
    <div className="container nav">
      <a className="brand" href="/"><span className="brand-mark"><Check size={16}/></span><span>verifi.io</span></a>
      <nav>
        <a href="/product">Product</a>
        <a href="/providers">Providers</a>
        <a href="/docs">Docs</a>
        <a href="/roadmap">Roadmap</a>
      </nav>
      <div className="nav-actions">
        <a className="docs-link" href="/docs">Read the docs</a>
        <button className="btn btn-primary">Get API keys <ArrowRight size={14}/></button>
      </div>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="container footer-inner">
      <a className="brand" href="/"><span className="brand-mark small"><Check size={13}/></span><span>verifi.io</span></a>
      <span>BVN · NIN · CAC · Ghana Card — one schema.</span>
      <span>© 2026</span>
    </div>
  </footer>;
}

function Layout({children}) { return <><Header/>{children}<Footer/></>; }

function useCycle(list, ms = 2800) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % list.length), ms);
    return () => clearInterval(t);
  }, [list.length, ms]);
  return i;
}

function Terminal() {
  const providerIdx = useCycle(providers, 3200);
  const activeProvider = providers[providerIdx].name;
  return <div className="terminal">
    <div className="terminal-bar"><div className="dots"><i/><i/><i/></div><span>verify.request.json</span></div>
    <pre>{requestJson}</pre>
    <div className="terminal-route"><ChevronRight size={13}/><span>routed to <b>{activeProvider}</b> · normalized on return</span></div>
    <pre className="response">{responsesByProvider[activeProvider]}</pre>
  </div>;
}

function Hero() {
  return <section className="container hero">
    <div>
      <div className="pill"><span/>REF-01 · unified verification API</div>
      <h1>One API.<br/>Every identity check.</h1>
      <p className="hero-copy">Stop writing a new integration for every KYC provider. Send one request to <code>/v1/verify</code> and get BVN, NIN, CAC, or Ghana Card results back in the same shape, every time.</p>
      <div className="button-row">
        <button className="btn btn-primary large">Start in sandbox <ArrowRight size={15}/></button>
        {/* <button className="btn btn-light large"><Github size={15}/> View the spec</button> */}
      </div>
      <div className="types">
        <div className="eyebrow">Verification types live today</div>
        <div className="chip-row">{idTypes.map(id => <span className="chip" key={id.code}><b>{id.code}</b><small>{id.country}</small></span>)}</div>
      </div>
    </div>
    <Terminal/>
  </section>;
}

function Providers() {
  return <Page title="Providers" eyebrow="REF-01 · live routing">
    <div className="provider-grid">{providers.map(p => <div className="provider-card card-hover" key={p.name}><div><div className="provider-name"><span/>{p.name}</div><p>{p.detail}</p></div><div className="provider-status"><b>operational</b><small>{p.latency} avg</small></div></div>)}</div>
  </Page>;
}

function Product() {
  return <Page title="Every provider speaks a different language. You shouldn't have to learn all of them." eyebrow="REF-02 · the abstraction layer">
    <div className="compare-grid">
      <CodeCard tone="bad" title="— without an abstraction layer">{`provider_a.res.data.subject.bvn_no
provider_a.res.data.subject.full_nm

smile.res.result.PartnerParams.bvn
smile.res.result.FullName

// two clients, two shapes,
// two sets of error codes`}</CodeCard>
      <CodeCard tone="good" title="— with verifi.io">{`res.matched.first_name
res.matched.last_name
res.status
res.provider

// one shape, one set of
// error codes, always`}</CodeCard>
    </div>
    <section className="section-block"><div className="eyebrow">REF-03 · core, MVP</div><h2>What ships first</h2><div className="feature-grid">{features.map(([Icon,title,body]) => <div className="feature-card card-hover" key={title}><Icon size={18}/><h3>{title}</h3><p>{body}</p></div>)}</div></section>
  </Page>;
}

function CodeCard({tone,title,children}) { return <div className={`code-card ${tone}`}><div>{title}</div><pre>{children}</pre></div>; }

function Docs() {
  const [tab,setTab] = useState("python");
  const code = tab === "python" ? `from verifi import Client

client = Client(api_key="sk_test_...")

result = client.verify(
    type="bvn",
    identifier="22134567890",
    consent_reference="cst_7f0a1",
)

print(result.status)      # "verified"
print(result.matched)     # normalized fields`
    : `import { Client } from "@verifi/node";

const client = new Client({ apiKey: "sk_test_..." });

const result = await client.verify({
  type: "nin",
  identifier: "90123456789",
  consentReference: "cst_7f0a1",
});

console.log(result.status);   // "verified"
console.log(result.matched);  // normalized fields`;

  return <Page title="Integrate before you touch a single real BVN." eyebrow="REF-05 · sandbox first">
    <p className="lead narrow">Sandbox keys return realistic fixtures shaped exactly like production responses. No live PII, no per-call cost, no waiting on provider approval to start building.</p>
    <div className="dev-points"><span><Webhook size={15}/> Webhooks for async results</span><span><Gauge size={15}/> Rate limits shown in headers</span></div>
    <div className="code-window"><div className="tabs">{["python","node"].map(t => <button className={tab===t?"active":""} onClick={()=>setTab(t)} key={t}>{t==="python"?"python":"typescript"}</button>)}</div><pre>{code}</pre></div>
  </Page>;
}

function Roadmap() {
  return <Page title="Built in order, not all at once" eyebrow="REF-06 · what's next">
    <div className="roadmap">{roadmap.map(([tag,title,items]) => <div className="roadmap-item" key={tag}><b>{tag}</b><h3>{title}</h3><ul>{items.map(i=><li key={i}>{i}</li>)}</ul></div>)}</div>
  </Page>;
}

function Lifecycle() {
  const steps = [
    ["01","Consent checked","The request must carry a granted consent reference or it never leaves the gateway."],
    ["02","Provider selected","The adapter layer picks a provider for the requested ID type — Provider A or Smile Identity today."],
    ["03","Call normalized","Fields, status codes, and error shapes are mapped to one schema before anything reaches your client."],
    ["04","Result returned","Sync where the provider supports it, or delivered by webhook once the check completes."]
  ];
  return <Page title="What happens after you call /v1/verify" eyebrow="REF-04 · request lifecycle"><div className="steps">{steps.map(([n,t,d])=><div key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>)}</div></Page>;
}

function Page({eyebrow,title,children}) {
  return <Layout><main className="page container"><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1>{children}</main></Layout>;
}

function Home() {
  return <Layout><Hero/><section className="border-section"><div className="container provider-grid">{providers.map(p=><div className="provider-card card-hover" key={p.name}><div><div className="provider-name"><span/>{p.name}</div><p>{p.detail}</p></div><div className="provider-status"><b>operational</b><small>{p.latency} avg</small></div></div>)}</div></section><Product/><Lifecycle/><Docs/><Roadmap/><section className="cta"><div className="grain"/><h2>Verify one identity for free.<br/>See the normalized response yourself.</h2><div className="button-row center"><button className="btn btn-primary large">Get sandbox keys <ArrowRight size={15}/></button><button className="btn btn-light large">Read the API reference</button></div></section></Layout>;
}

export default Hero;