import { useState } from 'react';
import { login } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/chat');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login to ShopBot</h2>
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border mb-2" type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-4" type="password" placeholder="Enter password" required />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">Login</button>
      </form>
    </div>
  );
}
