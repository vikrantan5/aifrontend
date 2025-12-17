import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Twitter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TwitterCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const oauth_token = params.get('oauth_token');
      const oauth_verifier = params.get('oauth_verifier');

      if (!oauth_token || !oauth_verifier) {
        setStatus('error');
        toast.error('Invalid callback parameters');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        await axios.post(
          `${API}/twitter/callback?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`,
          {},
          config
        );

        setStatus('success');
        toast.success('Twitter account connected successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        setStatus('error');
        toast.error('Failed to connect Twitter account');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-twitter/10 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-100 rounded-full mb-6">
          <Twitter className={`w-10 h-10 text-brand-600 ${status === 'processing' ? 'animate-pulse' : ''}`} />
        </div>
        
        {status === 'processing' && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Connecting Twitter Account</h2>
            <p className="text-slate-600">Please wait while we complete the connection...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-slate-600">Twitter account connected. Redirecting...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-red-600 mb-2">Connection Failed</h2>
            <p className="text-slate-600">Something went wrong. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterCallback;