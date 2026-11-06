// The site owner's details live in site.config.json (repo root). Change them there, or with scripts/new_owner.py.
import CFG from '../site.config.json';
import { normalize } from './names.js';

const o = CFG.owner;
export const SITE = {
  name: CFG.siteName,
  domain: CFG.domain,
  origin: typeof window !== 'undefined' ? window.location.origin : `https://${CFG.domain}`,
  sender: { name: o.name, first: o.firstName, last: o.lastName, title: o.title, company: o.company, email: o.email, phone: o.phone, tel: o.tel, photo: o.photo },
  booking: o.booking,
};

// "publish" is "all" or a list of slugs; "hide" lists slugs that are never built or shown (e.g. another owner's example pages)
export const isPublished = (slug) => (CFG.publish === 'all' || (Array.isArray(CFG.publish) && CFG.publish.includes(slug))) && !(CFG.hide || []).includes(slug);

const modules = import.meta.glob('./data/*.json', { eager: true });
export const COMPANIES = Object.fromEntries(
  Object.values(modules).filter((m) => isPublished(m.default.slug)).map((m) => [m.default.slug, normalize(m.default)]),
);
