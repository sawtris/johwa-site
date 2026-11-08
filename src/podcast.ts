// Podcast copy and episode list. Edit words and add episodes here, not in the pages.
//
// To add an episode: copy the last entry in `episodes`, bump `number` and `slug`, and fill in the rest.
// Its page appears at /podcast/episode-N, and the short link johwa.co/epN redirects to it (see worker/index.ts).

export interface Episode {
  number: number;
  slug: string; // the page lives at /podcast/<slug>
  title: string;
  description: string[]; // one string per paragraph
  // ISO date (YYYY-MM-DD) the episode went live. Leave empty until it is published; the date is hidden while empty.
  published: string;
  // The `src` of Buzzsprout's iframe embed for this episode (Buzzsprout, the episode, Share, Embed, iframe).
  // Leave empty until the episode is live; the page shows a "coming soon" note instead of a player.
  playerSrc: string;
}

export const show = {
  title: 'Enough to be Dangerous',
  tagline: 'Stop chatting with AI. Start putting it to work.',
  description: [
    'Lots of people say they use AI every day. For most of us, that means asking a chatbot a question and copying the answer.',
    "That's a great start, but it's a bit like owning a power drill and only using it to hang one picture.",
    'Enough to be Dangerous is a podcast for humans who want to get more out of AI without learning to code.',
    'No jargon, no hype. Just enough to be dangerous.',
  ],
  hosts: 'Hosted by Tristan Saw, Elias Donovan and Bryan Bradburn, the co-founders of johwa.',
  cover: {
    src: '/images/podcast/cover-1200.webp',
    srcSmall: '/images/podcast/cover-600.webp',
    share: '/images/podcast/cover-1200.jpg', // JPEG for link previews (LinkedIn does not show WebP)
    alt: 'Enough to be Dangerous podcast cover: the title in bold black and yellow, with "Dangerous" printed on caution tape.',
  },
  // Show links in each app. Leave a link empty and its button stays hidden until you add it.
  listen: {
    apple: 'https://podcasts.apple.com/podcast/id6832157937',
    spotify: 'https://open.spotify.com/show/31wHVYBbLzfYYCKxqKfDf2',
  },
  // The note under each episode, pointing listeners to johwa.
  cta: {
    title: 'Want this working in your business?',
    body: "We help leadership teams put AI to work on real problems. Tell us what you're trying to fix.",
    button: 'Talk to us',
    href: '/#contact',
  },
};

export const episodes: Episode[] = [
  {
    number: 1,
    slug: 'episode-1',
    title: "Free vs. Paid AI: McDonald's or Fine Dining?",
    description: [
      'Most people we talk to use AI like a search engine. Ask a question, get an answer, move on. So we asked ourselves a simple question: what do you actually get when you pay?',
      'We cover the hidden cost of "free," why paid plans let you dig deeper without hitting a wall, and why the best AI tool is the one you actually commit to learning. Plus, our co-host Elias explains it all with a restaurant analogy (of course he does).',
    ],
    published: '2026-11-07',
    playerSrc: 'https://www.buzzsprout.com/2664382/20090006?client_source=small_player&iframe=true',
  },
];

// Newest first, for the podcast page.
export const episodesNewestFirst = [...episodes].sort((a, b) => b.number - a.number);

export const formatDate = (iso: string) =>
  iso
    ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : '';
