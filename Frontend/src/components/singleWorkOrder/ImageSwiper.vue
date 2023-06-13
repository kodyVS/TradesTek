<template>
  <div>
    <v-dialog
      v-model="dialog"
      v-if="singleImage"
      class="dialog"
      width="unset"
      max-height="100vh"
      :max-width="maxWidth(singleImage)"
    >
      <v-img contain :src="singleImage.compressedImageURL" class="image-popup">
        <v-expand-transition>
          <v-container fluid class="ma-0 pa-0">
            <v-row justify="center" class="image-menu-text ma-0 pa-0 raised-box">
              <v-col>
                <h4>
                  {{ imageDate }}
                </h4></v-col
              >
              <v-col>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-icon color="black" class="text-right image-menu" v-on="on"
                      >mdi-dots-vertical</v-icon
                    >
                  </template>
                  <v-list>
                    <v-list-item @click="saveImage()">
                      <v-list-item-title> Save </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="imgDelete(singleImage)">
                      <v-list-item-title>Delete image</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row></v-container
          >
        </v-expand-transition>
      </v-img>
    </v-dialog>
    <swiper :options="swiperOptions" ref="mySwiperRef" v-if="workOrderImageCheck()">
      <swiper-slide v-for="(image, index) in workOrder.Images" :key="index">
        <!--<img class="img" @click="imgClick(image)" :src="image.url" alt="Image not found" />-->
        <vLazyImage
          class="img"
          v-on:click.native="imgClick(image)"
          v-on:mouseover.native="showDate = true"
          v-on:mouseleave.native="showDate = false"
          :src="image.compressedImageURL"
          :src-placeholder="image.placeholderURL"
          alt="Image not found"
        >
        </vLazyImage>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div
        class="swiper-button-prev"
        slot="button-prev"
        @click="$refs.mySwiperRef.$swiper.slidePrev()"
      ></div>
      <div
        class="swiper-button-next"
        slot="button-next"
        @click="$refs.mySwiperRef.$swiper.slideNext()"
      ></div>
    </swiper>
    <v-row v-else justify="center">
      <p><i>No Images for this work order</i></p>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import vLazyImage from "v-lazy-image";
import moment from "moment";
export default {
  components: {
    vLazyImage,
  },
  props: ["workOrder"],
  data() {
    return {
      showDate: false,
      hoverImage: false,
      dialog: false,
      singleImage: "",
      swiperOptions: {
        slidesPerView: 5,
        spaceBetween: 1,
        freeMode: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        },
      },
    };
  },
  computed: {
    imageDate: function () {
      return this.singleImage.created_at
        ? moment(this.singleImage.created_at).format(" MMMM Do YYYY")
        : "";
    },
  },
  methods: {
    imgClick(image) {
      this.singleImage = image;
      this.dialog = true;
    },
    async imgDelete(image) {
      try {
        let payload = {
          WorkOrderID: this.workOrder._id,
          ImagePublicID: image.public_id,
        };
        await axios.patch(process.env.VUE_APP_API_URL + "/api/v1/workOrder/deleteImage", payload, {
          withCredentials: true,
        });
        this.$router.go();
      } catch (err) {
        console.log(err);
      }
    },
    maxWidth(image) {
      if (image.width > image.height) {
        return "100vh";
      }
      return "60vh";
    },
    workOrderImageCheck() {
      if (this.workOrder.Images) {
        if (this.workOrder.Images.length > 0) {
          return true;
        }
      }
      return false;
    },
    saveImage() {
      axios({
        url: this.singleImage.url,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `${this.singleImage.asset_id}.${this.singleImage.format}`
        );
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
  },
};
</script>

<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.swiper-container {
  height: 210px;
  width: 90%;
}
.img {
  max-height: 100%;
  object-fit: contain;
}
.img:hover {
  cursor: pointer;
  transform: translateY(-1px);
  opacity: 0.8;
}

.image-menu {
  opacity: 0;
}
.image-menu-text {
  opacity: 0;
}
.image-popup {
  overflow: hidden;
}
.image-popup:hover .image-menu {
  opacity: 1;
}
.image-popup:hover .image-menu-text {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  transition: 0.5s;
}
.raised-box {
  box-shadow: 0px 2px 5px 1px rgba(30, 30, 30, 0.5);
}
.dialog {
  overflow-y: "hidden" !important;
}
.v-lazy-image {
  filter: blur(5px);
  transition: filter 0.3s;
}
.v-lazy-image-loaded {
  filter: blur(0);
}
.text-right {
  float: right;
}
</style>
