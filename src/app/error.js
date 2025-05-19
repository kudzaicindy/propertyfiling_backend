'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-xl text-gray-600 mb-8">{error?.message || 'Something went wrong'}</p>
        <button
          onClick={reset}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 