import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import { useWallet } from './hooks/useWallet';
import ConnectWallet from './pages/ConnectWallet';

function App() {
  const { connected } = useWallet();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connect" element={<ConnectWallet />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route 
          path="/chat/:channelId?" 
          element={connected ? <Chat /> : <Navigate to="/connect" />} 
        />
        <Route 
          path="/profile" 
          element={connected ? <Profile /> : <Navigate to="/connect" />} 
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
