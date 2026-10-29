import { Ministry, Proposal, ProposalComment, AnonymousNotification, BlueprintCommit } from './types';

export const INITIAL_MINISTRIES: Ministry[] = [
  {
    id: "m-ports",
    slug: "ports-logistics",
    name_en: "Ports, Shipping & Maritime Logistics",
    name_bn: "নৌপরিবহন, বন্দর ও মেরিটাইম লজিস্টিকস",
    target_10y_gdp_impact_usd: 85000000000,
    lead_vision_statement: "Transform Chattogram and Mongla into 24/7 automated transshipment hubs with sub-12h turnarounds.",
    icon_name: "Ship",
    active_bottlenecks_count: 14,
    open_prs_count: 28,
    category: "Infrastructure"
  },
  {
    id: "m-education",
    slug: "education-2035",
    name_en: "National Education & AI-Era Vocational Modernization",
    name_bn: "জাতীয় শিক্ষা ও কৃত্রিম বুদ্ধিমত্তা-যুগের কারিগরি রূপান্তর",
    target_10y_gdp_impact_usd: 120000000000,
    lead_vision_statement: "Convert 64 polytechnic campuses into 24/7 global tech training and high-value certified skills engines.",
    icon_name: "GraduationCap",
    active_bottlenecks_count: 19,
    open_prs_count: 42,
    category: "Human Capital"
  },
  {
    id: "m-customs",
    slug: "customs-revenue-tax",
    name_en: "Revenue, Customs & Zero-Friction NBR Rails",
    name_bn: "রাজস্ব, শুল্ক ও দুর্নীতিমুক্ত এনবিআর অটোমেশন",
    target_10y_gdp_impact_usd: 140000000000,
    lead_vision_statement: "Eliminate manual extortion gates; deploy 100% digital single-window clearance with automated AI risk engine.",
    icon_name: "FileSpreadsheet",
    active_bottlenecks_count: 22,
    open_prs_count: 51,
    category: "Governance"
  },
  {
    id: "m-energy",
    slug: "power-energy-grid",
    name_en: "Power, Energy & Sovereign Smart Grid",
    name_bn: "বিদ্যুৎ, জ্বালানি ও সার্বভৌম স্মার্ট গ্রিড",
    target_10y_gdp_impact_usd: 65000000000,
    lead_vision_statement: "Liquidate capacity charge syndicates; transition to high-voltage renewable wheeling and automated smart dispatch.",
    icon_name: "Zap",
    active_bottlenecks_count: 11,
    open_prs_count: 24,
    category: "Infrastructure"
  },
  {
    id: "m-land",
    slug: "digital-public-infra-land",
    name_en: "Digital Public Infra & Immutable Land Records",
    name_bn: "ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার ও ব্লকচেইন ভূমি রেকর্ড",
    target_10y_gdp_impact_usd: 95000000000,
    lead_vision_statement: "Cryptographically anchor all land mouza maps and deed chains to permanently end forgery and grabber litigations.",
    icon_name: "Database",
    active_bottlenecks_count: 16,
    open_prs_count: 37,
    category: "Technology"
  },
  {
    id: "m-remittance",
    slug: "financial-rails-remittance",
    name_en: "Financial Rails, Remittance & Digital Taka",
    name_bn: "আর্থিক অবকাঠামো, রেমিট্যান্স ও ডিজিটাল টাকা",
    target_10y_gdp_impact_usd: 90000000000,
    lead_vision_statement: "Zero-fee direct sovereign mobile remittance corridors in Middle East and Southeast Asia to extinguish informal hundi.",
    icon_name: "CircleDollarSign",
    active_bottlenecks_count: 9,
    open_prs_count: 31,
    category: "Economy"
  },
  {
    id: "m-rmg",
    slug: "rmg-textile-circularity",
    name_en: "RMG, Circular Textiles & Industrial Automation",
    name_bn: "পোশাক শিল্প, সার্কুলার টেক্সটাইল ও অটোমেশন",
    target_10y_gdp_impact_usd: 110000000000,
    lead_vision_statement: "Scale high-margin technical garments, zero-water dyeing, and sovereign supply chain tracking to reach $100B exports.",
    icon_name: "Shirt",
    active_bottlenecks_count: 13,
    open_prs_count: 29,
    category: "Economy"
  },
  {
    id: "m-health",
    slug: "healthcare-pharma-biotech",
    name_en: "Public Healthcare, Generic Pharma & Biotech Rails",
    name_bn: "জনস্বাস্থ্য, জেনেরিক ফার্মা ও বায়োটেক উদ্ভাবন",
    target_10y_gdp_impact_usd: 80000000000,
    lead_vision_statement: "Establish decentralized primary care telemetry, bulk API molecule manufacturing, and automated drug price transparency.",
    icon_name: "HeartPulse",
    active_bottlenecks_count: 17,
    open_prs_count: 33,
    category: "Human Capital"
  },
  {
    id: "m-agri",
    slug: "food-security-agriculture",
    name_en: "Sovereign Food Security & Precision Cold-Chains",
    name_bn: "সার্বভৌম খাদ্য নিরাপত্তা ও কোল্ড-চেইন অবকাঠামো",
    target_10y_gdp_impact_usd: 70000000000,
    lead_vision_statement: "Direct farm-to-city rail distribution, IoT grain silo monitoring, and eradication of middleman extortion cartels.",
    icon_name: "Sprout",
    active_bottlenecks_count: 15,
    open_prs_count: 26,
    category: "Economy"
  },
  {
    id: "m-semi",
    slug: "semiconductor-electronics",
    name_en: "Semiconductor, Microchips & High-Tech Hardware",
    name_bn: "সেমিকন্ডাক্টর, চিপ ডিজাইন ও আধুনিক হার্ডওয়্যার",
    target_10y_gdp_impact_usd: 55000000000,
    lead_vision_statement: "Train 50,000 VLSI chip engineers and establish sovereign packaging and testing cleanrooms with tax-free fab zones.",
    icon_name: "Cpu",
    active_bottlenecks_count: 8,
    open_prs_count: 19,
    category: "Technology"
  },
  {
    id: "m-judiciary",
    slug: "judicial-modernization",
    name_en: "Judicial Modernization & Case Liquidation Engine",
    name_bn: "বিচার বিভাগীয় আধুনিকায়ন ও মামলা নিষ্পত্তির ইঞ্জিন",
    target_10y_gdp_impact_usd: 35000000000,
    lead_vision_statement: "Liquidate 4 million pending court cases through digitized evidence, mandatory ADR, and AI summary briefs.",
    icon_name: "Scale",
    active_bottlenecks_count: 14,
    open_prs_count: 22,
    category: "Governance"
  },
  {
    id: "m-telecom",
    slug: "telecom-subsea-space",
    name_en: "Telecom, Subsea Cables & Space Assets",
    name_bn: "টেলিকম, সাবমেরিন ক্যাবল ও মহাকাশ প্রযুক্তি",
    target_10y_gdp_impact_usd: 30000000000,
    lead_vision_statement: "Diversify into 4 independent subsea cable landings and domestic low-earth-orbit constellation ground stations.",
    icon_name: "Radio",
    active_bottlenecks_count: 6,
    open_prs_count: 15,
    category: "Infrastructure"
  },
  {
    id: "m-procure",
    slug: "public-procurement-egp",
    name_en: "Zero-Kickback Public Procurement (e-GP 2.0)",
    name_bn: "দুর্নীতিমুক্ত সরকারি ক্রয় ও ডিজিটাল দরপত্র (e-GP)",
    target_10y_gdp_impact_usd: 40000000000,
    lead_vision_statement: "Algorithmic vendor qualification, open contract pricing indexes, and real-time ledger audits for every public taka spent.",
    icon_name: "CheckSquare",
    active_bottlenecks_count: 12,
    open_prs_count: 27,
    category: "Governance"
  },
  {
    id: "m-environment",
    slug: "environmental-delta-physics",
    name_en: "Delta 2100 Physics, River Dredging & Flood Defense",
    name_bn: "ডেল্টা ২১০০, নদী ড্রেজিং ও বৈজ্ঞানিক বন্যা নিয়ন্ত্রণ",
    target_10y_gdp_impact_usd: 45000000000,
    lead_vision_statement: "Scientific river training, permanent silt reclamation into new agricultural delta polders, and automated flood gates.",
    icon_name: "Waves",
    active_bottlenecks_count: 10,
    open_prs_count: 20,
    category: "Infrastructure"
  },
  {
    id: "m-civil",
    slug: "civil-service-meritocracy",
    name_en: "Civil Service & Meritocratic Bureaucracy",
    name_bn: "জনপ্রশাসন ও মেধাভিত্তিক আমলাতন্ত্র",
    target_10y_gdp_impact_usd: 25000000000,
    lead_vision_statement: "Abolish discretionary file transfers; benchmark administrative promotion strictly on quantifiable civic KPIs.",
    icon_name: "Award",
    active_bottlenecks_count: 11,
    open_prs_count: 18,
    category: "Governance"
  },
  {
    id: "m-anticorruption",
    slug: "anti-corruption-automated-audit",
    name_en: "Automated Sovereign Anti-Corruption Matrix",
    name_bn: "স্বয়ংক্রিয় সার্বভৌম দুর্নীতি দমন ও নিরীক্ষা ব্যবস্থা",
    target_10y_gdp_impact_usd: 50000000000,
    lead_vision_statement: "Cross-link banking wire anomalies, tax declarations, and public procurement ledgers with real-time discrepancy flags.",
    icon_name: "ShieldAlert",
    active_bottlenecks_count: 18,
    open_prs_count: 36,
    category: "Governance"
  },
  {
    id: "m-railways",
    slug: "railways-intermodal-freight",
    name_en: "High-Speed Rail & Intermodal Container Lines",
    name_bn: "রেলওয়ে ও মালবাহী কন্টেইনার করিডোর",
    target_10y_gdp_impact_usd: 50000000000,
    lead_vision_statement: "Dedicated double-track freight corridor linking Chattogram to Dhaka ICD in 4 hours flat, bypassing highway congestion.",
    icon_name: "Train",
    active_bottlenecks_count: 9,
    open_prs_count: 21,
    category: "Infrastructure"
  },
  {
    id: "m-overseas",
    slug: "overseas-employment-welfare",
    name_en: "Overseas Labor Migration & Fair Recruitment",
    name_bn: "প্রবাসী কল্যাণ ও দালালমুক্ত বৈদেশিক কর্মসংস্থান",
    target_10y_gdp_impact_usd: 40000000000,
    lead_vision_statement: "Eradicate recruiting syndicates; offer direct state-guaranteed visas, multilingual legal aid, and skill verification.",
    icon_name: "PlaneTakeoff",
    active_bottlenecks_count: 14,
    open_prs_count: 25,
    category: "Human Capital"
  },
  {
    id: "m-heavyindustry",
    slug: "heavy-industry-shipbuilding",
    name_en: "Green Shipbuilding & Heavy Fabrication",
    name_bn: "ভারী শিল্প ও আন্তর্জাতিক মানের পরিবেশবান্ধব জাহাজ নির্মাণ",
    target_10y_gdp_impact_usd: 30000000000,
    lead_vision_statement: "Transform ship recycling into certified circular steel mills and scale export shipyards for coastal container vessels.",
    icon_name: "Anchor",
    active_bottlenecks_count: 7,
    open_prs_count: 14,
    category: "Economy"
  },
  {
    id: "m-localgov",
    slug: "local-governance-smart-cities",
    name_en: "Municipal Decentralization & Smart Cities",
    name_bn: "স্থানীয় সরকার বিকেন্দ্রীকরণ ও স্মার্ট নগর পরিকল্পনা",
    target_10y_gdp_impact_usd: 35000000000,
    lead_vision_statement: "Empower upazila councils with local revenue autonomy, underground utility ducts, and automated waste-to-energy plants.",
    icon_name: "Building",
    active_bottlenecks_count: 11,
    open_prs_count: 17,
    category: "Governance"
  },
  {
    id: "m-defense",
    slug: "defense-cyber-sovereignty",
    name_en: "Cyber-Sovereignty, Defense & Border Tech",
    name_bn: "সাইবার সার্বভৌমত্ব, জাতীয় প্রতিরক্ষা ও স্মার্ট সীমান্ত",
    target_10y_gdp_impact_usd: 45000000000,
    lead_vision_statement: "Zero-dependency national cryptography, domestic drone surveillance arrays, and 24/7 sovereign critical infrastructure shielding.",
    icon_name: "ShieldCheck",
    active_bottlenecks_count: 8,
    open_prs_count: 16,
    category: "Technology"
  },
  {
    id: "m-youth",
    slug: "youth-entrepreneurship-vc",
    name_en: "Youth Entrepreneurship & Sovereign Micro-VC",
    name_bn: "যুব উদ্যোক্তা উন্নয়ন ও সার্বভৌম ভেঞ্চার ফান্ড",
    target_10y_gdp_impact_usd: 20000000000,
    lead_vision_statement: "No-collateral equity funding for university and polytechnic founders building export-oriented hardware and deep tech.",
    icon_name: "Sparkles",
    active_bottlenecks_count: 6,
    open_prs_count: 12,
    category: "Human Capital"
  },
  {
    id: "m-minerals",
    slug: "mineral-resources-rare-earth",
    name_en: "Critical Minerals & Coastal Heavy Sands",
    name_bn: "খনিজ সম্পদ ও উপকূলীয় ভারী বালু আহরণ",
    target_10y_gdp_impact_usd: 20000000000,
    lead_vision_statement: "Commercial extraction and refining of zircon, rutile, and monazite from Cox's Bazar and Brahmaputra riverbeds.",
    icon_name: "Gem",
    active_bottlenecks_count: 5,
    open_prs_count: 10,
    category: "Economy"
  },
  {
    id: "m-culture",
    slug: "cultural-heritage-media",
    name_en: "Cultural Sovereignty, Media & Heritage Archiving",
    name_bn: "সাংস্কৃতিক ঐতিহ্য ও ডিজিটাল মিডিয়া আর্কাইভ",
    target_10y_gdp_impact_usd: 10000000000,
    lead_vision_statement: "High-resolution digital archiving of 1,000 years of Bengali historical texts, folk heritage, and global OTT co-productions.",
    icon_name: "BookOpen",
    active_bottlenecks_count: 4,
    open_prs_count: 8,
    category: "Human Capital"
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "prop-ports-01",
    ministry_id: "m-ports",
    ministry_slug: "ports-logistics",
    author_id: "usr-exp-01",
    author_identity_type: "verified_expert",
    author_badge: "[Verified: Senior Port Logistics Lead • 12y exp]",
    title: "Starlink-Integrated Yard Automation & OCR Gate-Pass System for Chattogram Port",
    existing_bottleneck: "Manual paper gate-passes cause 36-hour container dwell delays at Chattogram Port gates. Forwarders are coerced into paying $45-$90 per truck in speed-premiums to syndicate gate-clerks and local police checkpoints.",
    hidden_root_cause: "The deliberate refusal by the port administration to integrate the ASYCUDA World SQL server with the terminal TOS database via an encrypted API, forcing truckers to obtain physical ink endorsements across 4 separate desks.",
    physics_limit_fix: "Mount automated RFID and OCR scanning cameras directly to existing gantries, pipe encrypted webhooks to the National Single Window, and auto-dispatch digital yard slots. Physical hardware installation and optical fiber splicing takes exactly 7 days.",
    estimated_days_to_execute: 7,
    projected_economic_roi_usd: 1850000000,
    status: "verified_approved",
    version: 1,
    git_commit_sha: "a94f1b2",
    ai_alignment_score: 97.4,
    ai_moderation_flag: false,
    ai_summary: "Replaces 4-desk physical signature extortion with encrypted webhooks and OCR terminal gantries. Yields $1.85B in annual turnaround savings in Chattogram.",
    upvotes_count: 342,
    has_upvoted: true,
    comments_count: 24,
    created_at: "2026-10-15T09:30:00Z",
    updated_at: "2026-10-28T14:20:00Z"
  },
  {
    id: "prop-edu-02",
    ministry_id: "m-education",
    ministry_slug: "education-2035",
    author_id: "usr-anon-02",
    author_identity_type: "anonymous",
    author_badge: "[Anonymous Protocol ID: #8F2A-04]",
    title: "Convert 64 Polytech Campuses into 24/7 AI-Annotator & Japanese Nursing Hubs",
    existing_bottleneck: "Government polytechnic institutes operate on single 9am-2pm shifts with outdated 1990s curriculum. Middleman recruitment syndicates charge $5,000 per untrained migrant laborer who ends up in sub-standard low-wage construction.",
    hidden_root_cause: "Local principal cartels rent out idle campus workshops during nights for unregulated commercial fabric cutting and split kickbacks, actively resisting national modernization programs.",
    physics_limit_fix: "Equip 64 campuses with high-speed Starlink / optical uplinks, refurbished 32GB RAM workstations, and standardized bilingual JLPT N4 / AI-dataset annotation curricula. Procurement and deployment requires 30 days.",
    estimated_days_to_execute: 30,
    projected_economic_roi_usd: 1500000000,
    status: "committed_to_os",
    version: 2,
    git_commit_sha: "8e71c0d",
    ai_alignment_score: 95.8,
    ai_moderation_flag: false,
    ai_summary: "Double-shifts unused state technical infrastructure into export-ready workforce training centers. Generates $1.5B/yr in higher skilled worker foreign remittance.",
    upvotes_count: 489,
    has_upvoted: false,
    comments_count: 38,
    created_at: "2026-10-10T12:00:00Z",
    updated_at: "2026-10-27T18:40:00Z"
  },
  {
    id: "prop-customs-03",
    ministry_id: "m-customs",
    ministry_slug: "customs-revenue-tax",
    author_id: "usr-exp-03",
    author_identity_type: "verified_expert",
    author_badge: "[Verified: Customs Clearing & Forwarding Specialist • 16y exp]",
    title: "100% Automated Green-Channel Customs Release via AI Invoice Anomaly Engine",
    existing_bottleneck: "Over 85% of import containers are subjected to manual physical stripping and 'assessment inspection'. This causes 7-day port congestion and extracts $200M/year in bribe negotiations to avoid bogus demurrage flags.",
    hidden_root_cause: "Customs revenue targets are artificially met by holding shipments hostage until end-of-month 'voluntary reassessments' with arbitrary uplift valuations that benefit corrupt appraisers.",
    physics_limit_fix: "Deploy open-source automated HS-code tariff validation with automated container X-ray optical scanning. Pre-clear 90% of compliant corporate imports before vessel berthing. Pure software deployment takes 10 days.",
    estimated_days_to_execute: 10,
    projected_economic_roi_usd: 2400000000,
    status: "community_review",
    version: 1,
    git_commit_sha: "b45a299",
    ai_alignment_score: 96.2,
    ai_moderation_flag: false,
    ai_summary: "Automates 90% of import tariff assessment using pre-arrival AI invoice audits and automated scanner feeds.",
    upvotes_count: 278,
    has_upvoted: false,
    comments_count: 19,
    created_at: "2026-10-18T08:15:00Z",
    updated_at: "2026-10-28T11:00:00Z"
  },
  {
    id: "prop-energy-04",
    ministry_id: "m-energy",
    ministry_slug: "power-energy-grid",
    author_id: "usr-exp-04",
    author_identity_type: "verified_expert",
    author_badge: "[Verified: Electrical Grid Systems Engineer • BPDB]",
    title: "Automated Capacity-Charge Auditing & Instant Rooftop Solar Wheeling Rails",
    existing_bottleneck: "Government pays $2.2B annually in idle capacity charges to quick rental diesel plants that run at < 22% plant load factor, while RMG factory owners are denied permits to wheel rooftop solar to peer grids.",
    hidden_root_cause: "Long-term opaque IPP contracts with sovereign indemnity clauses signed without competitive bidding, shielded by special indemnity acts.",
    physics_limit_fix: "Enforce digital smart-meter telemetry at every power substation to verify actual turbine rotation in real-time, instantly disallowing capacity charge payouts for non-spinning reserves. Protocol change takes 14 days.",
    estimated_days_to_execute: 14,
    projected_economic_roi_usd: 2100000000,
    status: "verified_approved",
    version: 1,
    git_commit_sha: "7f14e21",
    ai_alignment_score: 94.7,
    ai_moderation_flag: false,
    ai_summary: "Stops fraudulent standby capacity payments through live smart meter telemetry across national 132kV/230kV grids.",
    upvotes_count: 412,
    has_upvoted: true,
    comments_count: 31,
    created_at: "2026-10-08T15:00:00Z",
    updated_at: "2026-10-26T16:30:00Z"
  },
  {
    id: "prop-land-05",
    ministry_id: "m-land",
    ministry_slug: "digital-public-infra-land",
    author_id: "usr-anon-05",
    author_identity_type: "anonymous",
    author_badge: "[Anonymous Protocol ID: #4A19-91]",
    title: "Cryptographic Anchor for 64 Districts Mouza Boundary Coordinates on Public Ledger",
    existing_bottleneck: "Over 70% of violent civil disputes and 3.2 million court cases originate from conflicting hand-drawn land mutation maps and duplicate deed sales by land mafias with AC Land office collusion.",
    hidden_root_cause: "Land records are preserved in decaying paper registers ('Khothian') where peons and corrupt surveyors physically razor-blade pages and insert forged inheritance lines.",
    physics_limit_fix: "Fly RTK-GPS drones over each mouza, capture millimeter polygon boundaries, hash the coordinates to a sovereign timestamped ledger, and render mutation instant with biometric citizen ID. Pilot district deployment in 21 days.",
    estimated_days_to_execute: 21,
    projected_economic_roi_usd: 3500000000,
    status: "committed_to_os",
    version: 1,
    git_commit_sha: "32d890b",
    ai_alignment_score: 98.1,
    ai_moderation_flag: false,
    ai_summary: "High-accuracy drone polygon mapping with cryptographic deed timestamps eradicates 70% of land ownership litigation.",
    upvotes_count: 520,
    has_upvoted: true,
    comments_count: 45,
    created_at: "2026-10-02T10:00:00Z",
    updated_at: "2026-10-25T09:12:00Z"
  },
  {
    id: "prop-remittance-06",
    ministry_id: "m-remittance",
    ministry_slug: "financial-rails-remittance",
    author_id: "usr-anon-06",
    author_identity_type: "anonymous",
    author_badge: "[Anonymous Protocol ID: #9D02-55]",
    title: "Zero-Spread Direct Sovereign Remittance Rail (Gulf-Dhaka Instant Settlement)",
    existing_bottleneck: "12 million expatriates lose $1.4B/year to intermediary money transfer fees and exchange rate manipulation, forcing 45% of remittances into underground Hundi rackets.",
    hidden_root_cause: "Commercial banks hold incoming forex abroad for weeks to trade in non-deliverable forwards (NDFs) rather than crediting village families instantly at interbank market rate.",
    physics_limit_fix: "Bangladesh Bank issues direct API gateway connecting UAE/KSA instant payment systems (IPP/Aani) to domestic bKash/Nagad/Bank accounts at 0% fee with 2.5% instant sovereign bonus. Deployment takes 15 days.",
    estimated_days_to_execute: 15,
    projected_economic_roi_usd: 4200000000,
    status: "verified_approved",
    version: 1,
    git_commit_sha: "51c9fa0",
    ai_alignment_score: 98.9,
    ai_moderation_flag: false,
    ai_summary: "Instant 0% remittance rail connects Middle East payment switches directly to Bangladesh mobile wallets, routing billions away from black market hundi.",
    upvotes_count: 610,
    has_upvoted: true,
    comments_count: 52,
    created_at: "2026-10-05T07:45:00Z",
    updated_at: "2026-10-29T02:10:00Z"
  }
];

