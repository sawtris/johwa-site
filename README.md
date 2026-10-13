# johwa.co

Astro site (static) with a small Cloudflare Worker for the contact form. Replaces the Wix site.

```
src/content.ts   all site copy (edit words here)
src/config.ts    site facts (email, LinkedIn, search verification tags)
src/pages/       home, privacy, 404
src/components/  header, footer, contact form, logo mark, 조화 outlines
src/lib/ridges.ts  draws the mountain ridgelines
worker/          contact form handler (runs only for /api/*)
public/          headshots, favicon, share image
```

## Run it locally (optional)

Needs Node 22.12 or newer. `npm install`, then `npm run dev`.

## Launch checklist

### 1. Deploy on Cloudflare (before touching DNS)

1. Cloudflare dashboard, Workers & Pages, Create, import `sawtris/johwa-site`.
2. Worker name: `johwa-site`. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Open the `johwa-site.<your-account>.workers.dev` link and review the site.

### 2. Contact form email (Resend)

1. In Resend, add the domain `johwa.co` and copy the DNS records it gives you (you add them in step 3).
2. Create an API key. In Cloudflare, the Worker, Settings, Variables and Secrets, add a **secret** named `RESEND_API_KEY`.
3. Messages go to `hello@johwa.co` (`CONTACT_TO_EMAIL` in `wrangler.jsonc`), so that mailbox must exist.
4. Until johwa.co is verified in Resend, set `CONTACT_FROM_EMAIL` to `johwa Website <onboarding@resend.dev>`. That sender only delivers to the email your Resend account uses.

### 3. Move DNS to Cloudflare (Porkbun)

1. Cloudflare, Add a domain, `johwa.co`, Free plan. Cloudflare copies the current DNS records.
2. **Check the copied records before going further.** Keep every MX and TXT record (email, SPF, Google verification). Losing them breaks email.
3. Add the Resend records from step 2.
4. Porkbun, johwa.co, Authoritative Nameservers: replace them with the two Cloudflare gives you.
5. Once Cloudflare shows the domain as active: the Worker, Settings, Domains & Routes, add custom domains `www.johwa.co` and `johwa.co`. Let Cloudflare replace the old Wix records for those two names. The Worker sends `johwa.co` to `www.johwa.co`.

### 4. After launch

- Check johwa.co on a phone and send a test message through the form.
- Google Search Console and Bing keep working (their verification tags are carried over in `src/config.ts`). Submit `https://www.johwa.co/sitemap-index.xml` in both.
- Cancel the Wix plan only after the new site is live and the form works.

## Design notes

- **Colors:** Mist `#EEF4F3`, Haze `#D6E7E4`, Tide `#7AA6A1`, Deep `#3C6B67`, Ink `#13272B`, and johwa green `#18BB65` (the logo only, plus focus rings and the belief numbers). Tokens are at the top of `src/styles/global.css`.
- **Type:** Syncopate Bold for headings (an open-source stand-in for Lulo Clean on the Wix site) and Figtree for text (in place of Avenir).
- **Logo:** `Mark.astro` redraws the J on its own grid, measured from the Wix logo file.
- **조화:** drawn as outlines from Noto Serif KR ExtraLight (SIL Open Font License), so no Korean font is loaded.
- **Motion:** the ridges rise out of the mist once on load. Switched off for visitors who prefer reduced motion.
- **Photos:** the Wix stock photos (climber, mountains, sea, canyon) are not carried over, since Wix licenses them for use on Wix only. The mountains are drawn in code instead.
