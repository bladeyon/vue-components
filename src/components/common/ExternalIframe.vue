<template>
  <iframe style="height: 100%; width: 100%" :src="src" frameborder="0">
  </iframe>
</template>

<script>
export default {
  name: 'ExternalIframe',
  props: {
    src: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped></style>
