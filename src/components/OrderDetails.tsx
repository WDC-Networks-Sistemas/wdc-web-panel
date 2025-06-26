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

interface OrderDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ open, onOpenChange }) => {
  const { selectedOrder, updateOrderStatus } = useOrders();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  if (!selectedOrder) return null;

  const handleApprove = () => {
    updateOrderStatus(selectedOrder.id, 'approved');
    onOpenChange(false);
  };

  const handleRejectClick = () => {
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    // Update the order status to rejected
    updateOrderStatus(selectedOrder.id, 'rejected');

    // Log the reason (in a real app, you would save this to your backend)
    console.log(`Order ${selectedOrder.id} rejected with reason: ${reason}`);

    // Close the parent modal after rejection is complete
    onOpenChange(false);
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'Pendente', icon: Clock },
      approved: { variant: 'default' as const, text: 'Aprovado', icon: Check },
      rejected: { variant: 'destructive' as const, text: 'Rejeitado', icon: X },
    };

    const { variant, text, icon: Icon } = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

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
                <p className="text-sm font-medium">Cliente</p>
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
                <p className="text-sm font-medium">Data</p>
                <p className="text-sm text-gray-700">
                  {new Date(selectedOrder.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {selectedOrder.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-gray-700">{selectedOrder.phone}</p>
                </div>
              </div>
            )}

            {selectedOrder.paymentMethod && (
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Forma de Pagamento</p>
                  <p className="text-sm text-gray-700">
                    {{
                      'credit': 'Cartão de Crédito',
                      'debit': 'Cartão de Débito',
                      'cash': 'Dinheiro',
                      'bank_transfer': 'Transferência Bancária'
                    }[selectedOrder.paymentMethod]}
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedOrder.address && (
            <div className="flex items-start gap-2 mt-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-sm text-gray-700">{selectedOrder.address}</p>
              </div>
            </div>
          )}

          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                <h3 className="text-sm font-medium">Itens do Pedido</h3>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left pb-2 font-medium text-gray-600">Item</th>
                      <th className="text-center pb-2 font-medium text-gray-600">Qtd</th>
                      <th className="text-right pb-2 font-medium text-gray-600">Preço</th>
                      <th className="text-right pb-2 font-medium text-gray-600">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 text-right font-medium">
                          R$ {(item.quantity * item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-2 text-right font-medium">Total:</td>
                      <td className="pt-2 text-right font-bold">
                        R$ {selectedOrder.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {selectedOrder.notes && (
            <div className="flex items-start gap-2 mt-2">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Observações</p>
                <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {selectedOrder.status === 'pending' && (
            <div className="flex gap-2">
              <Button 
                variant="default" 
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectClick}
              >
                <X className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline">
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
