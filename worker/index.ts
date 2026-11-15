// Tiny Worker. It runs first for every request (see wrangler.jsonc): it sends johwa.co to www, turns podcast
// short links like /ep1 into episode pages, and handles /api/contact. Every other URL is served from the static site.

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY: string; // secret, set in the Cloudflare dashboard
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

const json = (body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const clean = (value: FormDataEntryValue | null, max: number) =>
  typeof value === 'string' ? value.replace(/\r/g, '').trim().slice(0, max) : '';

const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();

async function handleContact(request: Request, env: Env): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'The form data could not be read.' }, 400);
  }

  // Spam trap: bots fill in every field, people never see this one.
  if (clean(form.get('website'), 200)) return json({ ok: true });

  const name = oneLine(clean(form.get('name'), 200));
  const email = clean(form.get('email'), 254);
  const organization = oneLine(clean(form.get('organization'), 200));
  const role = oneLine(clean(form.get('role'), 200));
  const topic = oneLine(clean(form.get('topic'), 200));
  const message = clean(form.get('message'), 5000);

  if (!name || !message) {
    return json({ ok: false, error: 'Please add your name and a message.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'That email address does not look right.' }, 400);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error('Contact form is missing configuration (RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL).');
    return json({ ok: false, error: 'The form is not set up yet.' }, 500);
  }

  // Only the lines that were filled in.
  const details: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Company', organization],
    ['Role', role],
    ['Challenge', topic],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]));

  const text = `New message from johwa.co\n\n${details.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}\n`;
  const html =
    `<p><strong>New message from johwa.co</strong></p>` +
    `<p>${details.map(([k, v]) => `${k}: ${escapeHtml(v)}`).join('<br>')}</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;
  const subject = organization ? `Website message from ${name} (${organization})` : `Website message from ${name}`;

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
  } catch (error) {
    console.error('Could not reach Resend', error);
    return json({ ok: false, error: 'The message did not send.' }, 502);
  }

  if (!response.ok) {
    console.error('Resend rejected the message', response.status, await response.text());
    return json({ ok: false, error: 'The message did not send.' }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // The Wix site lived on www. Send the bare domain there too, so every link lands on one address.
    if (url.hostname === 'johwa.co') {
      url.hostname = 'www.johwa.co';
      return Response.redirect(url.toString(), 301);
    }

    // Podcast short links said on air: /ep1 goes to /podcast/episode-1, and so on for every episode.
    const shortLink = url.pathname.match(/^\/ep(\d+)\/?$/i);
    if (shortLink) {
      url.pathname = `/podcast/episode-${Number(shortLink[1])}`;
      return Response.redirect(url.toString(), 302);
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { allow: 'POST' });
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
