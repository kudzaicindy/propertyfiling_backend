import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3000/api';

interface InsuranceData {
  propertyInsurance: any[];
  carInsurance: any[];
  insuranceCover: any[];
}

interface InsuranceDataState {
  data: InsuranceData;
  isLoading: boolean;
  error: string | null;
}

export const useInsuranceData = () => {
  const { fetchWithAuth } = useAuth();
  const [state, setState] = useState<InsuranceDataState>({
    data: {
      propertyInsurance: [],
      carInsurance: [],
      insuranceCover: []
    },
    isLoading: false,
    error: null
  });

  const fetchInsuranceData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Fetching all insurance data from backend...');

      // Fetch all insurance data in parallel
      const [propertyResponse, carResponse, coverResponse] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/propertyinsured`),
        fetchWithAuth(`${API_BASE_URL}/insuredcars`),
        fetchWithAuth(`${API_BASE_URL}/insuredcover`)
      ]);

      const [propertyData, carData, coverData] = await Promise.all([
        propertyResponse.json(),
        carResponse.json(),
        coverResponse.json()
      ]);

      if (!propertyResponse.ok || !carResponse.ok || !coverResponse.ok) {
        throw new Error('Failed to fetch insurance data');
      }

      console.log('✅ Successfully fetched all insurance data');
      
      setState({
        data: {
          propertyInsurance: propertyData.data,
          carInsurance: carData.data,
          insuranceCover: coverData.data
        },
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching insurance data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch insurance data',
        data: {
          propertyInsurance: [],
          carInsurance: [],
          insuranceCover: []
        }
      }));
    }
  };

  const updateInsurance = async (id: string, data: any) => {
    try {
      if (!id) {
        throw new Error('Insurance ID is required for update');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Updating insurance:', { id, data });

      // Format dates to yyyy-MM-dd
      const formattedData = {
        ...data,
        nextPaymentDate: data.nextPaymentDate ? new Date(data.nextPaymentDate).toISOString().split('T')[0] : undefined,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : undefined
      };

      const response = await fetchWithAuth(`${API_BASE_URL}/insuredcars`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...formattedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update insurance');
      }

      const result = await response.json();
      console.log('✅ Insurance updated successfully:', result);
      
      // Refresh the insurance data after update
      await fetchInsuranceData();
      
      return result;
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

  useEffect(() => {
    fetchInsuranceData();
  }, []);

  return {
    ...state,
    refetch: fetchInsuranceData,
    updateInsurance
  };
}; 