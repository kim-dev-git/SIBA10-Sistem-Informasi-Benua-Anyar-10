<template>
  <div>
    <v-sheet id="fixed" :color="color" height="140px" tile />
    <v-sheet id="fixed" class="skew" :color="color" :height="height" tile />
  </div>
</template>

<script>
export default {
  props: [
    'color',
    'height',
  ]
}
</script>

<style lang="scss" scoped>
  $radius: 4px;

  #fixed {
    position: absolute !important;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100vw;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
  }

  .skew {
    transform:skewY(-10deg);
      -ms-transform:skewY(-10deg);
      -webkit-transform:skewY(-10deg);
  }
</style>