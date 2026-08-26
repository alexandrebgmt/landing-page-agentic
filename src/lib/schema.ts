import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Insira um e-mail válido corporativo ou pessoal"),
  company: z.string().min(2, "Informe o nome da empresa ou projeto"),
  dataVolume: z.string().min(1, "Selecione o volume de dados estimado"),
  pipelineChallenge: z.string().min(5, "Descreva brevemente seu objetivo ou desafio"),
  bot_field: z.string().optional(),
});

export type LeadFormData = z.infer<typeof LeadSchema>;
