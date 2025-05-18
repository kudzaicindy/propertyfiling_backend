import { useState } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3000/api';

interface InsuranceCoverData {
  _id: string;
  coverId: string;
  coverType: string;
  description: string;
  coverageAmount: number;
  premium: number;
  status: string;
}

interface InsuranceCoverState {
  insuranceData: InsuranceCoverData[];
  isLoading: boolean;
  error: string | null;
}

export const useInsuranceCover = () => {
  const { fetchWithAuth, isPropertyManager } = useAuth();
  const [state, setState] = useState<InsuranceCoverState>({
    insuranceData: [],
    isLoading: false,
    error: null
  });

  const updateInsuranceCover = async (id: string, insuranceData: Partial<InsuranceCoverData>) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can update insurance');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Sending insurance cover update to backend:', { _id: id, ...insuranceData });
      
      const response = await fetchWithAuth(`${API_BASE_URL}/insuredcover`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: id, ...insuranceData })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend update failed:', data.error);
        throw new Error(data.error || 'Failed to update insurance cover');
      }

      console.log('✅ Insurance cover updated successfully:', data.data);
      
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
      console.error('❌ Error updating insurance cover:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update insurance cover'
      }));
      throw error;
    }
  };

  const fetchInsuranceCover = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Fetching insurance cover data from backend...');
      
      const response = await fetchWithAuth(`${API_BASE_URL}/insuredcover`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch insurance cover data');
      }

      console.log(`✅ Successfully fetched ${data.data.length} insurance cover records`);
      
      setState({
        insuranceData: data.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching insurance cover data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch insurance cover data',
        insuranceData: []
      }));
    }
  };

  return {
    ...state,
    updateInsuranceCover,
    fetchInsuranceCover
  };
}; 