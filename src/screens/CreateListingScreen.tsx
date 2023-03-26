import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { FaTrash } from 'react-icons/fa';

import Button from '../components/Button';
import { listingSchemaValidation } from '../utils/schemaValidation/Listing';

type ValidationSchemaT = zod.infer<typeof listingSchemaValidation>;

export default function OffersScreen() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ValidationSchemaT>({
    resolver: zodResolver(listingSchemaValidation),
  });

  useEffect(() => {
    reset({
      bedRoom: 2,
      bathRoom: 1,
      regularPrice: 0,
      discountedPrice: 0,
      type: 'rent',
      parking: false,
      furnished: false,
      offer: false,
      // latitude: 0,
      // longitude: 0,
    });
  }, []);

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const onSubmit: SubmitHandler<ValidationSchemaT> = async (data) => {
    console.log(data);
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

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewArray]);
      // reset({ images: [...fileArray] });
    }
  };

  return (
    <section className="py-20">
      <h1 className="mt-6 text-center text-3xl font-bold">Create Listing</h1>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col space-y-4">
          <form className="flex w-full flex-col space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className="text-xl font-semibold md:text-lg">Sell/Rent</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={watch('type') === 'rent' ? 'white' : 'slate'}
                  buttonClassName={watch('type') === 'rent' ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={() => setValue('type', 'sale')}
                >
                  Sell
                </Button>
                <Button
                  color={watch('type') === 'sale' ? 'white' : 'slate'}
                  buttonClassName={watch('type') === 'sale' ? 'text-black' : 'text-white'}
                  type="button"
                  onClick={() => setValue('type', 'rent')}
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
                  {...register('bedRoom', { valueAsNumber: true })}
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
                  {...register('bathRoom', { valueAsNumber: true })}
                  placeholder={`${errors.bathRoom ? '' : ''}`}
                />
                {errors.bathRoom && <p className="mt-2 pl-1 text-xs text-red-500">{errors.bathRoom?.message}</p>}
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold md:text-lg">Parking spot</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={!watch('parking') ? 'white' : 'slate'}
                  buttonClassName={!watch('parking') ? 'text-black' : 'text-white'}
                  type="button"
                  id="parking"
                  onClick={() => setValue('parking', !getValues('parking'))}
                  // onClick={() => setValue('parking', true)}
                >
                  Yes
                </Button>
                <Button
                  id="parking"
                  color={watch('parking') ? 'white' : 'slate'}
                  buttonClassName={watch('parking') ? 'text-black' : 'text-white'}
                  type="button"
                  // onClick={() => setValue('parking', false)}
                  onClick={() => setValue('parking', !getValues('parking'))}
                >
                  No
                </Button>
              </div>
              {errors.parking && <span className="text-red-500">{errors.parking.message}</span>}
            </div>

            <div>
              <p className="text-xl font-semibold md:text-lg">Furnished</p>
              <div className="flex items-center space-x-5">
                <Button
                  color={!watch('furnished') ? 'white' : 'slate'}
                  buttonClassName={!watch('furnished') ? 'text-black' : 'text-white'}
                  type="button"
                  id="furnished"
                  onClick={() => setValue('furnished', true)}
                >
                  yes
                </Button>
                <Button
                  color={watch('furnished') ? 'white' : 'slate'}
                  buttonClassName={watch('furnished') ? 'text-black' : 'text-white'}
                  type="button"
                  id="furnished"
                  onClick={() => setValue('furnished', false)}
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
                  color={!watch('offer') ? 'white' : 'slate'}
                  buttonClassName={!watch('offer') ? 'text-black' : 'text-white'}
                  type="button"
                  id="offer"
                  onClick={() => setValue('offer', true)}
                >
                  Yes
                </Button>
                <Button
                  color={watch('offer') ? 'white' : 'slate'}
                  buttonClassName={watch('offer') ? 'text-black' : 'text-white'}
                  type="button"
                  id="offer"
                  onClick={() => setValue('offer', false)}
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
                    errors.regularPrice
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type="number"
                  id="price"
                  min={0}
                  inputMode="numeric"
                  {...register('regularPrice', { valueAsNumber: true })}
                  placeholder={`${errors.regularPrice ? '' : 'Regular Price'}`}
                  defaultValue={0}
                />

                {errors.regularPrice && (
                  <p className="mt-2 pl-1 text-xs text-red-500">{errors.regularPrice?.message}</p>
                )}
              </div>
              <div className="pt-5">$ / Month</div>
            </div>

            {watch('offer') ? (
              <div className="flex w-full items-center space-x-3">
                <div>
                  <div>
                    <label htmlFor="price" className="text-xl font-semibold md:text-lg">
                      Discounted price
                    </label>
                  </div>
                  <input
                    className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                      errors.discountedPrice
                        ? ' border border-red-500 bg-[#ffe6e6]'
                        : 'border-gray-400 bg-white hover:border-gray-500'
                    } `}
                    type="number"
                    id="discountedPrice"
                    min={0}
                    inputMode="numeric"
                    {...register('discountedPrice', { valueAsNumber: true })}
                    placeholder={`${errors.discountedPrice ? '' : ''}`}
                  />
                  {errors.discountedPrice && (
                    <p className="mt-2 pl-1 text-xs text-red-500">{errors.discountedPrice?.message}</p>
                  )}
                </div>
                watch('offer')
                {watch('type') === 'rent' && (
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
              <p className="text-sm">The first image will be the cover (max 3).</p>
              <input
                disabled={imagePreviews && imagePreviews.length == 3}
                className={`focus:shadow-outline w-full appearance-none rounded border  border-gray-400 bg-white p-3 leading-tight shadow  transition duration-300 hover:border-gray-500 focus:outline-none  disabled:cursor-not-allowed`}
                // {...register('images')}
                type="file"
                id="images"
                onChange={onFileSelect}
                multiple
                required
                max="3"
                accept=".jpg,.png,.jpeg,.webp"
              />

              <div className="flex flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className="relative m-2">
                    <img src={preview} alt="uploaded preview" className="h-32 w-32 rounded-lg object-cover" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 hover:text-red-500"
                      onClick={() => removeImage(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <Button> Create Listing</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
