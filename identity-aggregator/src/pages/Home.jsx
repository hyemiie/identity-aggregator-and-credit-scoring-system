import React from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Layers,
  RefreshCw,
  ShieldCheck,
  FlaskConical,
  KeyRound,
  AlertTriangle,
  Webhook,
  Gauge,
  Star,
  Code,
} from "lucide-react";
import "../style/home.css";

const Home = () => {
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
}`,
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

  const activeProvider = [
    {
      name: "Provider A",
      status: "operational",
      detail: "BVN · NIN · CAC — Nigeria",
      latency: "412ms",
    },
    {
      name: "Smile Identity",
      status: "operational",
      detail: "Ghana Card · BVN — NG / GH",
      latency: "780ms",
    },
  ];

  
const idTypes = [
  { code: "BVN", label: "Bank Verification Number", country: "NG" },
  { code: "NIN", label: "National Identity Number", country: "NG" },
  { code: "CAC", label: "Corporate Affairs Registry", country: "NG" },
  { code: "GHA-CARD", label: "Ghana Card", country: "GH" },
  { code: "TIN", label: "Tax Identification Number", country: "NG" }
];

  return (
    <div>
      {/* <a className="brand" href="/"><span className="brand-mark"><Check size={16}/></span><span>verifi.io</span></a> */}

      <header className="site-header">
        <div className="container nav">
          {/* <a className="brand" href="/"><span className="brand-mark"><Check size={16}/></span><span>verifi.io</span></a> */}
          <nav>
            {/* <a href="/product">Product</a> */}
            <a href="/providers">Providers</a>
            <a href="/docs">Docs</a>
            <a href="/roadmap">Roadmap</a>
          </nav>
          <div className="nav-actions">
            {/* <a className="docs-link" href="/docs">Read the docs</a> */}
            <button className="btn btn-primary">
              Get API keys <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="hero-center">
        <div className="flow-chart"><div className="types">
        <div className="eyebrow">Verification types live today</div>
        <div className="chip-row">{idTypes.map(id => <span className="chip" key={id.code}><b>{id.code}</b><small>{id.country}</small></span>)}</div>
      </div></div>
        <div className="terminal">
          <div className="terminal-bar">
            <div className="dots">
              {/* <i /> */}
              <a className="brand" href="/">
                <span className="brand-mark">
                  <Check size={16} />
                </span>
                <span>verifi.io</span>
              </a>
            </div>
            <span>
              <Code />
            </span>
          </div>
          <div className="hero-copy">
            Stop writing a new integration for every KYC provider. Send one
            request to <code>/v1/verify</code> and get BVN, NIN, CAC, or Ghana
            Card results back in the same shape, every time
          </div>
          <pre>{requestJson}</pre>
          {/* <div className="terminal-route"><ChevronRight size={13} /><span>routed to <b>{activeProvider}</b> · normalized on return</span></div>
            <pre className="response">{responsesByProvider[activeProvider]}</pre> */}
        </div>
        
      </div>
    </div>
  );
};

export default Home;
