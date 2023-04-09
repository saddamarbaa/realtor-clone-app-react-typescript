import { FaTrash } from 'react-icons/fa';
import { MdEdit, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Moment from 'moment';
import { ListingT } from 'types/listing';

type Props = {
  data: ListingT;
  id: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function ListingItem({ onDelete, onEdit, data, id }: Props) {
  return (
    <motion.li
      className='relative m-[10px] overflow-hidden rounded-md bg-white shadow-md transition-shadow duration-150 hover:shadow-xl'
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link className='contents' to={`/category/${data.type}/${id}`}>
        <motion.img
          src={`${data.imgUrls[0]}`}
          alt={data.name}
          className='h-[175px] w-full object-cover transition duration-200 ease-in'
          loading='lazy'
          whileHover={{ scale: 1.05 }}
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
          <motion.p
            className='m-0 truncate text-xl font-semibold'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {data.name}
          </motion.p>

          <motion.p
            className='mt-2 font-semibold text-[#457b9d]'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {`${data.offer ? data.discountedPrice : data.regularPrice}`} {data?.type === 'rent' ? '/ Month' : ''}
          </motion.p>

          <div className='mt-[10px] flex items-center space-x-2'>
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

      {onDelete ? (
        <FaTrash
          className='absolute bottom-3 right-2 cursor-pointer text-sm text-red-500'
          onClick={() => onDelete(data.id)}
        />
      ) : null}
      {onEdit ? <MdEdit className='absolute bottom-9 right-2 cursor-pointer ' onClick={() => onEdit(data.id)} /> : null}
    </motion.li>
  );
}
