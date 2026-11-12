# BALE Campaign Website Integration Plan

**Status:** Phase 2 implementation in progress  
**Scope:** Public BALE campaign experience on the Bomach Group website, with data and lead integration to Bomach OS  
**Implementation approach:** Deliver and verify small, independently reviewable chunks. Do not build the staff campaign module as part of this work.

## 1. Product Direction

BALE (Become a Landlord with Ease) will be a campaign experience within the existing Bomach Group website, initially under `/bale`. It should use the website's existing visual language, responsive behavior, and interaction patterns rather than becoming a separate website or application.

The first release is for prospective buyers. It explains the campaign, presents approved estates and available property inventory, and captures enquiries. Staff should handle resulting leads through the existing Bomach OS lead workflow. A BALE staff app and the general client/buyer portal are separate future work.

## 2. Data Ownership and BALE Inclusion Rule

- Real Estate remains the source of truth; BALE does not create a second estate/property record or copy inventory into a BALE database table.
- For this temporary campaign, the backend will maintain a code-managed allowlist of approved estate codes. Adding or removing an estate is an intentional backend change and deployment. This avoids a database migration and a new Real Estate UI control for a short campaign.
- Use stable, unique estate codes rather than database IDs, which can differ across environments. The allowlist should be empty by default/fail closed until approved codes are added.
- The public API must not accept arbitrary estate IDs or codes and return them just because the caller requested them. If a detail/filter parameter is supported, it must be checked against the backend allowlist.
- The public site fetches estates from the API; it must not hard-code estate IDs, names, inventory counts, or availability.
- Allowlisting an estate for BALE does not mean every property is available. The public API must independently apply the agreed property visibility rules, initially expected to return only active, sellable properties with an available status.
- Removing an estate code from the allowlist removes it from BALE discovery without deleting or changing the estate and its properties in Real Estate.
- Campaign copy, dates, and approved campaign terms are campaign content, not estate/property records. Do not duplicate inventory or overwrite Real Estate pricing with campaign copy.

If an allowlisted estate has no eligible properties, the site should show the estate with a clear “currently no properties available” state and an enquiry option, if approved. It must not imply that unavailable or reserved stock can be purchased.

## 3. First-Release Visitor Experience

### Campaign landing page: `/bale`

- Explain BALE and the participating estates using management-approved copy and media.
- Fetch allowlisted estates and eligible properties from the backend.
- Provide a path to inspect an estate and its available properties.
- Explain the purchase process, verification steps, approved documents, and frequently asked questions without making unverified claims about title, infrastructure, appreciation, or urgency.
- Offer clear enquiry and “request a site visit” actions.

### Estate and property discovery

- Show only backend-returned, allowlisted estates and the properties permitted by the public API contract.
- Display price and availability from the backend response; show a useful loading, error, empty, and stale/unavailable state.
- If a property becomes unavailable between viewing and enquiry, do not reserve it. Explain that availability changed and offer to contact the buyer about alternatives.
- Use a stable public estate identifier/slug returned by the API if estate detail pages are needed. Do not derive a public URL from hard-coded IDs.

### Enquiry and visit requests

- Keep the initial form short: name and phone are required; email, estate/property interest, preferred contact method, and a short message can be optional or conditionally required after the API contract is agreed.
- Capture consent and its version/timestamp, plus validated campaign/referral/UTM attribution.
- A “request a site visit” CTA is an enquiry for staff to arrange a visit until real appointment slots and booking rules exist. Do not display a visit as confirmed without a successful slot reservation from the backend.
- On success, show a clear confirmation and reference if the API provides one. On failure, preserve the user's entries and provide retry guidance.

## 4. Explicitly Out of Scope for the First Release

- Staff-facing campaign dashboards, team/marketer management, sales targets, and BALE-specific operational screens.
- Public plot reservation, purchase/checkout, installment enrollment, or payment collection.
- Payment verification, receipts, buyer account creation, title-document issuance, and KYC/document uploads.
- A separate BALE CRM or a second copy of estate/property inventory.
- Publishing a price/discount calculator before commercial terms and calculation rules are approved and represented authoritatively by the backend.

The later client/buyer experience should be part of the planned shared Bomach client portal, not a campaign-specific identity system. The configured payment provider is not assumed to be available for this work.

## 5. Phases and Implementation Chunks

### Phase 0: Confirm decisions and freeze contracts

