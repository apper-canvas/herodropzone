// Initialize ApperClient - will be used throughout the service
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const fileService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "preview_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "speed_c"}},
          {"field": {"Name": "time_remaining_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('file_c', params);
      
      if (!response.success) {
        console.error("Error fetching files:", response.message);
        return [];
      }
      
      // Map database fields to expected UI format
      return (response.data || []).map(file => ({
        Id: file.Id,
        id: file.Id, // Keep both for compatibility
        name: file.name_c || file.Name,
        size: file.size_c || 0,
        type: file.type_c || 'application/octet-stream',
        status: file.status_c || 'pending',
        progress: file.progress_c || 0,
        preview: file.preview_c,
        uploadedAt: file.uploaded_at_c,
        speed: file.speed_c || 0,
        timeRemaining: file.time_remaining_c || 0
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "preview_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "speed_c"}},
          {"field": {"Name": "time_remaining_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('file_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "File not found");
      }
      
      const file = response.data;
      return {
        Id: file.Id,
        id: file.Id,
        name: file.name_c || file.Name,
        size: file.size_c || 0,
        type: file.type_c || 'application/octet-stream',
        status: file.status_c || 'pending',
        progress: file.progress_c || 0,
        preview: file.preview_c,
        uploadedAt: file.uploaded_at_c,
        speed: file.speed_c || 0,
        timeRemaining: file.time_remaining_c || 0
      };
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error);
      throw error;
    }
  },

  async create(fileData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: fileData.name,
          name_c: fileData.name,
          size_c: fileData.size,
          type_c: fileData.type,
          status_c: fileData.status || 'pending',
          progress_c: fileData.progress || 0,
          preview_c: fileData.preview,
          uploaded_at_c: new Date().toISOString(),
          speed_c: fileData.speed || 0,
          time_remaining_c: fileData.timeRemaining || 0
        }]
      };
      
      const response = await apperClient.createRecord('file_c', params);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to create file");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const file = result.data;
          return {
            Id: file.Id,
            id: file.Id,
            name: file.name_c || file.Name,
            size: file.size_c || 0,
            type: file.type_c || 'application/octet-stream',
            status: file.status_c || 'pending',
            progress: file.progress_c || 0,
            preview: file.preview_c,
            uploadedAt: file.uploaded_at_c,
            speed: file.speed_c || 0,
            timeRemaining: file.time_remaining_c || 0
          };
        } else {
          throw new Error(result.message || "Failed to create file");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updates.name && { name_c: updates.name }),
          ...(updates.size && { size_c: updates.size }),
          ...(updates.type && { type_c: updates.type }),
          ...(updates.status && { status_c: updates.status }),
          ...(updates.progress !== undefined && { progress_c: updates.progress }),
          ...(updates.preview && { preview_c: updates.preview }),
          ...(updates.speed !== undefined && { speed_c: updates.speed }),
          ...(updates.timeRemaining !== undefined && { time_remaining_c: updates.timeRemaining })
        }]
      };
      
      const response = await apperClient.updateRecord('file_c', params);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update file");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const file = result.data;
          return {
            Id: file.Id,
            id: file.Id,
            name: file.name_c || file.Name,
            size: file.size_c || 0,
            type: file.type_c || 'application/octet-stream',
            status: file.status_c || 'pending',
            progress: file.progress_c || 0,
            preview: file.preview_c,
            uploadedAt: file.uploaded_at_c,
            speed: file.speed_c || 0,
            timeRemaining: file.time_remaining_c || 0
          };
        } else {
          throw new Error(result.message || "Failed to update file");
        }
      }
      
      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error(`Error updating file ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('file_c', params);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete file");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { success: true };
        } else {
          throw new Error(result.message || "Failed to delete file");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting file ${id}:`, error);
      throw error;
    }
  },

  async simulateUpload(file, onProgress) {
    const totalChunks = 100;
    const chunkSize = file.size / totalChunks;
    let uploadedBytes = 0;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const uploadChunk = (chunk) => {
        setTimeout(() => {
          if (Math.random() < 0.02) { // 2% chance of failure for demo
            reject(new Error("Upload failed"));
            return;
          }

          uploadedBytes += chunkSize;
          const progress = Math.min((uploadedBytes / file.size) * 100, 100);
          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = uploadedBytes / elapsedTime;
          const remainingBytes = file.size - uploadedBytes;
          const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

          onProgress({
            progress: Math.round(progress),
            speed: Math.round(speed),
            timeRemaining: Math.round(timeRemaining)
          });

          if (chunk < totalChunks) {
            uploadChunk(chunk + 1);
          } else {
            resolve();
          }
        }, 50 + Math.random() * 100); // Random delay between 50-150ms
      };

      uploadChunk(1);
    });
  }
};

export const uploadSessionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "start_time_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('upload_session_c', params);
      
      if (!response.success) {
        console.error("Error fetching upload sessions:", response.message);
        return [];
      }
      
      return (response.data || []).map(session => ({
        Id: session.Id,
        id: session.Id,
        name: session.Name,
        startTime: session.start_time_c
      }));
    } catch (error) {
      console.error("Error fetching upload sessions:", error);
      return [];
    }
  },

  async create(sessionData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: sessionData.name || `Upload Session ${Date.now()}`,
          start_time_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('upload_session_c', params);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to create upload session");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const session = result.data;
          return {
            Id: session.Id,
            id: session.Id,
            name: session.Name,
            startTime: session.start_time_c
          };
        } else {
          throw new Error(result.message || "Failed to create upload session");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating upload session:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updates.name && { Name: updates.name })
        }]
      };
      
      const response = await apperClient.updateRecord('upload_session_c', params);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update upload session");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const session = result.data;
          return {
            Id: session.Id,
            id: session.Id,
            name: session.Name,
            startTime: session.start_time_c
          };
        } else {
          throw new Error(result.message || "Failed to update upload session");
        }
      }
      
      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error(`Error updating upload session ${id}:`, error);
      throw error;
    }
  }
};