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
        const { token, user } = await api.login({ email: form.email, password: form.password });
        onAuth(token, user);
        toast.success("Login successful!");
      } else {
        const { token, user } = await api.register({ name: form.name, email: form.email, password: form.password });
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
    <div className="flex items-center justify-center min-h-screen bg-brand-purpleLight">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-brand-purpleDark mb-6 text-center">
          {mode === 'login' ? 'Login' : 'Register'}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-brand-purpleDark">Name</label>
              <input
                className="w-full border border-brand-purpleDark/20 rounded p-2 focus:ring-2 focus:ring-brand-purpleDark"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-brand-purpleDark">Email</label>
            <input
              type="email"
              className="w-full border border-brand-purpleDark/20 rounded p-2 focus:ring-2 focus:ring-brand-purpleDark"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-purpleDark">Password</label>
            <input
              type="password"
              className="w-full border border-brand-purpleDark/20 rounded p-2 focus:ring-2 focus:ring-brand-purpleDark"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          <button
            className="w-full bg-brand-peach text-brand-purpleDark font-semibold rounded p-2 hover:bg-brand-peachHover transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : "Submit"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          {mode === 'login' ? (
            <button
              className="text-brand-purpleDark hover:underline"
              onClick={() => setMode('register')}
            >
              Need an account? Register
            </button>
          ) : (
            <button
              className="text-brand-purpleDark hover:underline"
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