import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3000/api';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface PropertyState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  canEdit: boolean;
}

export const usePropertyData = () => {
  const { fetchWithAuth, isPropertyManager } = useAuth();
  const [state, setState] = useState<PropertyState>({
    properties: [],
    isLoading: true,
    error: null,
    canEdit: false
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Fetching properties from backend...');
      const response = await fetchWithAuth(`${API_BASE_URL}/properties`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }

      const properties = Array.isArray(data.data) ? data.data : [];
      console.log(`✅ Successfully fetched ${properties.length} properties`);
      
      setState({
        properties,
        isLoading: false,
        error: null,
        canEdit: isPropertyManager()
      });
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
        canEdit: false,
        properties: []
      }));
    }
  };

  const addProperty = async (propertyData: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can add properties');
    }

    try {
      console.log('🔄 Adding new property:', propertyData);
      const response = await fetchWithAuth(`${API_BASE_URL}/properties`, {
        method: 'POST',
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add property');
      }

      console.log('✅ Property added successfully:', data.data);
      await fetchProperties(); // Refresh the list
      return data.data;
    } catch (error) {
      console.error('❌ Error adding property:', error);
      throw error;
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can update properties');
    }

    try {
      const updatePayload = { _id: id, ...propertyData };
      console.log('🔄 Sending property update to backend:', updatePayload);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/properties`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend update failed:', data.error);
        throw new Error(data.error || 'Failed to update property');
      }

      console.log('✅ Property updated successfully:', data.data);
      await fetchProperties(); // Refresh the list
      return data.data;
    } catch (error) {
      console.error('❌ Error updating property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    if (!isPropertyManager()) {
      throw new Error('Only property managers can delete properties');
    }

    try {
      console.log('🔄 Deleting property:', id);
      const response = await fetchWithAuth(`${API_BASE_URL}/properties?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend delete failed:', data.error);
        throw new Error(data.error || 'Failed to delete property');
      }

      console.log('✅ Property deleted successfully');
      await fetchProperties(); // Refresh the list
      return true;
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      throw error;
    }
  };

  return {
    ...state,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: fetchProperties
  };
}; 