**Chunk 0.1 — Confirm launch content and business rules**

Confirm participating estates, public property fields, campaign dates, approved price/payment terms, document claims, contact ownership, response expectations, and privacy/consent wording. The BALE playbook's proposed targets, dates, prices, discounts, and incentives remain proposals until explicitly approved.

**Chunk 0.2 — Agree API shapes and failure behavior**

Agree the request/response examples, stable public estate identifier, pagination/filter behavior, property status semantics, error format, caching expectations, rate limits, and attribution fields before frontend/API work is coupled.

**Exit criteria:** Product, Real Estate, Marketing/Sales, and frontend agree which data is public and how allowlist inclusion, inventory changes, and enquiries behave.

### Phase 1: Minimal backend allowlist and public inventory API

**Chunk 1.1 — Define the backend-managed estate allowlist**

Add the approved estate codes to a backend-owned configuration/code allowlist. Do not add an Estate database field, migration, BALE administration screen, or frontend-controlled estate selection for this temporary campaign. Keep the allowlist empty until the estate codes and public data are approved. Adding or removing a code goes through review and backend deployment.

**Chunk 1.2 — Add the public BALE read API**

Create a read-only endpoint that selects estates only from the backend allowlist and returns eligible public properties for each. Use a dedicated public response schema rather than exposing the internal estate/property schemas. Include only approved media, descriptions, price, location, amenities, and availability fields; exclude client/owner details, internal pricing history/configuration, private documents, and operational metadata.

**Chunk 1.3 — Test allowlist and visibility rules**

Cover an empty allowlist, adding/removing codes, unknown and non-allowlisted codes, inactive estates, no eligible inventory, sold/reserved/held properties, pagination, malformed filters, and proof that private fields are not serialized. Confirm the public read endpoint cannot be used to retrieve an arbitrary estate outside the allowlist.

**Exit criteria:** The approved estate list and eligible properties can be fetched publicly without a database schema change, exposing staff-only fields, or modifying the regular Real Estate inventory workflow.

### Phase 2: Public website inventory experience

**Chunk 2.1 — Reconcile website API routing**

Verify the deployed backend base path and OpenAPI contract, then make the website API client and Next.js proxy target the correct versioned endpoints. Do not assume the current legacy `/api/properties/...` routes exist in the deployed backend.

**Chunk 2.2 — Add typed BALE API client and states**

Define frontend types from the agreed public contract. Distinguish API failure from a successful empty result; do not silently convert failed inventory requests into “no properties.” Add loading, retryable error, empty, and unavailable states.

**Chunk 2.3 — Build `/bale` landing and discovery UI**

Implement the campaign landing experience using the existing Bomach website design system. Fetch all estate/property content from the BALE API. Add estate/property views only to the depth approved in Phase 0, then verify responsive layouts, keyboard access, motion preferences, and image fallbacks.

**Confirmed Phase 2 discovery contract**

- Keep the estate list lightweight. Estate detail may return a map point derived from the stored boundary and rounded to 3 decimal places; never return boundary coordinates or parcel outlines.
- Estate and property maps show approximate estate-level context only. A property detail view must not place an individual property pin.
- Estate/property documents are hidden unless the exact stored file path is included in a backend-managed public campaign document allowlist. Initially publish only approved campaign brochures and site/layout plans. Do not expose title scans or legal documents by default. Changing approved paths requires a backend deployment; no database migration is planned.
- Inventory stays server-paginated at 24 records per page. Search matches property/plot name or number; type and size-range filters are server-side. Size ranges are in square metres, with plot units normalized before filtering and building area converted from its stored square-foot value. Records without a relevant size do not match an active size range.
- Selecting a property opens an accessible, responsive details modal with its facts, image gallery, estate-level location context, and any approved property documents. Closing returns to the same estate, filters, and page.
- This phase is read-only discovery. Do not add enquiry, reservation, site-visit booking, purchase, or payment actions to property details; those remain later-phase work.

**Exit criteria:** Adding/removing an approved estate code in the backend changes what the BALE website displays after the backend deployment, without a frontend deployment; ordinary website and Real Estate behavior remains unaffected.

### Phase 3: Public enquiry intake into the existing lead workflow

**Chunk 3.1 — Add a constrained public lead-intake endpoint**

