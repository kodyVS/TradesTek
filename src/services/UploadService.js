import axios from "axios";

class UploadFilesService {
  upload(file, _id, onUploadProgress) {
    let formData = new FormData();

    formData.append("image", file);
    formData.append("_id", _id);

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
