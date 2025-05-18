import { useState } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3000/api';

interface InsuranceData {
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

interface InsuranceState {
  insuranceData: InsuranceData[];
  isLoading: boolean;
  error: string | null;
}

export const useInsurance = () => {
  const { fetchWithAuth, isPropertyManager } = useAuth();
  const [state, setState] = useState<InsuranceState>({
    insuranceData: [],
    isLoading: false,
    error: null
  });

  const updateInsurance = async (id: string, insuranceData: Partial<InsuranceData>) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can update insurance');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Sending insurance update to backend:', { _id: id, ...insuranceData });
      
      const response = await fetchWithAuth(`${API_BASE_URL}/insuredcars`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: id, ...insuranceData })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend update failed:', data.error);
        throw new Error(data.error || 'Failed to update insurance');
      }

      console.log('✅ Insurance updated successfully:', data.data);
      
      // Update local state
      setState(prev => ({
        ...prev,
        insuranceData: prev.insuranceData.map(item => 
          item._id === id ? { ...item, ...insuranceData } : item
        ),
        isLoading: false
      }));

      return data.data;
    } catch (error) {
      console.error('❌ Error updating insurance:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update insurance'
      }));
      throw error;
    }
  };

  const fetchInsurance = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Fetching insurance data from backend...');
      
      const response = await fetchWithAuth(`${API_BASE_URL}/insuredcars`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch insurance data');
      }

      console.log(`✅ Successfully fetched ${data.data.length} insurance records`);
      
      setState({
        insuranceData: data.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching insurance data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch insurance data',
        insuranceData: []
      }));
    }
  };

  return {
    ...state,
    updateInsurance,
    fetchInsurance
  };
}; 