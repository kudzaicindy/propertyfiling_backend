import React, { useState } from 'react';
import { useInsurance } from '../hooks/useInsurance';
import { InsuranceUpdateModal } from './InsuranceUpdateModal';

interface Insurance {
  _id: string;
  carRef: string;
  carDetails: string;
  responsiblePerson: string;
  insurance: string;
  amountInsured: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  termlyPremium: number;
  yearlyPremium: number;
}

export const Dashboard: React.FC = () => {
  const { insuranceData, loading, error, fetchInsurance } = useInsurance();
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  React.useEffect(() => {
    fetchInsurance();
  }, [fetchInsurance]);

  const handleEditClick = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedInsurance(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Insurance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insuranceData.map((insurance) => (
          <div key={insurance._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{insurance.carRef}</h2>
              <button
                onClick={() => handleEditClick(insurance)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
            
            <div className="space-y-2">
              <p><span className="font-medium">Car Details:</span> {insurance.carDetails}</p>
              <p><span className="font-medium">Responsible Person:</span> {insurance.responsiblePerson}</p>
              <p><span className="font-medium">Insurance Type:</span> {insurance.insurance}</p>
              <p><span className="font-medium">Amount Insured:</span> ${insurance.amountInsured}</p>
              <p><span className="font-medium">Monthly Payment:</span> ${insurance.monthlyPayment}</p>
              <p><span className="font-medium">Next Payment Date:</span> {new Date(insurance.nextPaymentDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Termly Premium:</span> ${insurance.termlyPremium}</p>
              <p><span className="font-medium">Yearly Premium:</span> ${insurance.yearlyPremium}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedInsurance && (
        <InsuranceUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          insuranceId={selectedInsurance._id}
          initialData={{
            carRef: selectedInsurance.carRef,
            carDetails: selectedInsurance.carDetails,
            responsiblePerson: selectedInsurance.responsiblePerson,
            insurance: selectedInsurance.insurance,
            amountInsured: selectedInsurance.amountInsured,
            monthlyPayment: selectedInsurance.monthlyPayment,
            nextPaymentDate: selectedInsurance.nextPaymentDate,
            termlyPremium: selectedInsurance.termlyPremium,
            yearlyPremium: selectedInsurance.yearlyPremium,
          }}
        />
      )}
    </div>
  );
}; 