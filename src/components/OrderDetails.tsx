'use client'
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, X, Clock, Calendar, User, Mail, DollarSign, 
  MapPin, Phone, CreditCard, FileText, ShoppingCart 
} from 'lucide-react';
import { Order, useOrders } from '@/contexts/OrdersContext';
import RejectOrderModal from '@/components/RejectOrderModal';
import { APPROVAL_STATUS } from '@/constants/approvalStatus';
import { isPendingStatus } from '@/constants/approvalStatus';
import { getStatusBadge } from '@/utils/statusBadge';

interface OrderDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ open, onOpenChange }) => {
  const { selectedOrder, approveOrder, rejectOrder } = useOrders();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedOrder) return null;

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await approveOrder(
        selectedOrder.id,
        selectedOrder.approverCode || '',
        selectedOrder.branchCode
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = () => {
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      setIsSubmitting(true);
      await rejectOrder(
        selectedOrder.id,
        selectedOrder.approverCode || '',
        selectedOrder.branchCode,
        reason
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Error rejecting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Using the getStatusBadge utility function imported from @/utils/statusBadge

  return (
    <>
      <RejectOrderModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        onConfirm={handleRejectConfirm}
        orderInfo={selectedOrder ? {
          id: selectedOrder.id,
          customer: selectedOrder.customer,
          amount: selectedOrder.amount,
        } : undefined}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalhes do Pedido {selectedOrder.id}</span>
            {getStatusBadge(selectedOrder.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Cliente/Grupo</p>
                <p className="text-sm text-gray-700">{selectedOrder.customer}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-700">{selectedOrder.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Valor</p>
                <p className="text-sm text-gray-700 font-semibold">
                  R$ {selectedOrder.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Data de Emissão</p>
                <p className="text-sm text-gray-700">
                  {new Date(selectedOrder.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Filial</p>
                <p className="text-sm text-gray-700">{selectedOrder.branchName}</p>
              </div>
            </div>

            {selectedOrder.type && (
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tipo</p>
                  <p className="text-sm text-gray-700">{selectedOrder.type}</p>
                </div>
              </div>
            )}

            {selectedOrder.level && (
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Nível de Aprovação</p>
                  <p className="text-sm text-gray-700">{selectedOrder.level}</p>
                </div>
              </div>
            )}
          </div>

          {selectedOrder.observations && (
            <div className="flex items-start gap-2 mt-2">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Observações</p>
                <p className="text-sm text-gray-700">{selectedOrder.observations}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {isPendingStatus(selectedOrder.status) && (
            <div className="flex gap-2">
              <Button 
                variant="default" 
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Aprovar
                  </>
                )}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectClick}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default OrderDetails;
