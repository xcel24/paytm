import { useNavigate } from 'react-router-dom';

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className='flex justify-between px-4 mt-3'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center justify-center w-10 h-10 bg-gray-300 text-black font-bold rounded-full'>
          {user.firstName[0]}
        </div>
        <h4 className='ml-6 text-2xl'>
          {user.firstName + ' ' + user.lastName}
        </h4>
      </div>
      <button
        className='bg-black text-white mt-5 rounded-lg py-2 px-4 font-normal text-lg'
        onClick={() => navigate(`/send?userId=${user._id}`)}
      >
        Send Money
      </button>
    </div>
  );
}

export default User;
