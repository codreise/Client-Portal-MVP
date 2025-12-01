import { useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { token } = await api.login({ email: form.email, password: form.password });
        onAuth(token, { email: form.email });
        toast.success("Login successful!");
      } else {
        const { token, user } = await api.register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        onAuth(token, user);
        toast.success("Registration successful!");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg text-text">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-medium dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : mode === 'login' ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          {mode === 'login' ? (
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setMode('register')}
            >
              Need an account? Register
            </button>
          ) : (
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setMode('login')}
            >
              Have an account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}