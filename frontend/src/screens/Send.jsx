import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Send() {
  const [toAccountUser, setToAccountUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const toAccountId = searchParams.get('userId');

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/${toAccountId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      const data = await res.json();

      setToAccountUser(data);
      setLoading(false);
    });
  }, []);

  const handleTransfer = () => {
    const sendMoneyReq = {
      to: toAccountId,
      amount,
    };

    fetch('http://localhost:3000/api/v1/account/transfer', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify(sendMoneyReq),
    }).then(async (res) => {
      const data = await res.json();

      //alert(data.message);

      navigate('/');
    });
  };

  return (
    <div className='bg-slate-300 h-screen flex'>
      {loading === true ? (
        <div className=' text-3xl font-bold'>Loading..</div>
      ) : (
        <div className='p-6 shadow-xl bg-white w-[350px] m-auto rounded-xl'>
          <div>
            <h3 className='font-bold text-center text-4xl'>Send Money</h3>

            <div className='flex items-center space-x-4 px-2 mt-8'>
              <div className='flex items-center justify-center w-10 h-10 bg-green-500 text-white font-bold rounded-full'>
                {toAccountUser.firstName[0]}
              </div>

              <span className='text-lg font-semibold'>
                {toAccountUser.firstName + ' ' + toAccountUser.lastName}
              </span>
            </div>

            <div className='px-2 mt-5'>
              <h6 className='text-sm font-normal font-sans mb-2'>
                Amount (in Rs.)
              </h6>
              <input
                type='text'
                placeholder='Enter amount'
                className='px-2 py-1 rounded-lg my-1 border-gray-200 border-2 w-full focus:outline-none'
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
            </div>

            <button
              className='bg-green-500 text-white w-full mt-5 rounded-lg py-2 px-2'
              onClick={handleTransfer}
            >
              Initiate Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Send;
