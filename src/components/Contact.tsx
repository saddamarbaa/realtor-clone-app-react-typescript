import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { db } from 'config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ListingT } from 'types/listing';

import Button from './Button';

type FormValues = {
  message: string;
};

type Props = {
  listing: ListingT | null;
};

export default function Contact({ listing }: Props) {
  const [owner, setOwner] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    async function fetchOwnerInfo() {
      const docRef = doc(db, 'users', listing?.userRef as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        const data = { ...docSnap.data() };
        setOwner(data);
      }
    }
    fetchOwnerInfo();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    toast.success('Your email is been send');
    reset({
      message: '',
    });
    // setIsSuccess(true);
  };

  return owner ? (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-8 flex w-full flex-col space-y-5'>
      <div>
        <label htmlFor='message' className='text-xl font-semibold md:text-lg'>
          Contact <span className='text-red-500'>{owner.email}</span> for {listing?.name}
        </label>
        <textarea
          disabled={isSuccess}
          className={`block w-full resize-none appearance-none rounded border p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed ${
            errors.message ? ' border border-red-500 bg-[#ffe6e6]' : 'border-gray-400 bg-white hover:border-gray-500'
          } `}
          rows={3}
          id='message'
          {...register('message', { required: 'Message is required' })}
          placeholder='Type your message'
        />
        {errors.message && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.message?.message}</p>}
      </div>
      <Button type='submit' buttonClassName='text-white uppercase font-bold' isDisabled={isSuccess}>
        Send Message
      </Button>
    </form>
  ) : null;
}
