<template>
  <view @click="navBar.closeMenu()">
    <nav-bar
      ref="navBar"
      title="我的书架"
      :count="bookCount"
      :visList="visList"
      @refresh="refresh"
      @import="openFileSystem"
      @visChange="handleVisChange"
    />

    <!-- 书架内容 -->
    <view :class="bookCount > 0 ? 'yesbook' : 'nobook'">
      <!-- 其他内容保持不变 -->
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/index.vue'

const navBar = ref(null)
const bookCount = ref(1)
const visList = ref(true)

// 视图切换
const handleVisChange = val => {
  visList.value = val
}

// 刷新
const refresh = () => {
  // 刷新逻辑
}

// 打开文件系统
const openFileSystem = () => {
  // 导入逻辑
}
</script>

<style lang="scss">
.nobook {
  padding-top: 150rpx;
  margin-top: 200rpx;
  height: 500rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.yesbook {
  padding-top: 80px;

  .book-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    margin: 0 5%;
    grid-gap: 8px;
  }

  .cont-badge {
    position: relative;
    top: -98%;
    margin-left: 95%;
  }

  .book-item {
    padding: 4px;
    max-width: 100%;
    box-sizing: border-box;
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .book-cover {
    width: 92px;
    max-width: 100%;
    height: 128px;
    border-radius: 5px;
    background-color: #efefef;
  }

  .book-name {
    font-size: 14px;
    color: #555;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: center;
  }

  .bookList {
    display: flex;
    justify-content: space-between;

    .listleft {
      width: 100%;
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 15%;

      .iconmin {
        height: 30px;
        margin-right: 40rpx;
      }
    }
  }
}
</style>
