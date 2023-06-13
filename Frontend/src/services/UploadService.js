import axios from "axios";

class UploadFilesService {
  upload(file, data, onUploadProgress) {
    console.log(data);
    let formData = new FormData();

    formData.append("image", file);
    formData.append("_id", data.id);
    formData.append("modelName", data.modelName);

    return axios.post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      onUploadProgress,
    });
  }

  getFiles() {
    return axios.get("/files");
  }
}

export default new UploadFilesService();
