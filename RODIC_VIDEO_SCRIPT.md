# RODIC VIDEO DEMONSTRATION RUNBOOK & SCRIPT (4 MINUTES)

**Project:** `jieos-rodic-poc-2026`  
**Challenge:** Rodic InfraAI Innovation Challenge 2026  
**Theme:** AI for Roads, Bridges & Tunnels  
**Target Video Duration:** 3 minutes 50 seconds (&le; 4 minutes)  
**Tone:** Professional, technical, engineering-grounded, honest.

---

### Phase 1: Context & Executive Overview (0:00 – 0:45)
**Screen:** Open `Project Overview` (Dashboard).
**Visual Action:** Cursor highlights the Project Header: *Pune–Nashik Highway Improvement Project (NH-60 Package II, 45 km corridor)*.
**Spoken Narration:**
> "Welcome. This is JIEOS–InfraAI, a specialized decision-support copilot for highway quality inspection and defect management, developed for the Rodic InfraAI Innovation Challenge 2026.
> Here on our Project Dashboard, you see real-time operational intelligence derived from actual field records: 3 recorded inspections, 4 open defect findings, 1 critical pothole alert requiring immediate intervention, and our planned versus reported progress. Notice our prominent Demo AI Mode badge: all demonstrations today run on transparent, deterministic fixtures with zero hidden dependencies."

---

### Phase 2: Road Field Inspection & Photographic Capture (0:45 – 1:30)
**Screen:** Click *Road Inspection Capture* (`/inspections`).
**Visual Action:** Enter `Km 42+500` to `Km 43+200`. Select *Asphalt Pothole & Edge Ravelling* preset (or upload local photo). Click *Submit Inspection & Run AI Defect Detection*.
**Spoken Narration:**
> "To record a survey, a site engineer inputs chainage boundaries. Notice our built-in chainage validator: it enforces standard Indian highway notation, calculates segment length, and blocks invalid inverted ranges.
> Next, the engineer attaches site photographs. JIEOS supports JPEG, PNG, and WebP formats with a 10MB safety boundary.
> When we submit, JIEOS dispatches the evidence to our defect engine, generating an immediate candidate proposal: an asphalt pothole with subgrade exposure, tagged with Critical severity and a transparent qualitative uncertainty indicator."

---

### Phase 3: Human-in-the-Loop Review & Engineering Sign-Off (1:30 – 2:30)
**Screen:** Click *AI Findings & Human Review* (`/findings`).
**Visual Action:** Select Finding `fnd-102`. Review AI proposal alongside photo. Adjust engineering notes. Assign to *Emergency Rapid Response Unit*. Click *Confirm Finding & Assign Action*.
**Spoken Narration:**
> "Crucially, JIEOS treats AI proposals as hypotheses, not certified conclusions. Here on the Human Review screen, the quality engineer examines the photographic evidence alongside the AI proposal.
> The engineer has full authority to confirm the defect, adjust severity, or mark false positives. Here, the engineer confirms the critical rating, enters field depth measurements, and assigns an emergency cold-mix rectification task.
> Every decision is appended to an immutable audit trail with the engineer's name and exact timestamp, preserving full contractual lineage."

---

### Phase 4: Corridor Chainage Map & Hotspots (2:30 – 3:15)
**Screen:** Click *Chainage Corridor Map* (`/chainage`).
**Visual Action:** Pan across the continuous highway strip from Km 40+000 to Km 85+000. Point out the pin at Km 43+150. Show defect density bar chart.
**Spoken Narration:**
> "To understand spatial patterns, our Chainage Corridor Map plots all defects continuously along the 45-km alignment.
> Instead of fragmented punchlists, managers instantly see defect clusters. Notice the hotspot in the Chakan Bypass segment between Km 40 and Km 45, and our intelligent recommendation identifying the next priority unsurveyed corridor between Km 43+500 and 44+100."

---

### Phase 5: Corrective Action Lifecycle & Verification (3:15 – 3:45)
**Screen:** Click *Corrective Action Lifecycle* (`/actions`).
**Visual Action:** Select action `act-102`. Move state from *In Progress* to *Resolved*. Enter repair notes. Click *Verify & Close Action*.
**Spoken Narration:**
> "Once repairs are executed, the action enters our verification state machine: New, Action Assigned, In Progress, Resolved, and Verified Closed.
> Under our engineering safety rules, defects cannot be closed automatically. A quality engineer must conduct a post-rectification inspection, record straightedge tolerances, and officially sign off."

---

### Phase 6: Export & Automated Test Evidence (3:45 – 4:00)
**Screen:** Click *Reports & CSV Export* (`/reports`), click *Export Findings CSV*, then switch to *Automated Testing* (`/testing`).
**Visual Action:** Show CSV downloading. Display the 23/23 passing Vitest results table.
**Spoken Narration:**
> "Finally, JIEOS generates an audit-proof executive dossier and one-click RFC-4180 CSV export with full photographic references.
> Furthermore, as shown on our Testing screen, the entire platform is backed by 23 passing automated tests covering all 14 challenge domains in 1.1 seconds.
> JIEOS demonstrates how practical AI can empower infrastructure teams with transparency, safety, and traceability. Thank you."
