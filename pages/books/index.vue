<template>
  <up-action-sheet :actions="list" v-model:show="show"></up-action-sheet>
</template>

<script setup>
import { ref } from 'vue';

const list = ref([
  {
    text: '点赞',
    color: 'blue',
    fontSize: 28
  },
  {
    text: '分享'
  },
  {
    text: '评论'
  }
]);
console.log(list.value);
const show = ref(true);
</script>

<style lang="scss">
</style>