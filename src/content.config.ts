import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('anil-murty'),
    publishDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    pillar: z
      .enum([
        'foundational',
        'observability',
        'evaluation',
        'environments',
        'gateways',
        'memory',
        'guardrails',
        'hitl',
        'control-plane',
        'optimization',
        'comparison',
        'thesis',
      ])
      .optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    canonicalUrl: z.string().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    section: z.string().optional(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

export const collections = { blog, docs };
