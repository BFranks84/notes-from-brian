export const SITE = {
  // Swap to the real domain once it's live, e.g. 'https://notesfrombrian.com'
  origin: typeof window !== 'undefined' ? window.location.origin : 'https://notesfrombrian.com',
  sender: { name: 'Brian Franke', title: 'Senior Enterprise Account Executive', company: 'Frontify', email: 'brian.franke@frontify.com', phone: '630.666.8201', tel: '+16306668201', photo: '/brian-franke-2.jpg' },
  booking: 'https://frontify.chilipiper.com/personal-page/brian-franke',
};

import { normalize } from './names.js';

const modules = import.meta.glob('./data/*.json', { eager: true });
export const COMPANIES = Object.fromEntries(
  Object.values(modules).map((m) => [m.default.slug, normalize(m.default)]),
);
