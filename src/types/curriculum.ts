import { z } from "zod";

export const CurriculumStatusSchema = z.enum(["LOCKED", "DEVELOPING", "UNKNOWN", "RETIRED"]);
export const CurriculumKindSchema = z.enum(["PROMISE", "MODULE_OUTCOME", "NONCONTRADICTION"]);

export const CurriculumEntryInputSchema = z.object({
  programId: z.string().min(1),
  kind: CurriculumKindSchema,
  title: z.string().min(1),
  status: CurriculumStatusSchema.default("LOCKED"),
  content: z.string().min(1),
  tags: z.array(z.string()).default([])
});

export type CurriculumStatus = z.infer<typeof CurriculumStatusSchema>;
export type CurriculumKind = z.infer<typeof CurriculumKindSchema>;
export type CurriculumEntryInput = z.infer<typeof CurriculumEntryInputSchema>;
