import { z } from 'zod';

export const EmailType = z.string().min(1, { message: 'email is required' }).email();
export const PasswordType = z.string().min(1, { message: 'password is required' });
export const FirstNameType = z.string().optional();
export const LastNameType = z.string().optional();
export const TokenType = z.string();
export const IDType = z.string();
export const UserType = z.object({
  id: IDType,
  email: EmailType,
  firstName: FirstNameType,
  lastName: LastNameType,
});
