import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Welcome, {getUser()?.email}</h2>
        <button className="text-red-500" onClick={() => {
          logout();
          navigate('/');
        }}>Logout</button>
      </div>
      <ChatWindow />
    </div>
  );
}
