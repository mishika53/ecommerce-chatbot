// import React from 'react';
// import ChatInterface from './components/ChatInterface';

// function App() {
//   return (
//     <div className="h-screen bg-gray-100">
//       <ChatInterface />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
