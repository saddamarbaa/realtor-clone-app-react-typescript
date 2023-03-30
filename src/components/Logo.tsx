import { useNavigate } from 'react-router';

export default function Logo() {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src='./rdc-logo-default.svg'
        alt='Realtor Logo'
        className='h-6 cursor-pointer'
        onClick={() => navigate('/')}
      />
    </div>
  );
}
