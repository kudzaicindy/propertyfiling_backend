'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Property Filing System API
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the Property Filing System backend API
        </p>
        <div className="space-y-4">
          <p className="text-gray-700">
            Available endpoints:
          </p>
          <ul className="text-left inline-block">
            <li className="mb-2">• GET /api/properties</li>
            <li className="mb-2">• POST /api/properties</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
