import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../components/User';

function Dashboard() {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));
  const [userName, setUserName] = useState('');
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [showQueryUsers, setShowQueryUsers] = useState(false);
  const [queryUsers, setQueryUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/signin');
    else {
      console.log(token);
      fetch('http://localhost:3000/api/v1/user', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        const data = await res.json();

        const { firstName, lastName } = data.user;

        setUserName(firstName + ' ' + lastName);
        setBalance(Math.round(data.balance.balance));

        fetch('http://localhost:3000/api/v1/user/all', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then(async (res) => {
          const data = await res.json();

          console.log(data);

          setUsers(data);
        });
      });
    }
  }, []);

  const handleSearch = (query) => {
    fetch(`http://localhost:3000/api/v1/user/bulk?filter=${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      const data = await res.json();

      setQueryUsers(data.users);
      setShowQueryUsers(true);
    });
  };

  return (
    <div className='p-4'>
      <div className='shadow-xl flex justify-between p-4 items-center'>
        <div className='font-bold text-3xl'>PayTM App</div>
        <div className='flex items-center px-6'>
          <h3 className='mr-3 text-lg'>Hello</h3>
          <div className='flex items-center justify-center w-10 h-10 bg-gray-300 text-black font-bold rounded-full'>
            {userName[0]}
          </div>
        </div>
      </div>
      <div className='flex justify-between w-1/5 mt-5 text-2xl px-4 font-semibold'>
        <h3>Your balance </h3>
        <h3>${balance}</h3>
      </div>

      {/* Search bar */}
      <div className='px-4 mt-6 font-semibold text-2xl'>
        <h4>Users</h4>
        <div>
          <input
            type='text'
            placeholder='Search users...'
            className='px-2 py-1 rounded-lg mt-3 border-gray-200 border-2 w-full focus:outline-none font-normal text-gray-400 text-lg'
            onInput={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users */}
      {showQueryUsers && queryUsers
        ? queryUsers.map((queryUser) => {
            return <User key={queryUser._id} user={queryUser} />;
          })
        : users &&
          users.map((user) => {
            return <User key={user._id} user={user} />;
          })}
    </div>
  );
}

export default Dashboard;
