UKWC Holiday Luncheon 2026

Deploy this folder as a SEPARATE Netlify site from the Holiday Greeting fundraiser. Do not overwrite the fundraiser files.

1. Confirm Google Apps Script deployment is active and publicly callable at the configured /exec URL.
2. IMPORTANT: The Google Apps Script previously supplied supports only one guest and does not save phone, guest vegetarian preference, or processing fee. For complete tracking, update that script separately before launch.
3. Configure Netlify environment variables: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, PUBLIC_SITE_URL (the full public HTTPS URL of this new site).
4. Deploy and test both Check and Square flows. Check that rows appear and treasurer emails arrive.
5. A Square payment link is created before the Sheet is written. Payment status is PENDING until separately verified; redirect alone does not prove payment. Square webhook/reconciliation is needed to mark payments Paid.
6. The newsletter lists conflicting luncheon end times (1 PM and 2 PM); this form displays only the confirmed 11:30 AM start.
