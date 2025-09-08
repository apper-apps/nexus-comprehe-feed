class ReactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Helper function to add delay for better UX
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay(300);
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Name_c" } },
          { field: { Name: "comment_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "reaction_type_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('reaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reactions:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getByCommentId(commentId) {
    try {
      await this.delay(200);
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Name_c" } },
          { field: { Name: "comment_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "reaction_type_c" } },
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
          {
            fieldName: "CreatedOn",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('reaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reactions for comment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(reactionId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Name_c" } },
          { field: { Name: "comment_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "reaction_type_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await this.apperClient.getRecordById('reaction_c', reactionId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching reaction with ID ${reactionId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(reactionData) {
    try {
      const params = {
        records: [{
          Name_c: reactionData.Name_c || `${reactionData.reaction_type_c} reaction`,
          comment_id_c: parseInt(reactionData.comment_id_c),
          user_id_c: parseInt(reactionData.user_id_c),
          reaction_type_c: reactionData.reaction_type_c
        }]
      };

      const response = await this.apperClient.createRecord('reaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create reactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              // Toast error will be handled by the component
            });
            if (record.message) {
              // Toast error will be handled by the component
            }
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating reaction:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(reactionId, reactionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(reactionId),
          Name_c: reactionData.Name_c,
          reaction_type_c: reactionData.reaction_type_c
        }]
      };

      const response = await this.apperClient.updateRecord('reaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update reactions ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              // Toast error will be handled by the component
            });
            if (record.message) {
              // Toast error will be handled by the component  
            }
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating reaction:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(reactionId) {
    try {
      const params = {
        RecordIds: [parseInt(reactionId)]
      };

      const response = await this.apperClient.deleteRecord('reaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete reactions ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) {
              // Toast error will be handled by the component
            }
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting reaction:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

const reactionService = new ReactionService();

export const getAll = () => reactionService.getAll();
export const getById = (id) => reactionService.getById(id);
export const getByCommentId = (commentId) => reactionService.getByCommentId(commentId);
export const create = (reactionData) => reactionService.create(reactionData);
export const update = (id, reactionData) => reactionService.update(id, reactionData);
export const delete_ = (id) => reactionService.delete(id);

export default reactionService;