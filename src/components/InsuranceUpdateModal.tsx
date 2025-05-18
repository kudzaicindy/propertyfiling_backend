import React from 'react';
import { InsuranceUpdateForm } from './InsuranceUpdateForm';

interface InsuranceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  insuranceId: string;
  initialData: {
    carRef: string;
    carDetails: string;
    responsiblePerson: string;
    insurance: string;
    amountInsured: number;
    monthlyPayment: number;
    nextPaymentDate: string;
    termlyPremium: number;
    yearlyPremium: number;
  };
}

export const InsuranceUpdateModal: React.FC<InsuranceUpdateModalProps> = ({
  isOpen,
  onClose,
  insuranceId,
  initialData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Update Insurance</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <InsuranceUpdateForm
            insuranceId={insuranceId}
            initialData={initialData}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}; 