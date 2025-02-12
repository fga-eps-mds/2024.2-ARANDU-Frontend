import { z, ZodSchema } from 'zod';

export const journeySchema: ZodSchema = z.object({
  title: z.string().min(1, 'Nome da Jornada é obrigatório'),
  subjectId: z.string().min(1, "Necessario codigo da Discipllina")
});

export type JourneySchemaData = z.infer<typeof journeySchema>;
