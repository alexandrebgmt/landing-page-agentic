import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Insira um e-mail corporativo válido"),
  company: z.string().min(2, "Informe o nome da sua empresa"),
  dataVolume: z.enum(["< 100 GB", "100 GB - 1 TB", "1 TB - 10 TB", "> 10 TB"], {
    errorMap: () => ({ message: "Selecione a faixa de volume de dados" }),
  }),
  pipelineChallenge: z
    .string()
    .min(10, "Descreva brevemente o desafio dos seus dados"),
  honeypot: z.string().max(0, "Tentativa de bot detectada"),
});

export type LeadFormData = z.infer<typeof LeadSchema>;
