// Reply service for reply_c table using ApperClient
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
        { field: { Name: "user_id_c" } },
        { field: { Name: "reply_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "ASC" }
      ]
    };

    const response = await apperClient.fetchRecords('reply_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching replies:", error?.response?.data?.message);
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
        { field: { Name: "user_id_c" } },
        { field: { Name: "reply_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ],
      where: [
        { 
          FieldName: "comment_id_c", 
          Operator: "EqualTo", 
          Values: [parseInt(commentId)]
        }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "ASC" }
      ]
    };

    const response = await apperClient.fetchRecords('reply_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching replies for comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getById = async (replyId) => {
  try {
    await delay(200);

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
        { field: { Name: "user_id_c" } },
        { field: { Name: "reply_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ]
    };

    const response = await apperClient.getRecordById('reply_c', replyId, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const create = async (replyData) => {
  try {
    await delay(400);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const params = {
      records: [{
        Name: replyData.Name,
        comment_id_c: parseInt(replyData.comment_id_c),
        user_id_c: parseInt(replyData.user_id_c),
        reply_text_c: replyData.reply_text_c
      }]
    };

    const response = await apperClient.createRecord('reply_c', params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);

      if (failedRecords.length > 0) {
        console.error(`Failed to create reply ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
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
      console.error("Error creating reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const update = async (replyId, replyData) => {
  try {
    await delay(400);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields plus Id
    const params = {
      records: [{
        Id: parseInt(replyId),
        Name: replyData.Name,
        comment_id_c: parseInt(replyData.comment_id_c),
        user_id_c: parseInt(replyData.user_id_c),
        reply_text_c: replyData.reply_text_c
      }]
    };

    const response = await apperClient.updateRecord('reply_c', params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);

      if (failedUpdates.length > 0) {
        console.error(`Failed to update reply ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) console.error(record.message);
        });
      }

      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const delete_ = async (replyId) => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(replyId)]
    };

    const response = await apperClient.deleteRecord('reply_c', params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        console.error(`Failed to delete reply ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

        failedDeletions.forEach(record => {
          if (record.message) console.error(record.message);
        });
      }

      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting reply:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};