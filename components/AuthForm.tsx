//Authentication form component
//app/components/AuthForm.tsx

'use client';

import { useState } from 'react';
import { Church } from 'lucide-react';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [churchName, setChurchName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: 1,
        email,
        name: mode === 'signup' ? name : email.split('@')[0],
        role: mode === 'signup' ? 'pastor' : 'member',
        churchName: mode === 'signup' ? churchName : 'Grace Community Church',
      };

      localStorage.setItem('token', 'demo_token');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('church', churchName || 'Grace Community Church');

      setLoading(false);
      onSuccess?.();
      window.location.reload(); // Simple reload to reflect auth state
    }, 1000);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-white/30">
      <div className="text-center mb-4">
        <div className="flex justify-center mb-3">
          <Church className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {mode === 'login' ? 'Welcome Back' : 'Join ChurchTrack'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {mode === 'login' ? 'Sign in to manage your church' : 'Start managing your church ministry'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Church Name"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
                required
              />
            </div>
          </>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
            required
          />
        </div>

        {mode === 'signup' && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-50/80 backdrop-blur-sm text-red-700 rounded text-xs border border-red-200/50">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2" />
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            mode === 'login' ? 'Sign In' : 'Get Started'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-300"
          >
            {mode === 'login'
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </form>
    </div>
  );
}