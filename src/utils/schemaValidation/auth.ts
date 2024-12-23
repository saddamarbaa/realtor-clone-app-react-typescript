import { z as zod } from 'zod';

export const signUpSchemaValidation = zod
  .object({
    name: zod
      .string()
      .nonempty({ message: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(15, { message: 'Name must not exceed 15 characters' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required' })
      .max(50, { message: 'Email must not exceed 50 characters' })
      .email({ message: 'Email is invalid' }),
    password: zod
      .string()
      .nonempty({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must not exceed 20 characters' }),
    confirmPassword: zod
      .string()
      .nonempty({ message: 'Confirm Password is required' })
      .min(6, { message: 'Confirm Password must be at least 6 characters' })
      .max(20, { message: 'Confirm Password must not exceed 20 characters' })
      .optional(),
    terms: zod.literal(true, {
      errorMap: () => ({ message: 'You must accept Terms and Conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword || !data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Confirm Password does not match',
  });

export const signInSchemaValidation = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .max(50, { message: 'Email must not exceed 50 characters' })
    .email({ message: 'Email is invalid' }),
  password: zod
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(20, { message: 'Password must not exceed 20 characters' }),
  confirmPassword: zod
    .string()
    .nonempty({ message: 'Confirm Password is required' })
    .min(6, { message: 'Confirm Password must be at least 6 characters' })
    .max(20, { message: 'Confirm Password must not exceed 20 characters' })
    .optional(),
});

export const forgotPasswordSchemaValidation = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .max(50, { message: 'Email must not exceed 50 characters' })
    .email({ message: 'Email is invalid' }),
});

export const profileSchemaValidation = zod.object({
  name: zod
    .string()
    .nonempty({ message: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(15, { message: 'Name must not exceed 15 characters' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .max(50, { message: 'Email must not exceed 50 characters' })
    .email({ message: 'Email is invalid' }),
});
