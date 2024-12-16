
export default function ShimmerCard() {
  return (
    <div className='relative m-[10px] w-full animate-pulse cursor-pointer overflow-hidden rounded-md bg-gray-200'>
      {/* Shimmer for image */}
      <div className='h-[175px] w-full bg-gray-300' />

      {/* Shimmer for text and icons */}
      <div className='w-full p-[10px]'>
        <div className='flex items-center space-x-1'>
          <div className='h-4 w-4 bg-gray-300' />
          <div className='h-4 w-3/4 bg-gray-300' />
        </div>

        <div className='mt-2 h-6 w-2/3 bg-gray-300' />

        <div className='mt-2 h-5 w-1/2 bg-gray-300' />

        <div className='mt-[10px] flex items-center space-x-2'>
          <div className='h-4 w-16 bg-gray-300' />
          <div className='h-4 w-16 bg-gray-300' />
        </div>
      </div>
    </div>
  );
}
