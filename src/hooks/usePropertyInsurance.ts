import { useState } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3000/api';

interface PropertyInsuranceData {
  _id: string;
  propertyId: string;
  insuranceType: string;
  coverage: number;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'active' | 'expired' | 'cancelled';
}

interface PropertyInsuranceState {
  insuranceData: PropertyInsuranceData[];
  isLoading: boolean;
  error: string | null;
}

export const usePropertyInsurance = () => {
  const { fetchWithAuth, isPropertyManager } = useAuth();
  const [state, setState] = useState<PropertyInsuranceState>({
    insuranceData: [],
    isLoading: false,
    error: null
  });

  const updatePropertyInsurance = async (id: string, insuranceData: Partial<PropertyInsuranceData>) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can update insurance');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Sending property insurance update to backend:', { _id: id, ...insuranceData });
      
      const response = await fetchWithAuth(`${API_BASE_URL}/propertyinsured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: id, ...insuranceData })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend update failed:', data.error);
        throw new Error(data.error || 'Failed to update property insurance');
      }

      console.log('✅ Property insurance updated successfully:', data.data);
      
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
      console.error('❌ Error updating property insurance:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update property insurance'
      }));
      throw error;
    }
  };

  const fetchPropertyInsurance = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Fetching property insurance data from backend...');
      
      const response = await fetchWithAuth(`${API_BASE_URL}/propertyinsured`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch property insurance data');
      }

      console.log(`✅ Successfully fetched ${data.data.length} property insurance records`);
      
      setState({
        insuranceData: data.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching property insurance data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property insurance data',
        insuranceData: []
      }));
    }
  };

  return {
    ...state,
    updatePropertyInsurance,
    fetchPropertyInsurance
  };
}; 