
import React from 'react';
import DashboardLayout from '@/components/business/dashboard/DashboardLayout';
import StatsCard from '@/components/common/StatsCard';
import { ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral dos pedidos e métricas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pedidos Pendentes"
            value="12"
            change="+3 hoje"
            changeType="positive"
            icon={ShoppingCart}
            color="orange"
          />
          <StatsCard
            title="Pedidos Aprovados"
            value="85"
            change="+12% vs mês passado"
            changeType="positive"
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Receita Total"
            value="R$ 45.2k"
            change="+8.2% vs mês passado"
            changeType="positive"
            icon={DollarSign}
            color="blue"
          />
          <StatsCard
            title="Total de Clientes"
            value="234"
            change="+5 novos"
            changeType="positive"
            icon={Users}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Pedido #005 foi aprovado</p>
                <span className="text-xs text-gray-400 ml-auto">2min atrás</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Novo pedido #006 recebido</p>
                <span className="text-xs text-gray-400 ml-auto">5min atrás</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Pedido #004 foi rejeitado</p>
                <span className="text-xs text-gray-400 ml-auto">10min atrás</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Pedidos</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="text-sm font-medium text-orange-600">12 pedidos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aprovados</span>
                <span className="text-sm font-medium text-green-600">85 pedidos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejeitados</span>
                <span className="text-sm font-medium text-red-600">8 pedidos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
