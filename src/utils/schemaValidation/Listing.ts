import { z as zod } from 'zod';

export const listingSchemaValidation = zod.object({
  name: zod
    .string()
    .nonempty({ message: 'Name is required' })
    .min(10, { message: 'Name must be at least 10 characters' })
    .max(15, { message: 'Name must not exceed 15 characters' }),
  address: zod
    .string()
    .nonempty({ message: 'Address is required' })
    .max(100, { message: 'Address must not exceed 100 characters' }),
  description: zod
    .string()
    .nonempty({ message: 'Description is required' })
    .max(100, { message: 'Description must not exceed 10 characters' }),
  bedRoom: zod.number().min(0, { message: 'Bed Room must be at least 0' }),
  bathRoom: zod.number().min(0, { message: 'Path Room must be at least 0' }),
  regularPrice: zod.number().min(0, { message: 'Price must be at least 0' }),
  discountedPrice: zod.number().min(0, { message: 'Discounted must be at least 0' }),
  type: zod.enum(['rent', 'sale']),
  parking: zod.boolean(),
  furnished: zod.boolean(),
  offer: zod.boolean(),
  latitude: zod.number(),
  longitude: zod.number(),
});
