export const SITE = {
  // Swap to the real domain once it's live, e.g. 'https://notesfrombrian.com'
  origin: typeof window !== 'undefined' ? window.location.origin : 'https://notesfrombrian.com',
  sender: { name: 'Brian Franke', title: 'Senior Enterprise Account Executive', company: 'Frontify', email: 'brian.franke@frontify.com' },
  booking: 'https://frontify.chilipiper.com/personal-page/brian-franke',
};

const modules = import.meta.glob('./data/*.json', { eager: true });
export const COMPANIES = Object.fromEntries(
  Object.values(modules).map((m) => [m.default.slug, m.default]),
);
