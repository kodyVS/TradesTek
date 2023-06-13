<template>
  <div class="swiper-lazy-box">
    <img class="swiper-lazy img" :data-src="src" ref="imgEle" />
  </div>
</template>

<script>
export default {
  name: "lazyImage",
  props: {
    src: String,
  },
  mounted() {
    this.$refs.imgEle.src = this.src;
  },
};
</script>
<style>
.img {
  max-height: 100%;
  object-fit: contain;
}
.img:hover {
  cursor: pointer;
  transform: translateY(-1px);
  opacity: 0.8;
}
</style>
