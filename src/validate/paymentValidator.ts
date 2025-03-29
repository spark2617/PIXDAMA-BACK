import { z } from "zod";
import { validateCPF } from "./user.schema";

export const paymentSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  price: z.number().positive("O preço deve ser um número maior que zero."),
  payerEmail: z.string().email("O email do pagador deve ser válido."),
  cpf:z.string().refine(validateCPF, {message: "CPF inválido",})
});
