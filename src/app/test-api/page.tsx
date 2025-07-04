'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { runApiDiagnostics, testApiEndpoint } from '@/utils/api-tester';

interface TestResult {
  name: string;
  endpoint: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export default function TestApiPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const { isAuthenticated, userInfo } = useAuth();

  async function handleRunTests() {
    setLoading(true);
    try {
      const diagnostics = await runApiDiagnostics();
      setResults(diagnostics);
    } catch (error) {
      console.error('Error running API diagnostics:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTestCustomEndpoint() {
    if (!customEndpoint) return;

    setLoading(true);
    try {
      const result = await testApiEndpoint(customEndpoint);
      setResults([{
        name: 'Custom Endpoint',
        endpoint: customEndpoint,
        ...result
      }]);
    } catch (error) {
      console.error(`Error testing endpoint ${customEndpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">API Test Dashboard</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              Current authentication state for API requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </p>
            {userInfo && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold mb-1">User Information:</p>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoints</CardTitle>
            <CardDescription>
              Run tests against the API to verify connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleRunTests} 
                disabled={loading || !isAuthenticated}
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </Button>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom endpoint to test (e.g. /api/v1/orders)"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  disabled={loading || !isAuthenticated}
                />
                <Button 
                  onClick={handleTestCustomEndpoint} 
                  disabled={!customEndpoint || loading || !isAuthenticated}
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from API endpoint tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{result.name}</h3>
                      <p className="text-sm text-gray-600">{result.endpoint}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{result.message}</p>

                  {result.success && result.data && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold mb-1">Response Data:</p>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {!result.success && result.error && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold mb-1">Error Details:</p>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
