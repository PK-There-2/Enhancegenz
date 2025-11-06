import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function KVTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testKV = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d9a3ff0a/test-kv`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      console.log('KV Test Result:', data);
      setResult(data);
    } catch (error: any) {
      console.error('KV Test Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-6">KV Store Test</h1>
        
        <button
          onClick={testKV}
          disabled={loading}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test KV Store'}
        </button>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl mb-4">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm">
            <strong>Check the browser console for detailed logs!</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