export const INITIAL_COMMENTS: Record<string, ProposalComment[]> = {
  "prop-ports-01": [
    {
      id: "c-port-1",
      proposal_id: "prop-ports-01",
      author_id: "u-rev-1",
      author_badge: "[Verified: Marine Terminal Operations Manager • 15y]",
      author_identity_type: "verified_expert",
      content: "Endorsed wholeheartedly. We tested an automated gate at New Mooring Container Terminal (CCT-2) in 2024 and dwell time dropped from 38 hours to 9.2 minutes. The only reason it stalled was customs refusal to authorize automated digital releases.",
      stance: "endorse",
      technical_evidence_url: "https://cpa.gov.bd/operational-telemetry/gate-automation-trial",
      helpful_votes: 38,
      has_voted_helpful: true,
      created_at: "2026-10-16T11:20:00Z"
    },
    {
      id: "c-port-2",
      proposal_id: "prop-ports-01",
      author_id: "u-rev-2",
      author_badge: "[Verified: Electrical & Automation Engineer • Port Authority]",
      author_identity_type: "verified_expert",
      content: "Challenge on physical timeline: 7 days is feasible for software and OCR mountings, but the backhaul power conduits on Gate 4 and Gate 5 flood during monsoon high tides. You must mandate IP68 waterproof enclosures and dedicated solar battery backup.",
      stance: "challenge",
      technical_evidence_url: "https://cpa.gov.bd/infrastructure-specs/gate-power-conduits",
      helpful_votes: 27,
      has_voted_helpful: false,
      created_at: "2026-10-17T14:05:00Z"
    },
    {
      id: "c-port-3",
      proposal_id: "prop-ports-01",
      author_id: "u-rev-3",
      author_badge: "[Anonymous Protocol ID: #8F2A-04]",
      author_identity_type: "anonymous",
      content: "Nuance to consider: Gate clerks will stage a wildcat go-slow strike under the guise of union safety protests. The executive order must specify that manual gate registers are deemed illegal contraband after Day 7.",
      stance: "nuance",
      helpful_votes: 19,
      has_voted_helpful: false,
      created_at: "2026-10-18T09:40:00Z"
    },
    {
      id: "c-port-4",
      proposal_id: "prop-ports-01",
      author_id: "u-rev-4",
      author_badge: "[Verified: Senior Customs Revenue Officer]",
      author_identity_type: "verified_expert",
      content: "Adding technical evidence: ASYCUDA World already possesses the JSON webhook event trigger `OUT_GATE_AUTHORIZE`. No new core software is required on the customs end; simply opening port 8443 on the secure VPN gateway completes integration.",
      stance: "evidence_addition",
      technical_evidence_url: "https://nbr.gov.bd/asycuda/api-doc-v4.1",
      helpful_votes: 33,
      has_voted_helpful: true,
      created_at: "2026-10-19T16:15:00Z"
    }
  ],
  "prop-edu-02": [
    {
      id: "c-edu-1",
      proposal_id: "prop-edu-02",
      author_id: "u-ed-1",
      author_badge: "[Verified: Polytech Faculty Association Secretary]",
      author_identity_type: "verified_expert",
      content: "The Bogura and Cumilla polytechnic campuses have fully air-conditioned computer labs that sit locked after 2 PM daily. Converting them to night-shift remote annotation hubs requires zero civil construction—only software licenses and satellite internet.",
      stance: "endorse",
      technical_evidence_url: "https://techedu.gov.bd/lab-inventory-2025",
      helpful_votes: 29,
      has_voted_helpful: true,
      created_at: "2026-10-11T13:40:00Z"
    },
    {
      id: "c-edu-2",
      proposal_id: "prop-edu-02",
      author_id: "u-ed-2",
      author_badge: "[Anonymous Protocol ID: #9D02-55]",
      author_identity_type: "anonymous",
      content: "Technical challenge: The Japanese Nursing credential requires mandatory clinical hospital rotation hours. The polytechnic campus alone cannot certify clinical skills without tying into district 250-bed general hospitals.",
      stance: "challenge",
      technical_evidence_url: "https://dghs.gov.bd/nursing-standards/clinical-hours",
      helpful_votes: 18,
      has_voted_helpful: false,
      created_at: "2026-10-12T17:22:00Z"
    }
  ]
};

