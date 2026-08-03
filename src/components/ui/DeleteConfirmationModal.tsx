import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { CheckCheck, Trash2, LogOut } from 'lucide-react';

type ModalType = 'delete' | 'verify' | 'logout';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  label?: string;
  description?: string;
  loading?: boolean;
  type?: ModalType;
}

const typeConfig: Record<
  ModalType,
  {
    border: string;
    iconBg: string;
    iconBorder: string;
    button: string;
    icon: React.ReactNode;
    defaultLabel: string;
  }
> = {
  delete: {
    border: 'border-destructive',
    iconBg: 'bg-destructive',
    iconBorder: 'border-destructive/20',
    button: 'bg-destructive hover:bg-destructive/90',
    icon: <Trash2 className="h-8 w-8 text-primary-foreground" />,
    defaultLabel: 'Are You Sure You Want To Delete',
  },
  verify: {
    border: 'border-primary',
    iconBg: 'bg-primary',
    iconBorder: 'border-primary/20',
    button: 'bg-primary hover:bg-primary/80',
    icon: <CheckCheck className="h-8 w-8 text-primary-foreground" />,
    defaultLabel: 'Are You Sure You Want To Verify',
  },
  logout: {
    border: 'border-destructive',
    iconBg: 'bg-destructive',
    iconBorder: 'border-destructive/20',
    button: 'bg-destructive hover:bg-destructive/90',
    icon: <LogOut className="h-8 w-8 text-primary-foreground" />,
    defaultLabel: 'Are You Sure You Want To Logout',
  },
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  label,
  description = 'This action cannot be undone',
  type = 'delete',
}: ConfirmationModalProps) => {
  const config = typeConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      className={`border-2 ${config.border}`}
      loading={loading}
    >
      <div className="max-w-lg px-2 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border-8 ${config.iconBorder} ${config.iconBg}`}
          >
            {config.icon}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground">
          {label || config.defaultLabel}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:flex-nowrap">
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>

          <Button
            disabled={loading}
            className={config.button}
            onClick={onSubmit}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;