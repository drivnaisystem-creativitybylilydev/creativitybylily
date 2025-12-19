'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
      onClick={onCancel}
    >
      <div 
        className="rounded-lg shadow-lg max-w-sm w-full p-5 border"
        style={{ 
          backgroundColor: 'var(--soft-pink)',
          borderColor: '#f4c2c2',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-medium text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed break-words overflow-wrap-anywhere">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-white text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: type === 'danger' ? '#dc2626' : 'var(--logo-pink)' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
