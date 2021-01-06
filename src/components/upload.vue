<template>
  <div>
    <div v-if="currentFile">
      <div>
        <v-progress-linear v-model="progress" color="light-blue" height="25" reactive>
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row justify="center" align="center">
      <v-progress-circular
        v-if="imageIsLoading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <v-col cols="12">
        <v-img v-if="url" max-height="auto" max-width="250px" :src="url"></v-img>
        <v-file-input
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          show-size
          label="Click here to upload"
          @change="selectFile"
        ></v-file-input>
        <v-alert v-if="message" color="blue darken-4" dark>
          {{ message }}
        </v-alert>
      </v-col>
      <v-col cols="6">
        <v-btn color="success" :disabled="!currentFile" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card v-if="fileInfos.length > 0" class="mx-auto">
      <v-list>
        <v-subheader>List of Files</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(file, index) in fileInfos" :key="index">
            <a :href="file.url">{{ file.name }}</a>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import UploadService from "../services/UploadService";
export default {
  name: "upload-files",
  props: ["imageModel"],
  data() {
    return {
      imageIsLoading: false,
      url: "",
      workOrder: "",
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
    };
  },
  methods: {
    async selectFile(file) {
      this.imageIsLoading = true;
      if (file) {
        this.url = await URL.createObjectURL(file);
      } else this.url = "";

      this.progress = 0;
      this.currentFile = file;
      this.message = "";

      this.imageIsLoading = false;
    },
    upload() {
      if (!this.imageModel) {
        this.message = "Error no image model selected";
        return;
      }
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }
      this.message = "";
      UploadService.upload(this.currentFile, this.imageModel, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total) - 15;
      })
        .then((files) => {
          this.fileInfos = files.data;
          this.progress = 100;
          this.$emit("finished");
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
        });
    },
  },
};
</script>
