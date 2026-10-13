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

### 3. Move DNS from Wix to Cloudflare

The domain is registered at Porkbun, but its nameservers point to Wix (`ns6.wixdns.net`, `ns7.wixdns.net`), so Wix hosts the DNS today, including the Google Workspace email records. Moving DNS to Cloudflare first means cancelling Wix later can't take email down with it.

Before starting, open Wix, Domains, johwa.co, DNS records, and screenshot every record, in case there's one the public lookup below didn't show.

1. Cloudflare, Add a domain, `johwa.co`, Free plan. Cloudflare scans and copies the current records.
2. **Check the copied records against this list (as of October 13, 2026) and add anything missing.** The DKIM record is the one scans most often miss.

   | Type | Name | Value | Why |
   |---|---|---|---|
   | MX | `@` | `smtp.google.com`, priority 1 | Google Workspace email |
   | TXT | `@` | `v=spf1 include:_spf.google.com ~all` | SPF for Google |
   | TXT | `@` | `google-site-verification=BcI4Su8tcZPlNwQmpUWROdkSytcCmI-g8NzdboT4Pxc` | Search Console |
   | TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=` + the full key (copy it from Google Admin, Apps, Gmail, Authenticate email, or from Wix) | DKIM for Google |
   | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@johwa.co; fo=1` | DMARC |

   Delete the Wix website records: the `A` records on `@` (185.230.63.x) and the `www` CNAME to `cdn3.wixdns.net`. Step 5 replaces them.
3. Add the Resend records from step 2. They live on their own names (`resend._domainkey` and `send`), so they don't clash with Google's SPF or MX.
4. Porkbun, johwa.co, Authoritative Nameservers: replace the two Wix nameservers with the two Cloudflare gives you.
5. Once Cloudflare shows the domain as active: the Worker, Settings, Domains & Routes, add custom domains `www.johwa.co` and `johwa.co`. The Worker sends `johwa.co` to `www.johwa.co`.

### 4. After launch

- Send yourself an email from an outside address (a personal Gmail works) to hello@johwa.co, and reply to it, to confirm email still flows both ways.
- Check johwa.co on a phone and send a test message through the form.
- Google Search Console and Bing keep working (their verification tags are carried over in `src/config.ts`). Submit `https://www.johwa.co/sitemap-index.xml` in both.
- Cancel the Wix plan only after the new site is live, email works, and the form works.

## Design notes

- **Colors:** Mist `#EEF4F3`, Haze `#D6E7E4`, Tide `#7AA6A1`, Deep `#3C6B67`, Ink `#13272B`, and johwa green `#18BB65` (the logo only, plus focus rings and the belief numbers). Tokens are at the top of `src/styles/global.css`.
- **Type:** Syncopate Bold for headings (an open-source stand-in for Lulo Clean on the Wix site) and Figtree for text (in place of Avenir).
- **Logo:** `Mark.astro` redraws the J on its own grid, measured from the Wix logo file.
- **조화:** drawn as outlines from Noto Serif KR ExtraLight (SIL Open Font License), so no Korean font is loaded.
- **Motion:** the ridges rise out of the mist once on load. Switched off for visitors who prefer reduced motion.
- **Photos:** the Wix stock photos (climber, mountains, sea, canyon) are not carried over, since Wix licenses them for use on Wix only. The mountains are drawn in code instead.
