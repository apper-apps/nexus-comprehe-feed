import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'notification_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAll = async (userId = null) => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "message_c" } },
        { field: { Name: "timestamp_c" } },
        { field: { Name: "is_read_c" } },
        { field: { Name: "notification_type_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "activity_id_c" } }
      ],
      orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
      pagingInfo: { limit: 50, offset: 0 }
    };

    // Add user filter if provided
    if (userId) {
      params.where = [
        {
          FieldName: "user_id_c",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        }
      ];
    }

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching notifications:", error?.response?.data?.message);
    } else {
      console.error("Error fetching notifications:", error);
    }
    return [];
  }
};

export const getUnreadCount = async (userId) => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } }
      ],
      where: [
        {
          FieldName: "user_id_c",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        },
        {
          FieldName: "is_read_c",
          Operator: "EqualTo",
          Values: [false]
        }
      ],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return 0;
    }

    return response.data ? response.data.length : 0;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching unread count:", error?.response?.data?.message);
    } else {
      console.error("Error fetching unread count:", error);
    }
    return 0;
  }
};

export const getById = async (id) => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "message_c" } },
        { field: { Name: "timestamp_c" } },
        { field: { Name: "is_read_c" } },
        { field: { Name: "notification_type_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "activity_id_c" } }
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
      console.error("Error fetching notification:", error?.response?.data?.message);
    } else {
      console.error("Error fetching notification:", error);
    }
    return null;
  }
};

export const create = async (notificationData) => {
  try {
    await delay(300);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: notificationData.Name || `Notification ${Date.now()}`,
        message_c: notificationData.message_c,
        timestamp_c: notificationData.timestamp_c || new Date().toISOString(),
        is_read_c: notificationData.is_read_c || false,
        notification_type_c: notificationData.notification_type_c,
        user_id_c: notificationData.user_id_c ? parseInt(notificationData.user_id_c) : null,
        activity_id_c: notificationData.activity_id_c ? parseInt(notificationData.activity_id_c) : null
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
        console.error(`Failed to create notification records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success("Notification created successfully!");
        return successfulRecords[0].data;
      }
    }
    
    throw new Error("No successful record created");
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating notification:", error?.response?.data?.message);
    } else {
      console.error("Error creating notification:", error);
    }
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    await delay(200);
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: parseInt(id),
        is_read_c: true
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to mark notification as read:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error marking notification as read:", error?.response?.data?.message);
    } else {
      console.error("Error marking notification as read:", error);
    }
    return false;
  }
};

export const markAllAsRead = async (userId) => {
  try {
    await delay(300);
    
    // First fetch all unread notifications for the user
    const apperClient = getApperClient();
    const fetchParams = {
      fields: [
        { field: { Name: "Name" } }
      ],
      where: [
        {
          FieldName: "user_id_c",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        },
        {
          FieldName: "is_read_c",
          Operator: "EqualTo",
          Values: [false]
        }
      ],
      pagingInfo: { limit: 1000, offset: 0 }
    };

    const fetchResponse = await apperClient.fetchRecords(tableName, fetchParams);
    
    if (!fetchResponse.success || !fetchResponse.data || fetchResponse.data.length === 0) {
      return true; // No unread notifications to update
    }

    // Update all unread notifications to read
    const records = fetchResponse.data.map(notification => ({
      Id: notification.Id,
      is_read_c: true
    }));

    const updateParams = { records };
    const response = await apperClient.updateRecord(tableName, updateParams);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to mark notifications as read:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`${successfulUpdates.length} notifications marked as read!`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error marking all notifications as read:", error?.response?.data?.message);
    } else {
      console.error("Error marking all notifications as read:", error);
    }
    return false;
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
        console.error(`Failed to delete notification records:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success("Notification deleted successfully!");
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting notification:", error?.response?.data?.message);
    } else {
      console.error("Error deleting notification:", error);
    }
    return false;
  }
};