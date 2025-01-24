import { z, ZodSchema } from 'zod';

export const subjectSchema: ZodSchema = z.object({
    name: z.string().min(1, "Nome da disciplina obrigatorio"),
    description: z.string().min(1, "Descrição da disciplina obrigatorio")
});

export type SubjectSchemaData = z.infer<typeof subjectSchema>; 