import { z, ZodSchema } from 'zod';

export const subjectSchema: ZodSchema = z.object({
    title: z.string().min(1, "Nome da disciplina obrigatorio")
});

export type SubjectSchemaData = z.infer<typeof subjectSchema>; 