export const INITIAL_NOTIFICATIONS: AnonymousNotification[] = [
  {
    id: "notif-01",
    recipient_handle: "Anon-BayBengal-409",
    proposal_id: "prop-ports-01",
    proposal_title: "Starlink-Integrated Yard Automation & OCR Gate-Pass System",
    title: "Proposal Ratified & Committed to OS Repository",
    message: "Your first-principles physics fix for Chattogram Port has been audited by National Assembly domain engineers and committed to the master branch with SHA #a94f1b2.",
    blueprint_section_reference: "Chapter 3: Maritime Logistics, Section 4.2.1 'Terminal Gate Latency Liquidation'",
    is_read: false,
    created_at: "2026-10-28T14:20:00Z"
  },
  {
    id: "notif-02",
    recipient_handle: "Anon-BayBengal-409",
    proposal_id: "prop-edu-02",
    proposal_title: "Convert 64 Polytech Campuses into 24/7 AI-Annotator Hubs",
    title: "High Domain Consensus Reached (96.4%)",
    message: "14 verified educational instructors and tech leads have endorsed your specification. A formal state pull request has been generated for Year-1 Blitz budget allocation.",
    blueprint_section_reference: "Chapter 7: Human Capital Modernization, Clause 12.8 'Campus Dual-Shift Mandate'",
    is_read: true,
    created_at: "2026-10-25T19:00:00Z"
  }
];

