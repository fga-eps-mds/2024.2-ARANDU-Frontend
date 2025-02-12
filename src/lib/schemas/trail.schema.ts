import { z, ZodSchema } from 'zod';

export const trailsSchema: ZodSchema = z.object({
  name: z.string().min(1, 'Nome da Jornada é obrigatório'),
  journeyId: z.string().min(1, "JOurneyID necessario")
});

export type TrailSchemaData = z.infer<typeof trailsSchema>;
