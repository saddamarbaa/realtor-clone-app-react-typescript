import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Button from '../components/Button';
import { listingSchemaValidation } from '../utils/schemaValidation/Listing';

type ValidationSchemaT = zod.infer<typeof listingSchemaValidation>;
export default function CreateListingScreen() {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    address,
    furnished,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ValidationSchemaT>({
    resolver: zodResolver(listingSchemaValidation, { parseNumber }),
  });

  useEffect(() => {
    reset({
      bedRoom: 2,
      bathRoom: 1,
      price: 0,
      discountedPrice: 0,
    });
  }, []);

  type Image = {
    filename: string;
    type: string;
    size: number;
    data: ArrayBuffer;
  };

  const toImages = (files: FileList): Promise<Image[]> => {
    return Promise.all(
      Array.from(files).map((file) => {
        return new Promise<Image>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const profileImage: Image = {
              filename: file.name,
              type: file.type,
              size: file.size,
              data: reader.result as ArrayBuffer,
            };
            resolve(profileImage);
          };
          reader.onerror = (error) => reject(error);
        });
      })
    );
  };

  const onSubmit: SubmitHandler<ValidationSchemaT> = async (data) => {
    data.discountedPrice = Number(data.discountedPrice); // Parse the input as a number
    try {
      const result = listingSchemaValidation.parse(data);
      console.log('Valid data:', result);
      // TODO: Submit form data to server
      return result; // return the validated data object
    } catch (error) {
      console.error('Validation error:', error);
      // TODO: Handle validation errors
      throw error;
    }
  };

  const onchangeHandler = () => {};
  return (
    <section className="py-20" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mt-6 text-center text-3xl font-bold">Create Listing</h1>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col space-y-4">
          <form className="flex w-full flex-col space-y-6">
            <div>
              <p className="text-xl font-semibold md:text-lg">Sell/Rent</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={type === 'rent' ? 'white' : 'slate'}
                  buttonClassName={type === 'rent' ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={onchangeHandler}
                >
                  Sell
                </Button>
                <Button
                  color={type === 'sale' ? 'white' : 'slate'}
                  buttonClassName={type === 'sale' ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={onchangeHandler}
                >
                  Rent
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="text-xl font-semibold md:text-lg">
                Name
              </label>
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                  errors.name ? ' border border-red-500 bg-[#ffe6e6]' : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                type="text"
                id="name"
                {...register('name')}
                placeholder={`${errors.name ? '' : 'Name'}`}
              />
              {errors.name && <p className="mt-2 pl-1 text-xs text-red-500">{errors.name?.message}</p>}
            </div>

            <div className="flex w-full items-center justify-between space-x-5">
              <div>
                <div>
                  <label htmlFor="beds" className="text-xl font-semibold md:text-lg">
                    Bed Rooms
                  </label>
                </div>
                <input
                  className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.bedRoom
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type="number"
                  id="bedRoom"
                  min="0"
                  {...register('bedRoom')}
                  placeholder={`${errors.bedRoom ? '' : ''}`}
                />
                {errors.bedRoom && <p className="mt-2 pl-1 text-xs text-red-500">{errors.bedRoom?.message}</p>}
              </div>

              <div>
                <div>
                  <label htmlFor="beds" className="text-xl font-semibold md:text-lg">
                    Bath Rooms
                  </label>
                </div>
                <input
                  className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.bathRoom
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type="number"
                  id="bedRoom"
                  min="0"
                  {...register('bathRoom')}
                  placeholder={`${errors.bathRoom ? '' : ''}`}
                />
                {errors.bathRoom && <p className="mt-2 pl-1 text-xs text-red-500">{errors.bathRoom?.message}</p>}
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold md:text-lg">Parking spot</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={!parking ? 'white' : 'slate'}
                  buttonClassName={!parking ? 'text-black' : 'text-white'}
                  type="button"
                  id="parking"
                  onClick={onchangeHandler}
                >
                  Yes
                </Button>
                <Button
                  id="parking"
                  color={parking ? 'white' : 'slate'}
                  buttonClassName={parking ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={onchangeHandler}
                >
                  no
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold md:text-lg">Furnished</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={!furnished ? 'white' : 'slate'}
                  buttonClassName={!furnished ? 'text-black' : 'text-white'}
                  type="button"
                  id="furnished"
                  onClick={onchangeHandler}
                >
                  yes
                </Button>
                <Button
                  color={furnished ? 'white' : 'slate'}
                  buttonClassName={furnished ? 'text-black' : 'text-white'}
                  type="button"
                  id="furnished"
                  onClick={() => {}}
                >
                  no
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="text-xl font-semibold md:text-lg">
                Address
              </label>
              <textarea
                className={`focus:shadow-outline block w-full resize-none appearance-none rounded border p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed ${
                  errors.address
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                rows={3}
                id="address"
                {...register('address')}
                placeholder={`${errors.address ? '' : 'Address'}`}
              />
              {errors.address && <p className="mt-2 pl-1 text-xs text-red-500">{errors.address?.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className="text-xl font-semibold md:text-lg">
                Description
              </label>
              <textarea
                className={`focus:shadow-outline block w-full resize-none appearance-none rounded border p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed ${
                  errors.description
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                rows={3}
                id="description"
                {...register('description')}
                placeholder={`${errors.description ? '' : 'Description'}`}
              />
              {errors.description && <p className="mt-2 pl-1 text-xs text-red-500">{errors.description?.message}</p>}
            </div>

            <div>
              <p className="text-xl font-semibold md:text-lg">Offer</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={!offer ? 'white' : 'slate'}
                  buttonClassName={!offer ? 'text-black' : 'text-white'}
                  type="button"
                  id="offer"
                  onClick={onchangeHandler}
                >
                  Yes
                </Button>
                <Button
                  id="offer"
                  color={parking ? 'white' : 'slate'}
                  buttonClassName={offer ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={onchangeHandler}
                >
                  no
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center space-x-3">
              <div>
                <div>
                  <label htmlFor="price" className="text-xl font-semibold md:text-lg">
                    Regular Price
                  </label>
                </div>
                <input
                  className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.price
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type="number"
                  id="price"
                  min="0"
                  {...register('price')}
                  placeholder={`${errors.price ? '' : ''}`}
                />
                {errors.price && <p className="mt-2 pl-1 text-xs text-red-500">{errors.price?.message}</p>}
              </div>
              <div className="pt-5">$ / Month</div>
            </div>

            {offer ? (
              <div className="flex w-full items-center space-x-3">
                <div>
                  <div>
                    <label htmlFor="price" className="text-xl font-semibold md:text-lg">
                      Discounted price
                    </label>
                  </div>
                  <input
                    className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                      errors.price
                        ? ' border border-red-500 bg-[#ffe6e6]'
                        : 'border-gray-400 bg-white hover:border-gray-500'
                    } `}
                    type="number"
                    id="discountedPrice"
                    min="0"
                    {...register('discountedPrice', {
                      setValueAs: (value) => parseInt(value),
                    })}
                    {...register('discountedPrice')}
                    placeholder={`${errors.discountedPrice ? '' : ''}`}
                  />
                  {errors.discountedPrice && (
                    <p className="mt-2 pl-1 text-xs text-red-500">{errors.discountedPrice?.message}</p>
                  )}
                </div>
                {type === 'rent' && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap pt-5">$ / Month</p>
                  </div>
                )}
              </div>
            ) : null}

            <div>
              <label htmlFor="name" className="text-xl font-semibold md:text-lg">
                Images
              </label>
              <p className="text-sm">The first image will be the cover (max 6).</p>
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                  errors.images
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                type="file"
                id="images"
                accept=".jpg,.png,.jpeg,.webp"
                multiple
                required
                {...register('images')}
              />
              {errors.images && <p className="mt-2 pl-1 text-xs text-red-500">{errors.images?.message}</p>}
            </div>

            <Button> Create Listing</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