export const INITIAL_BLUEPRINT_COMMITS: BlueprintCommit[] = [
  {
    sha: "a94f1b2",
    author: "National Assembly Engineering Council",
    author_badge: "[Verified: State Systems Architect]",
    message: "ratify(ports): implement sub-12m OCR and RFID automated gate clearance protocol",
    ministry_slug: "ports-logistics",
    section: "Chapter 3: Maritime Logistics • Clause 4.2.1",
    timestamp: "2026-10-28T14:20:00Z",
    lines_added: 142,
    lines_removed: 28,
    status: "merged",
    spec_markdown: `# Operational Directive BD-2.0-PORT-401
## Title: Mandatory Optical Gate Telemetry & Asynchronous Customs Authorization

### 1. Physics Constraint Mandate
1. All 12 entry and exit gates of Chattogram Port shall be governed by automated optical license plate recognition (ALPR) and ISO 6346 container number OCR cameras.
2. Truck dwell time at terminal gates is legally capped at **180 seconds** per freight vehicle.
3. Physical paper gate registers, manual gate pass chits, and cash toll booths are declared illegal contraband within Port Protected Areas.

### 2. Digital Single-Window Protocol
- NBR ASYCUDA World servers must broadcast asynchronous JSON webhooks (\`EVENT_OUT_GATE_CLEARANCE\`) directly to the port TOS database.
- Port gates must open automatically upon cryptographically matching container RFID tags with customs release hashes.
- Failure of customs systems to respond within 3 seconds automatically triggers emergency provisional release against bonded bank guarantee.`
  },
  {
    sha: "8e71c0d",
    author: "National Education Modernization Taskforce",
    author_badge: "[Verified: Human Capital Syndicate Lead]",
    message: "feat(education): mandate 24/7 dual-shift utilization of 64 polytechnic facilities",
    ministry_slug: "education-2035",
    section: "Chapter 7: Human Capital • Clause 12.8",
    timestamp: "2026-10-27T18:40:00Z",
    lines_added: 218,
    lines_removed: 45,
    status: "merged",
    spec_markdown: `# Sovereign Education Mandate BD-2.0-EDU-104
## Title: The 24/7 State Campus Utilization and High-Earning Vocational Blitz

### 1. Idle Asset Requisition
1. Government polytechnic institutes, technical training centers (TTC), and vocational schools shall operate on 3 continuous 8-hour shifts (24/7).
2. Day shift (08:00 - 15:00): Traditional accredited engineering diploma.
3. Evening shift (15:30 - 22:30): AI dataset annotation, robotics maintenance, and international language certifications (Japanese, German).
4. Night shift (23:00 - 07:00): Global remote digital freelancing and overseas customer engineering support.

### 2. High-Speed Sovereign Infrastructure
- Starlink / direct optical connections provisioned by Bangladesh Submarine Cable Company Ltd (BSCCL).
- State-guaranteed zero-interest equipment leases for graduating student work syndicates.`
  },
  {
    sha: "32d890b",
    author: "Digital Public Infrastructure Assembly",
    author_badge: "[Verified: Chief Land Registrar & Cryptographer]",
    message: "feat(land): anchor mouza polygon boundary coordinates to sovereign timestamped chain",
    ministry_slug: "digital-public-infra-land",
    section: "Chapter 5: Digital Public Rails • Clause 8.1",
    timestamp: "2026-10-25T09:12:00Z",
    lines_added: 305,
    lines_removed: 89,
    status: "merged",
    spec_markdown: `# Sovereign Land Ledger Standard BD-2.0-LAND-001
## Title: Immutable Geographic Coordinates as Legal Deed Definition

### 1. Boundary First-Principles
1. No deed of sale, mortgage, or inheritance partition shall be valid in Bangladesh without RTK-GPS centimeter-accurate polygon boundary coordinates.
2. Hand-drawn sketch maps and descriptive text ('north by pond, south by mango tree') are invalid for legal adjudication.
3. Dual-sale attempts automatically trigger smart ledger rejection with real-time fraud alerts to land registry officers.`
  }
];
