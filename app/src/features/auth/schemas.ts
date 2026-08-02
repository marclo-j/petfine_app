import { z } from 'zod';

/** Esquemas de validación de auth — compartidos entre pantallas (un solo lugar). */

export const emailSchema = z
  .string({ message: 'Ingresa tu correo' })
  .email({ message: 'Correo inválido' });

export const passwordSchema = z
  .string({ message: 'Ingresa una contraseña' })
  .min(8, { message: 'Mínimo 8 caracteres' })
  .regex(/[A-Z]/, { message: 'Debe tener una mayúscula' })
  .regex(/[^A-Za-z0-9]/, { message: 'Debe tener un carácter especial' })
  .refine((v) => !/(12345|qwerty)/i.test(v), {
    message: 'Evita secuencias obvias como "12345" o "qwerty"',
  });

export const verificationCodeSchema = z
  .string({ message: 'Ingresa el código' })
  .min(4, { message: 'Código muy corto' });

export const signInSchema = z.object({ email: emailSchema });
export const createPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const profileDataSchema = z.object({
  firstName: z.string().min(1, { message: 'Ingresa tu nombre' }),
  lastName: z.string().min(1, { message: 'Ingresa tu apellido' }),
  phone: z.string().min(9, { message: 'Ingresa tu celular (+51XXXXXXXXX)' }),
  hasPet: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type CreatePasswordValues = z.infer<typeof createPasswordSchema>;
export type ProfileDataValues = z.infer<typeof profileDataSchema>;
