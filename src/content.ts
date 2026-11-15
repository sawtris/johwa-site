// Home page copy. Edit words here, not in the pages.
// November 2026 redesign ("The Museum of Unfinished Futures"), from the approved homepage concept.

export const hero = {
  kicker: 'The Museum of Unfinished Futures',
  headline: 'Your next chapter isn’t built yet.',
  lead: 'We help leadership teams turn the business they have into the business they need.',
  primary: { label: 'Talk through your challenge', href: '/contact' },
  secondary: { label: 'Explore the exhibits', href: '#exhibits' },
  art: {
    before: { src: '/images/illustrations/organization-in-tension.svg', alt: 'A tangle of blocks and cords: an organization in tension.' },
    after: { src: '/images/illustrations/organization-in-alignment.svg', alt: 'A clean organization chart: the same organization in alignment.' },
  },
};

export const exhibits = {
  kicker: 'Illustrative scenario',
  one: {
    number: '001',
    title: 'The company that outgrew its operating model.',
    body: 'Growth changed the business. Now the operating model needs to catch up.',
    link: { label: 'See how we work', href: '#beliefs' },
  },
  two: {
    number: '002',
    title: 'The strategy that never left the deck.',
    body: 'Turn intent into decisions, ownership and action.',
    link: { label: 'Explore our approach', href: '/contact' },
    art: { src: '/images/illustrations/strategy-in-action.svg', alt: 'Ivory steps rising: strategy in action.' },
  },
};

export const beliefsIntro = {
  kicker: 'How we work together',
  title: 'Our beliefs.',
};

export const beliefs = [
  { title: 'No Assholes. No Tourists.', body: 'We share stakes without ego or drama. We get the work done.' },
  { title: 'Keep It Human.', body: 'Integrity is at our core. We speak like humans and avoid jargon.' },
  {
    title: 'Truth in Every Room.',
    body: 'We listen first. We make no assumptions. We say what needs to be said, respectfully, directly, and without spin.',
  },
  {
    title: 'High Standards. Low Maintenance.',
    body: 'We deliver excellence, not excuses. We provide follow through without reminders.',
  },
  {
    title: 'Leave It Better Than You Found It.',
    body: 'Every process, every team, every relationship, we make it stronger than it was before.',
  },
];

export const collective = {
  kicker: 'The collective',
  title: 'Experienced operators. Different perspectives.',
  lead: 'A collective of executives and experts, assembled around the challenge.',
  motto: 'High standards. Low maintenance.',
};

export const core = [
  {
    name: 'Tristan Saw',
    role: 'Co-Founder, CEO',
    focus: 'Strategy & Systems',
    photo: '/images/tristan.webp',
    linkedin: 'https://www.linkedin.com/in/tristansaw/',
  },
  {
    name: 'Elias Donovan',
    role: 'Co-Founder, COO',
    focus: 'Operations',
    photo: '/images/elias.webp',
    linkedin: 'https://www.linkedin.com/in/elias-donovan/',
  },
  {
    name: 'Bryan Bradburn',
    role: 'Co-Founder, CRO',
    focus: 'Commercial Growth',
    photo: '/images/bryan.webp',
    linkedin: 'https://www.linkedin.com/in/bryan-bradburn/',
  },
];

export const closing = {
  title: 'What needs to change?',
  button: { label: 'Start a conversation', href: '/contact' },
};

// The contact page.
export const contactPage = {
  kicker: 'Contact',
  title: 'What needs to change?',
  lead: 'Tell us what’s going on in the business. We listen first, and we’ll tell you straight whether we can help.',
  // The challenge choices on the form. The first two match the exhibits on the home page.
  topics: ['We’ve outgrown our operating model', 'Our strategy never left the deck', 'Something else'],
  belief: beliefs[2],
  podcast: {
    kicker: 'Not ready to talk yet?',
    title: 'Start with the podcast.',
  },
};
