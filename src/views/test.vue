<template>
  <div>
    <div v-if="currentFile">
      <div>
        <v-progress-linear v-model="progress" color="light-blue" height="25" reactive>
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row no-gutters justify="center" align="center">
      <v-col cols="8">
        <v-file-input show-size label="File input" @change="selectFile"></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-btn color="success" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="message" border="left" color="blue-grey" dark>
      {{ message }}
    </v-alert>

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
  data() {
    return {
      workOrder: { _id: "5f6a8692b24d823e40abf03c" },
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
    };
  },
  methods: {
    selectFile(file) {
      this.progress = 0;
      this.currentFile = file;
    },
    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }
      this.message = "";
      UploadService.upload(this.currentFile, this.workOrder._id, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((files) => {
          this.fileInfos = files.data;
          console.log(files);
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
        });
    },
  },
  mounted() {},
};
</script>
