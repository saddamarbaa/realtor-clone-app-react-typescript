import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { ListingT } from 'types/listing';

type Props = {
  data: ListingT;
  id: string;
};

export default function ListingItem({ data, id }: Props) {
  return (
    <li className='relative m-[10px] overflow-hidden rounded-md bg-white shadow-md transition-shadow duration-150 hover:shadow-xl'>
      <Link className='contents' to={`/category/${data.type}/${id}`}>
        <img
          src={`${data.imgUrls[0]}`}
          alt={data.name}
          className='h-[175px] w-full object-cover transition duration-200 ease-in hover:scale-105'
          loading='lazy'
        />

        {data?.timestamp?.seconds && (
          <div className='absolute left-2 top-2 rounded-md bg-[#3377cc] px-2 py-1 text-xs font-semibold uppercase text-white shadow-lg'>
            <div>{Moment.unix(data?.timestamp?.seconds).fromNow()}</div>
          </div>
        )}
        <div className='w-full p-[10px]'>
          <div className='flex items-center space-x-1'>
            <MdLocationOn className='h-4 w-4 text-green-600' />
            <p>{data.address}</p>
          </div>
          <p className='m-0 truncate text-xl font-semibold'>{data.name}</p>

          <p className='mt-2 font-semibold text-[#457b9d]'>
            {`${data.offer ? data.discountedPrice : data.regularPrice}`} {data?.type === 'rent' ? '/ Month' : ''}
          </p>

          <div className='mt-[10px] flex items-center space-x-3'>
            <div className='flex items-center space-x-1'>
              <p className='text-xs font-bold'>
                {data.bathRoom > 1 ? `${data.bathRoom} Bath Rooms` : `${data.bathRoom} Bath Room`}
              </p>
            </div>
            <div className='flex items-center space-x-1'>
              <p className='text-xs font-bold'>
                {data.bedRoom > 1 ? `${data.bedRoom} Bed Rooms` : `${data.bedRoom} Bed Room`}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
