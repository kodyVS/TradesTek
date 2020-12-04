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
      <v-img contain :src="singleImage.url" class="image-popup">
        <v-expand-transition>
          <v-row>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-icon color="black" v-on="on" class="image-menu mr-4 mt-1"
                  >mdi-dots-vertical</v-icon
                >
              </template>
              <v-list>
                <v-list-item @click="imgDelete(singleImage)">
                  <v-list-item-title>Delete image</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-expand-transition>
      </v-img>
    </v-dialog>
    <swiper :options="swiperOptions" ref="mySwiperRef" v-if="workOrderImageCheck()">
      <swiper-slide v-for="(image, index) in workOrder.Images" :key="index">
        <img class="img" @click="imgClick(image)" :src="image.url" alt="Image not found" />
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
export default {
  props: ["workOrder"],
  data() {
    return {
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
.image-popup {
  overflow: hidden;
}
.image-popup:hover .image-menu {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 1;
}
.dialog {
  overflow-y: "hidden" !important;
}
</style>