Provide a dedicated anonymous intake contract. The server validates and normalizes fields, records consent and attribution, applies abuse controls, and creates or links the appropriate normal lead record. The server determines the BALE campaign and website source; the caller cannot set lead score, internal status, owner/assignee, branch, or other staff-controlled fields.

Include input validation, safe duplicate handling, rate limiting, spam controls, idempotency/retry behavior, and auditability. Avoid returning lead PII or internal workflow data to the public client.

**Chunk 3.2 — Connect website forms**

Connect the enquiry and visit-request forms to the public endpoint. Persist referral/UTM context through the user's journey, validate consent, prevent duplicate submissions, preserve form data after recoverable errors, and show confirmation only after backend success.

**Chunk 3.3 — Verify handoff to Bomach OS**

Confirm each successful enquiry appears in the existing lead workflow with correct campaign/source attribution and the expected staff follow-up behavior. Test spam, duplicates, invalid input, unavailable estate/property, and backend outage cases.

**Exit criteria:** Public leads flow into the existing staff process, with server-controlled workflow fields and tested abuse/privacy safeguards.

### Phase 4: Launch readiness and measurement

**Chunk 4.1 — Content, accessibility, and privacy review**

Obtain sign-off on public claims, terms, privacy/consent copy, document references, and contact details. Check responsive behavior, accessible forms, error messaging, and reduced-motion behavior.

**Chunk 4.2 — Attribution and operational verification**

Verify campaign/ad/referral attribution end-to-end and ensure analytics do not send names, phone numbers, email, or other personal form data. Define a launch smoke-test checklist and monitor API errors, lead creation, and inventory freshness.

**Exit criteria:** Business sign-off, successful production smoke test, and a clear owner for content, the estate allowlist, lead response, and incident handling.

### Phase 5: Optional commercial conversion capabilities

These are separate follow-up projects and require their own backend contracts and approvals:

- Server-authoritative price/discount calculator tied to a versioned approved offer.
- Actual site-visit appointment slots and confirmed booking.
- Authenticated reservation and buyer purchase flow using the existing Real Estate commercial lifecycle where appropriate.
- Finance-controlled payment recording and verification. No campaign UI may mark a payment as verified.
- Buyer document and account access through the shared client portal.

Do not start these by calling staff-only Real Estate or service-request endpoints from the public site.

## 6. API Contract Sketch

Names below are illustrative until agreed against the deployed backend/OpenAPI:

- `GET /api/v1/public/bale/estates` — estates from the backend allowlist and approved public summary fields.
- `GET /api/v1/public/bale/estates/{estate_code}` — one allowlisted estate and its paginated eligible properties, if detail routes are needed; a non-allowlisted code must not reveal estate data.
- `POST /api/v1/public/bale/enquiries` — constrained enquiry/visit-interest submission, recorded into the existing lead workflow with server-controlled attribution and fields.

Public GET responses must never serialize the internal estate/property schemas wholesale. Public POST responses must be minimal and must not reveal lead records or staff workflow state.

## 7. Known Integration Risks to Resolve First

- The current website API helper uses legacy `/api/properties/...` paths, while the backend checkout inspected mounts its API under `/api/v1/`. Confirm the deployed production OpenAPI before changing either side.
- The existing general lead creation endpoint is permission-protected and accepts staff-controlled fields; it is not a safe public form endpoint.
- The existing Real Estate property list endpoint is permission-protected and returns an internal schema with fields unsuitable for public exposure. The BALE endpoint must be a limited public projection and enforce the backend allowlist.
- Existing website property fetch helpers can turn API errors into empty lists. BALE must distinguish an outage from genuinely empty published inventory.
- The supplied BALE React MVP persists to local storage and is a workflow reference, not a source of production records or approved business rules.

## 8. Chunking and Review Rules

- Keep each chunk limited to one contract or user-visible capability; do not bundle allowlist configuration, public API, frontend, and lead intake into one large change.
- Backend API/configuration work should be reviewed and tested in the backend repository. Website UI/API client work belongs in this repository. The initial inventory publication approach intentionally avoids a database migration.
- Do not copy production data or campaign demo records into frontend fixtures as if they were live.
- Every backend chunk includes tests for permissions, validation, serialization, and edge states. Every website chunk includes type/lint/build checks and user-visible empty/error states.
- Before implementation begins, re-check the live backend contract and repository state; this document describes the plan, not proof that the deployed backend already supports these APIs.
