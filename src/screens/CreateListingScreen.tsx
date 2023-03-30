import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/Button';
import Spinner from 'components/Spinner';
import { auth, db } from 'config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { listingSchemaValidation } from 'utils/index';
import { v4 as uuidv4 } from 'uuid';
import { z as zod } from 'zod';

type ValidationSchemaT = zod.infer<typeof listingSchemaValidation>;

export default function OffersScreen() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
  const [user, error] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
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
      latitude: 0,
      longitude: 0,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImageFiles([...files]);
      const fileArray = Array.from(files);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewArray]);
    }
  };

  async function storeImage(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = `${user?.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log('Upload failed');
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  }

  const onSubmit: SubmitHandler<ValidationSchemaT> = async (data) => {
    setLoading(true);
    const geolocation = {
      lat: data.latitude || -8.3405389,
      lng: data.longitude || 115.0919509,
    };

    try {
      // const result = listingSchemaValidation.parse(data);
      // console.log('Valid data:', result);

      if (imageFiles.length) {
        const imgUrls = await Promise.all([...imageFiles].map((image) => storeImage(image))).catch((error) => {
          setLoading(false);
          toast.error('Images not uploaded');
        });

        const formDataCopy = {
          ...data,
          imgUrls,
          geolocation,
          timestamp: serverTimestamp(),
          userRef: user?.uid,
        };

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

        setLoading(false);
        toast.success('Listing created');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className='py-20'>
      <h1 className='mt-6 text-center text-3xl font-bold'>Create Listing</h1>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12'>
        <div className='flex w-full max-w-md flex-col space-y-4'>
          <form className='flex w-full flex-col space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className='text-xl font-semibold md:text-lg'>Sell/Rent</p>
              <div className='flex items-center space-x-5'>
                <Button
                  color={watch('type') === 'rent' ? 'white' : 'slate'}
                  buttonClassName={watch('type') === 'rent' ? 'text-black' : 'text-white'}
                  type='button'
                  onClick={() => setValue('type', 'sale')}
                >
                  Sell
                </Button>
                <Button
                  color={watch('type') === 'sale' ? 'white' : 'slate'}
                  buttonClassName={watch('type') === 'sale' ? 'text-black' : 'text-white'}
                  type='button'
                  onClick={() => setValue('type', 'rent')}
                >
                  Rent
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor='name' className='text-xl font-semibold md:text-lg'>
                Name
              </label>
              <input
                className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                  errors.name ? ' border border-red-500 bg-[#ffe6e6]' : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                type='text'
                id='name'
                {...register('name')}
                placeholder={`${errors.name ? '' : 'Name'}`}
              />
              {errors.name && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.name?.message}</p>}
            </div>

            <div className='flex w-full items-center justify-between space-x-5'>
              <div>
                <div>
                  <label htmlFor='beds' className='text-xl font-semibold md:text-lg'>
                    Bed Rooms
                  </label>
                </div>
                <input
                  className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.bedRoom
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type='number'
                  id='bedRoom'
                  min='0'
                  {...register('bedRoom', { valueAsNumber: true })}
                  placeholder={`${errors.bedRoom ? '' : ''}`}
                />
                {errors.bedRoom && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.bedRoom?.message}</p>}
              </div>

              <div>
                <div>
                  <label htmlFor='beds' className='text-xl font-semibold md:text-lg'>
                    Bath Rooms
                  </label>
                </div>
                <input
                  className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.bathRoom
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type='number'
                  id='bedRoom'
                  min='0'
                  {...register('bathRoom', { valueAsNumber: true })}
                  placeholder={`${errors.bathRoom ? '' : ''}`}
                />
                {errors.bathRoom && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.bathRoom?.message}</p>}
              </div>
            </div>

            <div>
              <p className='text-xl font-semibold md:text-lg'>Parking spot</p>
              <div className='flex items-center space-x-5'>
                <Button
                  color={!watch('parking') ? 'white' : 'slate'}
                  buttonClassName={!watch('parking') ? 'text-black' : 'text-white'}
                  type='button'
                  id='parking'
                  onClick={() => setValue('parking', !getValues('parking'))}
                  // onClick={() => setValue('parking', true)}
                >
                  Yes
                </Button>
                <Button
                  id='parking'
                  color={watch('parking') ? 'white' : 'slate'}
                  buttonClassName={watch('parking') ? 'text-black' : 'text-white'}
                  type='button'
                  // onClick={() => setValue('parking', false)}
                  onClick={() => setValue('parking', !getValues('parking'))}
                >
                  No
                </Button>
              </div>
              {errors.parking && <span className='text-red-500'>{errors.parking.message}</span>}
            </div>

            <div>
              <p className='text-xl font-semibold md:text-lg'>Furnished</p>
              <div className='flex items-center space-x-5'>
                <Button
                  color={!watch('furnished') ? 'white' : 'slate'}
                  buttonClassName={!watch('furnished') ? 'text-black' : 'text-white'}
                  type='button'
                  id='furnished'
                  onClick={() => setValue('furnished', true)}
                >
                  yes
                </Button>
                <Button
                  color={watch('furnished') ? 'white' : 'slate'}
                  buttonClassName={watch('furnished') ? 'text-black' : 'text-white'}
                  type='button'
                  id='furnished'
                  onClick={() => setValue('furnished', false)}
                >
                  no
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor='address' className='text-xl font-semibold md:text-lg'>
                Address
              </label>
              <textarea
                className={`block w-full resize-none appearance-none rounded border p-3  leading-tight shadow transition duration-300 ease-in-out focus:outline-none disabled:cursor-not-allowed ${
                  errors.address
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                rows={3}
                id='address'
                {...register('address')}
                placeholder={`${errors.address ? '' : 'Address'}`}
              />
              {errors.address && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.address?.message}</p>}
            </div>
            {!geolocationEnabled ? (
              <div className='flex w-full space-x-3'>
                <div className='w-full'>
                  <label htmlFor='name' className='text-xl font-semibold md:text-lg'>
                    Latitude
                  </label>
                  <input
                    className='w-full appearance-none rounded border  border-gray-400 bg-white p-3 text-center leading-tight shadow transition duration-300 hover:border-gray-500 focus:outline-none '
                    type='number'
                    id='latitude'
                    min='-90'
                    max='90'
                    {...register('latitude')}
                    placeholder='Latitude'
                  />
                </div>

                <div className='w-full'>
                  <label htmlFor='name' className='text-xl font-semibold md:text-lg'>
                    longitude
                  </label>
                  <input
                    className='w-full appearance-none rounded border  border-gray-400 bg-white p-3 text-center leading-tight shadow transition duration-300 hover:border-gray-500 focus:outline-none '
                    type='number'
                    id='longitude'
                    min='-180'
                    max='180'
                    {...register('longitude')}
                    placeholder='Longitude'
                  />
                </div>
              </div>
            ) : null}
            <div>
              <label htmlFor='address' className='text-xl font-semibold md:text-lg'>
                Description
              </label>
              <textarea
                className={`block w-full resize-none appearance-none rounded border p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed ${
                  errors.description
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                rows={3}
                id='description'
                {...register('description')}
                placeholder={`${errors.description ? '' : 'Description'}`}
              />
              {errors.description && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.description?.message}</p>}
            </div>
            <div>
              <p className='text-xl font-semibold md:text-lg'>Offer</p>
              <div className='flex items-center space-x-5'>
                <Button
                  color={!watch('offer') ? 'white' : 'slate'}
                  buttonClassName={!watch('offer') ? 'text-black' : 'text-white'}
                  type='button'
                  id='offer'
                  onClick={() => setValue('offer', true)}
                >
                  Yes
                </Button>
                <Button
                  color={watch('offer') ? 'white' : 'slate'}
                  buttonClassName={watch('offer') ? 'text-black' : 'text-white'}
                  type='button'
                  id='offer'
                  onClick={() => setValue('offer', false)}
                >
                  no
                </Button>
              </div>
            </div>

            <div className='flex w-full items-center space-x-3'>
              <div>
                <div>
                  <label htmlFor='price' className='text-xl font-semibold md:text-lg'>
                    Regular Price
                  </label>
                </div>
                <input
                  className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                    errors.regularPrice
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  type='number'
                  id='price'
                  min={0}
                  inputMode='numeric'
                  {...register('regularPrice', { valueAsNumber: true })}
                  placeholder={`${errors.regularPrice ? '' : 'Regular Price'}`}
                  defaultValue={0}
                />

                {errors.regularPrice && (
                  <p className='mt-2 pl-1 text-xs text-red-500'>{errors.regularPrice?.message}</p>
                )}
              </div>
              <div className='pt-5'>$ / Month</div>
            </div>

            {watch('offer') ? (
              <div className='flex w-full items-center space-x-3'>
                <div>
                  <div>
                    <label htmlFor='price' className='text-xl font-semibold md:text-lg'>
                      Discounted price
                    </label>
                  </div>
                  <input
                    className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                      errors.discountedPrice
                        ? ' border border-red-500 bg-[#ffe6e6]'
                        : 'border-gray-400 bg-white hover:border-gray-500'
                    } `}
                    type='number'
                    id='discountedPrice'
                    min={0}
                    inputMode='numeric'
                    {...register('discountedPrice', { valueAsNumber: true })}
                    placeholder={`${errors.discountedPrice ? '' : ''}`}
                  />
                  {errors.discountedPrice && (
                    <p className='mt-2 pl-1 text-xs text-red-500'>{errors.discountedPrice?.message}</p>
                  )}
                </div>
                watch('offer')
                {watch('type') === 'rent' && (
                  <div className=''>
                    <p className='w-full whitespace-nowrap pt-5 text-lg'>$ / Month</p>
                  </div>
                )}
              </div>
            ) : null}

            <div>
              <label htmlFor='name' className='text-xl font-semibold md:text-lg'>
                Images
              </label>
              <p className='text-sm'>The first image will be the cover (max 3).</p>
              <input
                disabled={imagePreviews && imagePreviews.length === 3}
                className='w-full appearance-none rounded border  border-gray-400 bg-white p-3 leading-tight shadow  transition duration-300 hover:border-gray-500 focus:outline-none  disabled:cursor-not-allowed'
                type='file'
                id='images'
                onChange={handleImageChange}
                multiple
                required
                max='3'
                accept='.jpg,.png,.jpeg,.webp'
              />

              <div className='flex flex-wrap'>
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className='relative m-2'>
                    <img src={preview} alt='uploaded preview' className='h-32 w-32 rounded-lg object-cover' />
                    <button
                      type='button'
                      className='absolute right-2 top-2 text-red-600 hover:text-red-500'
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
