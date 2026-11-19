# Fortress City enquiry QA — 2026-11-19

## Scope

Validated the fast enquiry entry points, the existing promotion-page entry points, form interaction and submission behavior, backend success and failure cases, caching, and responsive layout. No production deployment was made and no real enquiry was sent.

## Environment and safety

- The final site-mode production build was served from an isolated copy at `/tmp/fortress-qa.1orzQ3` on `127.0.0.1:3001`. The test build used a temporary Google Fonts response mock because the build environment could not reliably fetch Google Fonts. No production font assets or source were changed for the mock.
- The local backend was verified as non-production before mutation testing: Django `DEBUG=True`, SQLite database, and console-only email backend.
- QA used a clearly marked synthetic responder: role 42, user 107, employee 59 (`EMP-FC-QA-20261119`). Campaign/form id 1 received test lead ids 32 and 33 and submission ids 2 and 3. The initial successful submission returned 201; repeating the same synthetic contact returned 201 with duplicate metadata pointing to lead 32. A missing required answer returned 400 and created no lead.
- All synthetic users, employee/role fixtures, leads, submissions, events/notifications, and related fixture rows were removed. Cleanup was verified. No email was sent.

## Results

| Area | Result | Evidence / limits |
|---|---|---|
| Direct entry and SSR | Pass | `?enquire=1` and `?lead=1` both returned HTTP 200 and included the dialog and form in the initial HTML. Additional query parameters were retained. Closing the direct route returned to the promotion URL while preserving attribution parameters. |
| Cache and speed | Local pass; Vercel not measured | Ten warm loopback requests returned HTTP 200. TTFB samples were 2.3–7.3 ms; p75 was about 3.7 ms. Response headers showed `x-nextjs-cache: HIT` and `s-maxage=60`. This is local server timing, not a regional Vercel measurement and does not include DNS/TLS. A Preview deployment is needed to validate the 300 ms Vercel target. |
| Responsive sweep | Pass with short-height scrolling noted | 25 viewport sizes: 320×720, 375×667, 375×812, 479×800, 480×800, 481×800, 600×900, 637×683, 639×800, 640×800, 641×800, 768×900, 900×900, 1023×720, 1024×720, 1025×720, 1024×768, 1279×720, 1280×720, 1281×720, 1280×900, 1440×900, 1600×1000, 640×640, and 800×640. All returned HTTP 200, rendered the dialog and form, and had no horizontal overflow. At 1024×720, 1025×720, and 1024×768 the action button sits below the initial viewport but is reachable by scrolling the form; it is not clipped. The 640×640 and 800×640 checks approximate narrow effective viewports such as high zoom; they are not browser zoom automation. |
| Contact step | Pass | Empty required fields, invalid email, and missing preferred contact method show inline field errors and focus the first invalid field. Optional blank email is accepted when a campaign form is available. |
| Plans, review, and edits | Pass | Required plan questions validate inline; completed answers appear in review. Editing contact details and navigating back to plans retained the draft. |
| Consent validation | Fixed and verified | Native browser `required` previously intercepted submit before the React field validator could show its inline message. Consent now uses `aria-required` and the custom validation path; an unchecked required consent blocks submission, announces the inline error, and checking it clears the error. |
| Continue versus submit | Fixed and verified | A Continue button was being reused by React as the Send submit button when the review step rendered, which caused an unintended POST during the Continue activation. Giving the two buttons distinct keys fixed the transition. On the final production bundle, Continue emitted 0 submit events and 0 POSTs; Send emitted exactly 1 event and 1 POST. |
| Submit errors and retry | Pass | A controlled 503 showed a readable error and retained all review data. The final bundle sent exactly one POST for the explicit Send action. Generic transport messages such as `Request failed` and `Failed to fetch` now map to a useful user-facing message. |
| Successful backend submission | Pass against local test DB | Synthetic valid submission and duplicate handling succeeded as described above. Missing required server answer returned 400 without creating a lead. Fixture cleanup was verified. |
| Unavailable-content modes | Pass | With backend campaign content unavailable, the backend-source build showed a clear unavailable state and a working “View promotion” path; the promotion route also showed its unavailable state instead of rendering a blank page. In site-content mode, approved campaign copy remained available when lead-form configuration was unavailable. |
| Legacy contact fallback | Environment limitation | The generic `/api/properties/contact/` fallback returned 404 from this local OS backend, which does not expose that endpoint. The UI now avoids exposing the raw `Request failed` text. This local 404 does not establish whether that endpoint is available in the production marketing environment. |
| Keyboard and close behavior | Pass | `#enquire` opens the form; Escape closes it when not submitting; focus remains trapped and wraps; closing restores focus to the trigger. Direct-route close removes the enquiry parameter and returns to the promotion. |
| Hydration console | No longer reproduced; cause unconfirmed | An earlier first-pass matrix recorded minified React hydration error #418 on its first eight narrow widths. A focused repeat against the final bundle covered 320, 375, 637, 639, and 1280 px; the first request was `STALE`, later requests were `HIT`, and none produced a page error or console error. No root cause was proven, so this is recorded as an unconfirmed transient observation rather than a confirmed fix. |

Screenshots from the final bundle are in `/tmp/fortress-final-320x720.png`, `/tmp/fortress-final-375x812.png`, `/tmp/fortress-final-637x683.png`, `/tmp/fortress-final-768x900.png`, `/tmp/fortress-final-1280x720.png`, `/tmp/fortress-final-1440x900.png`, and `/tmp/fortress-final-1600x1000.png`.

## Build and code checks

- `npm run build`: passed in the isolated copy; compile, TypeScript, static generation (74/74), and route optimization completed. Static generation emitted unrelated `getBlogBySlug` timeout warnings because the backend was unavailable for those other routes.
- `npx tsc --noEmit --incremental false`: passed in the isolated copy.
- `git diff --check`: passed before the final report update; rerun before handoff.
- `npm run lint`: unavailable because the package script runs `next lint`, which Next 16 treats as a project path and rejects. No test script is defined in `package.json`.

## Remaining checks

1. Measure warm requests from a Vercel Preview region and check p75 TTFB separately from DNS/TLS. Local loopback timing cannot verify the Vercel target.
2. Verify the generic contact fallback against the intended deployed marketing API; the local backend does not implement that route.
3. If hydration error #418 returns, capture the page error stack and server/cache response from the same first request before changing code. Current evidence does not establish a reproducible mismatch.

## Follow-up footer adjustment — 2026-11-19

After the responsive sweep above, later-step controls were changed to stay in a two-column row at all widths. At widths below 360 px the visible submit label shortens to “Send”; its accessible name remains “Send enquiry.” The first contact step keeps its existing privacy note and primary-action layout. This latest footer adjustment has not yet been browser-verified, so the viewport results above describe the previous footer implementation.
