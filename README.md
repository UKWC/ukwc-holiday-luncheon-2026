# UKWC 2026 Holiday Greeting — deployment

This is a NEW Netlify site / GitLab project. Do not overwrite the existing Fall Luncheon site or its Apps Script.

1. Create a new Google Sheet. In Extensions → Apps Script, paste `Code.gs`. Replace `SHEET_ID` with the new Sheet ID and `SHARED_SECRET` with a long random secret. Run `setupSheet` once.
2. Deploy Apps Script as a Web app, executing as **Me**, accessible to **Anyone**. Copy the `/exec` URL. The shared secret prevents untrusted direct submissions without knowing the secret (but it is not a replacement for rate limiting).
3. Create a GitLab project containing `index.html`, `thank-you.html`, and `netlify/functions/submit-donation.js` in the exact folder structure shown.
4. Connect the GitLab project to a NEW Netlify site. Set publish directory to the repository root; no build command needed. Set Netlify environment variables: `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SHEET_ENDPOINT_URL` (the new Apps Script URL), `SHEET_SHARED_SECRET` (same secret as Apps Script), `PUBLIC_SITE_URL` (full new Netlify site origin, e.g. https://example.netlify.app). Redeploy after setting variables.
5. Submit one test check donation and one small Square payment; verify both appear in the new sheet. Confirm payment separately in Square.

**Important:** Google Sheets entries for Square start as `Pending Square payment`; Square link creation is NOT proof of payment. This version does not implement Square webhook reconciliation. Update payment statuses manually using Square transaction records before sending acknowledgements or counting funds. Check submissions start as `Awaiting check` and must be manually marked received. Square fees are not added to the gift. Confirm donation/receipt wording with the club before publishing. The form uses December 15, 2026 from the source PDF, although the source also mentions early-December printing; confirm the timing with UKWC.
