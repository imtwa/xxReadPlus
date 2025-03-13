<template>
  <view class="container">
    <!-- 搜索历史测试区域 -->
    <view class="test-section">
      <view class="section-title">搜索历史测试</view>

      <!-- 添加搜索历史 -->
      <view class="input-group">
        <input v-model="searchText" type="text" placeholder="输入搜索内容" class="input" />
        <button @click="addHistory" class="btn">添加历史</button>
      </view>

      <!-- 历史记录列表 -->
      <view class="history-list">
        <view class="list-header">
          <text>历史记录</text>
          <text @click="clearAll" class="clear-btn">清空</text>
        </view>
        <view v-for="item in historyList" :key="item.id" class="history-item">
          <text>{{ item.content }}</text>
          <text @click="removeItem(item.id)" class="delete-btn">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SearchHistoryService } from '@/db/service/index'

const searchText = ref('')
const historyList = ref([])

// 加载历史记录
const loadHistory = async () => {
  try {
    historyList.value = await SearchHistoryService.getList()
  } catch (err) {
    uni.showToast({
      title: '加载历史记录失败',
      icon: 'none'
    })
  }
}

// 添加历史记录
const addHistory = async () => {
  if (!searchText.value.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }

  try {
    await SearchHistoryService.add(searchText.value)
    searchText.value = ''
    await loadHistory()
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '添加失败',
      icon: 'none'
    })
  }
}

// 删除单条记录
const removeItem = async id => {
  try {
    await SearchHistoryService.remove(id)
    await loadHistory()
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    })
  }
}

// 清空所有记录
const clearAll = async () => {
  try {
    await SearchHistoryService.clearAll()
    await loadHistory()
    uni.showToast({
      title: '清空成功',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '清空失败',
      icon: 'none'
    })
  }
}

// 页面加载时获取历史记录
onMounted(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.test-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.input-group {
  display: flex;
  margin-bottom: 20rpx;

  .input {
    flex: 1;
    border: 1px solid #eee;
    border-radius: 8rpx;
    padding: 10rpx 20rpx;
    margin-right: 20rpx;
  }

  .btn {
    width: 160rpx;
    font-size: 28rpx;
    padding: 0;
  }
}

.history-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .clear-btn {
      color: #999;
      font-size: 28rpx;
    }
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;

    .delete-btn {
      color: #ff5a5f;
      font-size: 28rpx;
    }
  }
}
</style>
