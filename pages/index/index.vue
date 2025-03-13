<template>
  <view>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const title = ref('主页')
</script>

<style lang="scss">
.text-area {
  margin: 100px;
  .title {
    border: aliceblue;
  }
}
</style>
