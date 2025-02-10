import { z, ZodSchema } from 'zod';

export const KnowledgeSchema: ZodSchema = z.object({
    name: z.string().min(1, "Nome da area do conhecimento obrigatorio"),
    description: z.string().min(1, "Descrição da area de conhecimento obrigatorio")
});

export type KnowledgeSchemaData = z.infer<typeof KnowledgeSchema>; 