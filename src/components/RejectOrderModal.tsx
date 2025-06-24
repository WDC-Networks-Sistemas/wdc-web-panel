import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface RejectOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  orderInfo?: {
    id: string;
    customer: string;
    amount: number;
  };
}

const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  orderInfo,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!rejectionReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(rejectionReason);
      setRejectionReason('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Rejeitar Pedido
          </DialogTitle>
          <DialogDescription>
            {orderInfo && (
              <>
                Você está prestes a rejeitar o pedido <strong>{orderInfo.id}</strong> de{' '}
                <strong>{orderInfo.customer}</strong> no valor de{' '}
                <strong>
                  R$ {orderInfo.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
                .
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rejection-reason">
              Motivo da rejeição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Digite o motivo da rejeição do pedido..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            {rejectionReason.trim() === '' && (
              <p className="text-sm text-gray-500">
                O motivo da rejeição é obrigatório
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!rejectionReason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Rejeitando...' : 'Rejeitar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectOrderModal;
