import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'id']).default('en'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    industry: z.string(),
    tech: z.array(z.string()),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    year: z.number().optional(),
    status: z.enum(['production', 'development', 'archived']).default('production'),
    lang: z.enum(['en', 'id']).default('en'),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string(),
    industry: z.string(),
    tech: z.array(z.string()),
    date: z.coerce.date(),
    duration: z.string().optional(),
    outcome: z.string().optional(),
    featured: z.boolean().default(false),
    lang: z.enum(['en', 'id']).default('en'),
  }),
});

export const collections = { blog, projects, caseStudies };
