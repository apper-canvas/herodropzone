import filesData from "../mockData/files.json";
import uploadSessionsData from "../mockData/uploadSessions.json";

// In-memory storage for this demo
let files = [...filesData];
let uploadSessions = [...uploadSessionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.Id === parseInt(id));
    if (!file) throw new Error("File not found");
    return { ...file };
  },

  async create(fileData) {
    await delay(400);
    const newId = files.length > 0 ? Math.max(...files.map(f => f.Id)) + 1 : 1;
    const newFile = {
      Id: newId,
      ...fileData,
      uploadedAt: new Date().toISOString()
    };
    files.push(newFile);
    return { ...newFile };
  },

  async update(id, updates) {
    await delay(300);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("File not found");
    files[index] = { ...files[index], ...updates };
    return { ...files[index] };
  },

  async delete(id) {
    await delay(200);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("File not found");
    const deletedFile = files[index];
    files.splice(index, 1);
    return { ...deletedFile };
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
    await delay(200);
    return [...uploadSessions];
  },

  async create(sessionData) {
    await delay(300);
    const newId = uploadSessions.length > 0 ? Math.max(...uploadSessions.map(s => s.Id)) + 1 : 1;
    const newSession = {
      Id: newId,
      ...sessionData,
      startTime: new Date().toISOString()
    };
    uploadSessions.push(newSession);
    return { ...newSession };
  },

  async update(id, updates) {
    await delay(200);
    const index = uploadSessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Upload session not found");
    uploadSessions[index] = { ...uploadSessions[index], ...updates };
    return { ...uploadSessions[index] };
  }
};