// User Mention service for user_mention_c table using ApperClient
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "comment_id_c" } },
        { field: { Name: "reply_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "DESC" }
      ]
    };

    const response = await apperClient.fetchRecords('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching user mentions:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getByCommentId = async (commentId) => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "comment_id_c" } },
        { field: { Name: "reply_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      where: [
        { 
          FieldName: "comment_id_c", 
          Operator: "EqualTo", 
          Values: [parseInt(commentId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching user mentions for comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getByReplyId = async (replyId) => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "comment_id_c" } },
        { field: { Name: "reply_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      where: [
        { 
          FieldName: "reply_id_c", 
          Operator: "EqualTo", 
          Values: [parseInt(replyId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching user mentions for reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const create = async (mentionData) => {
  try {
    await delay(400);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const record = {
      Name: mentionData.Name,
      user_id_c: parseInt(mentionData.user_id_c)
    };

    // Include either comment_id_c or reply_id_c, not both
    if (mentionData.comment_id_c) {
      record.comment_id_c = parseInt(mentionData.comment_id_c);
    }
    if (mentionData.reply_id_c) {
      record.reply_id_c = parseInt(mentionData.reply_id_c);
    }

    const params = {
      records: [record]
    };

    const response = await apperClient.createRecord('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);

      if (failedRecords.length > 0) {
        console.error(`Failed to create user mention ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) console.error(record.message);
        });
      }

      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating user mention:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const createBulk = async (mentionsData) => {
  try {
    await delay(400);

    if (!mentionsData || mentionsData.length === 0) {
      return [];
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format records for bulk creation
    const records = mentionsData.map(mentionData => {
      const record = {
        Name: mentionData.Name,
        user_id_c: parseInt(mentionData.user_id_c)
      };

      // Include either comment_id_c or reply_id_c, not both
      if (mentionData.comment_id_c) {
        record.comment_id_c = parseInt(mentionData.comment_id_c);
      }
      if (mentionData.reply_id_c) {
        record.reply_id_c = parseInt(mentionData.reply_id_c);
      }

      return record;
    });

    const params = { records };

    const response = await apperClient.createRecord('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);

      if (failedRecords.length > 0) {
        console.error(`Failed to create user mentions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) console.error(record.message);
        });
      }

      return successfulRecords.map(result => result.data);
    }

    return [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating bulk user mentions:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const delete_ = async (mentionId) => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(mentionId)]
    };

    const response = await apperClient.deleteRecord('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        console.error(`Failed to delete user mention ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

        failedDeletions.forEach(record => {
          if (record.message) console.error(record.message);
        });
      }

      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting user mention:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};

export const deleteByCommentId = async (commentId) => {
  try {
    // First fetch all mentions for this comment
    const mentions = await getByCommentId(commentId);
    
    if (mentions.length === 0) {
      return true;
    }

    // Delete all mentions
    const mentionIds = mentions.map(mention => mention.Id);
    
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: mentionIds
    };

    const response = await apperClient.deleteRecord('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting user mentions by comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};

export const deleteByReplyId = async (replyId) => {
  try {
    // First fetch all mentions for this reply
    const mentions = await getByReplyId(replyId);
    
    if (mentions.length === 0) {
      return true;
    }

    // Delete all mentions
    const mentionIds = mentions.map(mention => mention.Id);
    
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: mentionIds
    };

    const response = await apperClient.deleteRecord('user_mention_c', params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting user mentions by reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};