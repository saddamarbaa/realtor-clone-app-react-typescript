import { z as zod } from 'zod';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const listingSchemaValidation = zod.object({
  name: zod
    .string()
    .nonempty({ message: 'Name is required' })
    .min(10, { message: 'Name must be at least 10 characters' })
    .max(15, { message: 'Name must not exceed 15 characters' }),
  address: zod.string().max(100, { message: 'Address must not exceed 100 characters' }),
  description: zod.string().max(100, { message: 'Description must not exceed 10 characters' }),
  bedRoom: zod.number().positive('Bed Room must be a positive number').int('Bed Room must be an integer'),
  bathRoom: zod.number().positive('Bath Room must be a positive number').int('Bath Room must be an integer'),
  price: zod.number().positive('Price must be a positive number').int('Price must be an integer'),
  discountedPrice: zod.number().positive('Price must be a positive number').int('Price must be an integer'),
  images: zod
    .object({
      filename: zod.string(),
      type: zod.string(),
      size: zod.number(),
      data: zod.string().transform((val) => {
        const binaryString = window.atob(val);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }),
    })
    .refine((value) => value.size <= 1024 * 1024 * 10, { message: 'File Size is too large' })
    .refine((value) => SUPPORTED_FORMATS.includes(value.type.toLowerCase()), {
      message: 'We only support jpeg, jpg, png, webp',
    }),
});
