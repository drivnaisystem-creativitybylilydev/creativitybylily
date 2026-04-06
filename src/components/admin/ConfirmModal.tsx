'use client';

import { useEffect, useRef } from 'react';

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
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="rounded-lg shadow-lg max-w-sm w-full p-5 border"
        style={{
          backgroundColor: 'var(--soft-pink)',
          borderColor: '#f4c2c2',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        <h3 id="confirm-modal-title" className="text-base font-medium text-gray-900 mb-3">
          {title}
        </h3>
        <p id="confirm-modal-desc" className="text-gray-700 text-sm mb-4 leading-relaxed break-words overflow-wrap-anywhere">
          {message}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
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
