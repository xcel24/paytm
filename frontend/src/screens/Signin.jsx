import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signinHandler = () => {
    setLoading(true);

    const signinRequest = {
      username: email,
      password,
    };

    fetch('http://localhost:3000/api/v1/user/signin', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(signinRequest),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      setLoading(false);

      localStorage.setItem('token', JSON.stringify(data.token));

      navigate('/');
    });
  };

  return (
    <div className='bg-slate-300 h-screen flex'>
      {loading === true ? (
        <div className=' text-3xl font-bold'>Loading..</div>
      ) : (
        <div className='p-4 shadow-xl bg-white w-[350px] m-auto rounded-xl'>
          <div>
            <h3 className='font-bold text-center text-3xl'>Sign In</h3>
            <h4 className='text-gray-500 font-light mt-3 text-center px-4 leading-6'>
              Enter your credentials to access your account
            </h4>

            <div className='px-2 my-3'>
              <h6 className='text-[16px] font-normal font-sans'>Email</h6>
              <input
                type='email'
                placeholder='Enter email'
                className='px-2 py-1 rounded-lg my-1 border-gray-200 border-2 w-full focus:outline-none'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='px-2 my-3'>
              <h6 className='text-[16px] font-normal font-sans'>Password</h6>
              <input
                type='password'
                placeholder='Enter password'
                className='px-2 py-1 rounded-lg my-1 border-gray-200 border-2 w-full focus:outline-none'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className='bg-black text-white w-full mt-3 rounded-lg py-2 px-2'
              onClick={signinHandler}
            >
              Sign In
            </button>
          </div>
          <div className='my-2 text-center py-2'>
            Don't have an account?{' '}
            <Link to={'/signup'} className='underline'>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
