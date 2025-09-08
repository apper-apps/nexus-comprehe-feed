// Comment service for comment_c table using ApperClient
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
        { field: { Name: "deal_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "comment_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "DESC" }
      ]
    };

    const response = await apperClient.fetchRecords('comment_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching comments:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getByDealId = async (dealId) => {
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
        { field: { Name: "deal_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "comment_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ],
      where: [
        { 
          FieldName: "deal_id_c", 
          Operator: "EqualTo", 
          Values: [parseInt(dealId)]
        }
      ],
      orderBy: [
        { fieldName: "CreatedOn", sorttype: "DESC" }
      ]
    };

    const response = await apperClient.fetchRecords('comment_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching comments for deal:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getById = async (commentId) => {
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
        { field: { Name: "deal_id_c" } },
        { field: { Name: "user_id_c" } },
        { field: { Name: "comment_text_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } }
      ]
    };

    const response = await apperClient.getRecordById('comment_c', commentId, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const create = async (commentData) => {
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
        Name: commentData.Name,
        deal_id_c: parseInt(commentData.deal_id_c),
        user_id_c: parseInt(commentData.user_id_c),
        comment_text_c: commentData.comment_text_c
      }]
    };

    const response = await apperClient.createRecord('comment_c', params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);

      if (failedRecords.length > 0) {
        console.error(`Failed to create comment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
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
      console.error("Error creating comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const update = async (commentId, commentData) => {
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
        Id: parseInt(commentId),
        Name: commentData.Name,
        deal_id_c: parseInt(commentData.deal_id_c),
        user_id_c: parseInt(commentData.user_id_c),
        comment_text_c: commentData.comment_text_c
      }]
    };

    const response = await apperClient.updateRecord('comment_c', params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);

      if (failedUpdates.length > 0) {
        console.error(`Failed to update comment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

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
      console.error("Error updating comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const delete_ = async (commentId) => {
  try {
    await delay(300);

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(commentId)]
    };

    const response = await apperClient.deleteRecord('comment_c', params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        console.error(`Failed to delete comment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

        failedDeletions.forEach(record => {
          if (record.message) console.error(record.message);
        });
      }

      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting comment:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};