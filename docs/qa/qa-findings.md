# QA findings log

## Fortress City enquiry — 2026-11-19

### Confirmed and fixed

1. **Continue could submit the enquiry accidentally.** On the step transition, React reused the Continue button node for the Send button and changed its type from `button` to `submit` while the original activation was still in progress. The final bundle assigns distinct keys to the two buttons. Browser verification recorded zero submit events/POSTs after Continue and exactly one after Send.
2. **Required consent bypassed inline validation.** Native checkbox `required` caused browser validation to prevent the React submit handler from running. The campaign checkbox now exposes `aria-required` while the existing field validator owns the error display. Verified unchecked consent blocks the submission with an inline error.
3. **Generic network failures exposed technical copy.** `Request failed` and `Failed to fetch` are now mapped to “We could not submit your enquiry right now. Please try again.” The review data remains available for retry.
4. **Short desktop form layout pushed the action bar below the first view.** A narrow short-height desktop rule aligns the form to the top. All 25 checked viewports had no horizontal overflow; at 1024×720, 1025×720, and 1024×768 the action remains scroll-reachable rather than clipped.

### Observed but not confirmed

- An earlier first pass recorded React hydration error #418 on the first eight narrow viewport loads. Focused repeat testing against the final production bundle at 320, 375, 637, 639, and 1280 px produced no page errors or console errors; the initial request was stale and later requests were cache hits. Cause remains unknown. Capture the first request's stack and cache headers if it recurs before attempting a speculative change.

### Environment limits

- The local OS backend returned 404 for the generic `/api/properties/contact/` fallback. The campaign-specific lead-form success, duplicate, and validation flows were tested against verified local non-production SQLite and cleaned up. Production availability of the generic fallback was not established.
- Vercel regional TTFB was not measured; local warm-cache timing is not a substitute.

### Follow-up change pending visual verification

- Later-step footer buttons now stay side by side across widths; the submit label shortens to “Send” below 360 px while preserving its accessible name. The earlier responsive matrix predates this adjustment; run a visual check of narrow widths before calling the new footer verified.
