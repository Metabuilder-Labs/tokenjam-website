import type { BlogPost } from './blog';
import { getAuthor } from './authors';

const SITE = 'https://tokenjam.dev';

export function articleSchema(post: BlogPost) {
  const author = getAuthor(post.data.author) ?? getAuthor('anil-murty');
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    image: post.data.image ? `${SITE}${post.data.image}` : `${SITE}/og-image.png`,
    datePublished: post.data.publishDate.toISOString(),
    dateModified: (post.data.lastUpdated ?? post.data.publishDate).toISOString(),
    author: { '@type': 'Person', name: author?.name ?? 'TokenJam' },
    publisher: {
      '@type': 'Organization',
      name: 'TokenJam',
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` },
    },
    mainEntityOfPage: `${SITE}/blog/${post.id}`,
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TokenJam',
    url: SITE,
    logo: `${SITE}/icon.svg`,
    sameAs: ['https://github.com/metabuilder-labs/tokenjam'],
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TokenJam',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Open-source, OTel-native observability for autonomous AI agents. Local-first, multi-runtime.',
    url: SITE,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

export function personSchema(slug: string) {
  const a = getAuthor(slug);
  if (!a) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: a.name,
    description: a.bio,
    jobTitle: a.role,
    image: `${SITE}${a.avatar}`,
  };
}
