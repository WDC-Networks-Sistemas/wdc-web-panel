'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User } from 'lucide-react';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { account, login } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (account) {
      router.push('/dashboard');
    }
  }, [account, router]);

  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      // The redirect will happen automatically after successful login
      // or through the useEffect above when account is set
    } catch (error) {
      console.error('SSO login failed:', error);
      setIsLoading(false);
    }
  };

  // Don't render the login form if user is already authenticated
  if (account) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600">Redirecionando para o dashboard...</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">WDC Web Interface</CardTitle>
            <p className="text-gray-600">Faça login com sua conta corporativa</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                  onClick={handleSSOLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Entrar com Conta Corporativa</span>
                    </div>
                )}
              </Button>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Login Corporativo</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Use suas credenciais corporativas para acessar o sistema
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Ao fazer login, você concorda com os termos de uso da empresa</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Login;