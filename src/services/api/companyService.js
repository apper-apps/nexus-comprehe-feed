import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'company_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAll = async () => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "industry_c" } },
        { field: { Name: "website_c" } },
        { field: { Name: "employee_count_c" } },
        { field: { Name: "custom_properties_c" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching companies:", error?.response?.data?.message);
    } else {
      console.error("Error fetching companies:", error);
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "industry_c" } },
        { field: { Name: "website_c" } },
        { field: { Name: "employee_count_c" } },
        { field: { Name: "custom_properties_c" } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching company:", error?.response?.data?.message);
    } else {
      console.error("Error fetching company:", error);
    }
    return null;
  }
};

export const create = async (companyData) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: companyData.Name,
        Tags: companyData.Tags || "",
        industry_c: companyData.industry_c,
        website_c: companyData.website_c,
        employee_count_c: parseInt(companyData.employee_count_c) || 0,
        custom_properties_c: JSON.stringify(companyData.custom_properties_c || {})
      }]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create company records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Company created successfully!");
        return successfulRecords[0].data;
      }
    }
    
    throw new Error("No successful record created");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating company:", error?.response?.data?.message);
    } else {
      console.error("Error creating company:", error);
    }
    throw error;
  }
};

export const update = async (id, companyData) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: parseInt(id),
        Name: companyData.Name,
        Tags: companyData.Tags || "",
        industry_c: companyData.industry_c,
        website_c: companyData.website_c,
        employee_count_c: parseInt(companyData.employee_count_c) || 0,
        custom_properties_c: JSON.stringify(companyData.custom_properties_c || {})
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update company records:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success("Company updated successfully!");
        return successfulUpdates[0].data;
      }
    }
    
    throw new Error("No successful record updated");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating company:", error?.response?.data?.message);
    } else {
      console.error("Error updating company:", error);
    }
    throw error;
  }
};

export const delete_ = async (id) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete company records:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success("Company deleted successfully!");
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting company:", error?.response?.data?.message);
    } else {
      console.error("Error deleting company:", error);
    }
    return false;
  }
};