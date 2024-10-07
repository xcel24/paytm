import { Routes, Route } from 'react-router-dom';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Signin from './screens/Signin';
import Send from './screens/Send';
import ErrorScreen from './screens/ErrorScreen';

function App() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/send' element={<Send />} />
      <Route path='*' element={<ErrorScreen />} />
    </Routes>
  );
}

export default App;
