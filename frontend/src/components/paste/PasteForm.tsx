'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { withMinimumDelay } from '@/lib/utils';
import { ErrorResponse } from '@/types/api';

import LoadingDots from '../ui/LoadingDots';
import PasteBlock from '../ui/PasteBlock';

const expiryOptions = [
  { label: 'Minutes', value: 'minutes' },
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' },
];

export default function PasteForm() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expiryValue, setExpiryValue] = useState<number | ''>('');
  const [expiryUnit, setExpiryUnit] = useState('days');
  const [viewLimit, setViewLimit] = useState<number | ''>('');
  const [pasteId, setPasteId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const pasteUrl = pasteId && origin ? `${origin}/paste/${pasteId}` : null;

  const calculateExpiryDate = () => {
    if (!expiryValue || isNaN(expiryValue)) return null;
    const now = new Date();
    const value = Number(expiryValue);
    switch (expiryUnit) {
      case 'minutes':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'hours':
        now.setHours(now.getHours() + value);
        break;
      case 'days':
        now.setDate(now.getDate() + value);
        break;
      case 'weeks':
        now.setDate(now.getDate() + value * 7);
        break;
      case 'months':
        now.setMonth(now.getMonth() + value);
        break;
      case 'years':
        now.setFullYear(now.getFullYear() + value);
        break;
    }
    return now.toISOString();
  };

  // Memoize API URL for efficiency
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }
    setLoading(true);
    setError(null);
    setPasteId(null);

    try {
      const expiryDate = calculateExpiryDate();
      const requestBody = { content, password, expiryDate, viewLimit };

      const filteredRequestBody = Object.fromEntries(
        Object.entries(requestBody).filter(
          ([_key, v]) => v !== undefined && v !== null && v !== '',
        ),
      );

      const res = await withMinimumDelay(
        fetch(`${apiUrl}/paste/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filteredRequestBody),
        }),
        1000,
      );

      if (!res.ok) {
        const reponse: ErrorResponse = await res.json();
        throw new Error(reponse.message);
      }

      const data = await res.json();
      setPasteId(data.id);

      // Reset form
      setContent('');
      setPassword('');
      setExpiryValue('');
      setExpiryUnit('days');
      setViewLimit('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-semibold">Create a New Paste</h2>

        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Enter your paste content..."
          className="input-base resize-y"
        />

        {/* Password Field */}
        <div className="mt-4 relative">
          <label className="block text-sm font-medium mb-1">
            Password (optional)
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            minLength={5}
            maxLength={10}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a password"
            className="input-base pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Expiry Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Expiry (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={expiryValue}
              onChange={(e) =>
                setExpiryValue(
                  e.target.value === '' ? '' : parseInt(e.target.value),
                )
              }
              className="input-base w-1/2"
              placeholder="e.g. 10"
            />
            <select
              value={expiryUnit}
              onChange={(e) => setExpiryUnit(e.target.value)}
              className="input-base w-1/2"
            >
              {expiryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* View Limit Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            View Limit (optional)
          </label>
          <input
            type="number"
            min={1}
            value={viewLimit}
            onChange={(e) =>
              setViewLimit(
                e.target.value === '' ? '' : parseInt(e.target.value),
              )
            }
            placeholder="e.g. 10 views max"
            className="input-base"
          />
        </div>

        {error && <p className="error-text mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="button-submit-base w-full mt-6"
        >
          {loading ? <LoadingDots /> : 'Create Paste'}
        </button>
      </form>

      {pasteUrl && (
        <div className="mt-6 p-4 border rounded bg-green-50 text-green-800">
          <PasteBlock title="Paste created! URL:" content={pasteUrl} />
          <button
            onClick={() => router.push(`/paste/${pasteId}`)}
            className="button-submit-base mt-4"
          >
            Go to Paste
          </button>
        </div>
      )}
    </div>
  );
}
