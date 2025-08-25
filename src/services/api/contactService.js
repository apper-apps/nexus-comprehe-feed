import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'contact_c';

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
        { field: { Name: "first_name_c" } },
        { field: { Name: "last_name_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "lifecycle_stage_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "custom_properties_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "company_id_c" } }
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
      console.error("Error fetching contacts:", error?.response?.data?.message);
    } else {
      console.error("Error fetching contacts:", error);
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
        { field: { Name: "first_name_c" } },
        { field: { Name: "last_name_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "lifecycle_stage_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "custom_properties_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "company_id_c" } }
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
      console.error("Error fetching contact:", error?.response?.data?.message);
    } else {
      console.error("Error fetching contact:", error);
    }
    return null;
  }
};

export const create = async (contactData) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: contactData.Name || `${contactData.first_name_c} ${contactData.last_name_c}`,
        Tags: contactData.Tags || "",
        first_name_c: contactData.first_name_c,
        last_name_c: contactData.last_name_c,
        email_c: contactData.email_c,
        phone_c: contactData.phone_c,
        lifecycle_stage_c: contactData.lifecycle_stage_c,
        notes_c: contactData.notes_c || "",
        custom_properties_c: JSON.stringify(contactData.custom_properties_c || {}),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString(),
        company_id_c: contactData.company_id_c ? parseInt(contactData.company_id_c) : null
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
        console.error(`Failed to create contact records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Contact created successfully!");
        return successfulRecords[0].data;
      }
    }
    
    throw new Error("No successful record created");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating contact:", error?.response?.data?.message);
    } else {
      console.error("Error creating contact:", error);
    }
    throw error;
  }
};

export const update = async (id, contactData) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: parseInt(id),
        Name: contactData.Name || `${contactData.first_name_c} ${contactData.last_name_c}`,
        Tags: contactData.Tags || "",
        first_name_c: contactData.first_name_c,
        last_name_c: contactData.last_name_c,
        email_c: contactData.email_c,
        phone_c: contactData.phone_c,
        lifecycle_stage_c: contactData.lifecycle_stage_c,
        notes_c: contactData.notes_c || "",
        custom_properties_c: JSON.stringify(contactData.custom_properties_c || {}),
        updated_at_c: new Date().toISOString(),
        company_id_c: contactData.company_id_c ? parseInt(contactData.company_id_c) : null
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
        console.error(`Failed to update contact records:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success("Contact updated successfully!");
        return successfulUpdates[0].data;
      }
    }
    
    throw new Error("No successful record updated");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating contact:", error?.response?.data?.message);
    } else {
      console.error("Error updating contact:", error);
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
        console.error(`Failed to delete contact records:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success("Contact deleted successfully!");
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting contact:", error?.response?.data?.message);
    } else {
      console.error("Error deleting contact:", error);
    }
    return false;
  }
};

export const bulkDelete = async (contactIds) => {
  try {
    await delay(500);
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: contactIds.map(id => parseInt(id))
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
        console.error(`Failed to delete contact records:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success(`${successfulDeletions.length} contacts deleted successfully!`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error bulk deleting contacts:", error?.response?.data?.message);
    } else {
      console.error("Error bulk deleting contacts:", error);
    }
    return false;
  }
};

export const bulkUpdateLifecycleStage = async (contactIds, lifecycleStage) => {
  try {
    await delay(500);
    const apperClient = getApperClient();
    
    const records = contactIds.map(id => ({
      Id: parseInt(id),
      lifecycle_stage_c: lifecycleStage,
      updated_at_c: new Date().toISOString()
    }));
    
    const params = { records };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to bulk update contact records:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`${successfulUpdates.length} contacts updated successfully!`);
        return successfulUpdates.map(result => result.data);
      }
    }
    
    return [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error bulk updating contacts:", error?.response?.data?.message);
    } else {
      console.error("Error bulk updating contacts:", error);
    }
    return [];
  }
};