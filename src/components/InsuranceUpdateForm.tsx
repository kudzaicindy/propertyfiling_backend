import React, { useState, useEffect } from 'react';
import { useInsurance } from '../hooks/useInsurance';

interface InsuranceUpdateFormProps {
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
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const InsuranceUpdateForm: React.FC<InsuranceUpdateFormProps> = ({
  insuranceId,
  initialData,
  onSuccess,
  onCancel
}) => {
  const { updateInsurance, isLoading, error } = useInsurance();
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Premium') || name.includes('Payment') || name.includes('Insured') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInsurance(insuranceId, formData);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update insurance:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Reference</label>
          <input
            type="text"
            name="carRef"
            value={formData.carRef}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Car Details</label>
          <input
            type="text"
            name="carDetails"
            value={formData.carDetails}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
          <input
            type="text"
            name="responsiblePerson"
            value={formData.responsiblePerson}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Insurance</label>
          <input
            type="text"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount Insured</label>
          <input
            type="number"
            name="amountInsured"
            value={formData.amountInsured}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Payment</label>
          <input
            type="number"
            name="monthlyPayment"
            value={formData.monthlyPayment}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Next Payment Date</label>
          <input
            type="date"
            name="nextPaymentDate"
            value={formData.nextPaymentDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Termly Premium</label>
          <input
            type="number"
            name="termlyPremium"
            value={formData.termlyPremium}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Yearly Premium</label>
          <input
            type="number"
            name="yearlyPremium"
            value={formData.yearlyPremium}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}; 