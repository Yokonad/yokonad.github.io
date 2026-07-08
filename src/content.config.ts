import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección de write-ups: cada archivo .md dentro de src/content/writeups/
// se convierte en una entrada del índice de write-ups.
const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    os: z.enum(['Linux', 'Windows', 'Otro']).default('Linux'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']).default('Easy'),
    date: z.string(), // formato AAAA-MM-DD para ordenar
    tags: z.array(z.string()).default([]),
    summary: z.string().default(''),
    platform: z.string().default('HackTheBox'),
    icon: z.string().optional(), // ruta al icono de la máquina (ej. /picture/writeups/xxx.webp)
  }),
});

export const collections = { writeups };
