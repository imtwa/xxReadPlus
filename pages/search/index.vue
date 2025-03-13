<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input
          v-model="searchText"
          type="text"
          placeholder="搜索书名或作者"
          confirm-type="search"
          @confirm="handleSearch"
          @input="handleInput"
        />
        <u-icon v-if="searchText" name="close" size="20" color="#999" @click="clearSearch"></u-icon>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="history-section" v-if="!searchText">
      <view class="section-header">
        <text class="title">搜索历史</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      <view class="history-list">
        <view
          v-for="item in historyList"
          :key="item.id"
          class="history-item"
          @click="useHistory(item.content)"
        >
          <view class="item-content">
            <u-icon name="clock" size="14" color="#999"></u-icon>
            <text>{{ item.content }}</text>
          </view>
          <u-icon name="close" size="12" color="#999" @click.stop="removeHistory(item.id)"></u-icon>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-result" v-else>
      <view v-if="loading" class="loading">
        <up-loading-icon></up-loading-icon>
      </view>
      <view v-else-if="searchResults.length > 0" class="result-list">
        <view
          v-for="book in searchResults"
          :key="book.id"
          class="book-item"
          @click="goToDetail(book)"
        >
          <image :src="book.cover" mode="aspectFill" class="book-cover" />
          <view class="book-info">
            <text class="book-title">{{ book.title }}</text>
            <text class="book-author">{{ book.author }}</text>
            <text class="book-desc">{{ book.description }}</text>
          </view>
        </view>
      </view>
      <view v-else class="no-result">
        <text>暂无搜索结果</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SearchHistoryService } from '@/db/service/index'

// 状态定义
const searchText = ref('')
const historyList = ref([])
const searchResults = ref([])
const loading = ref(false)

// 加载搜索历史
const loadHistory = async () => {
  try {
    historyList.value = await SearchHistoryService.getList()
  } catch (err) {
    console.error('加载历史记录失败:', err)
  }
}

// 添加搜索历史
const addHistory = async content => {
  if (!content.trim()) return
  try {
    await SearchHistoryService.add(content)
    await loadHistory()
  } catch (err) {
    console.error('添加历史记录失败:', err)
  }
}

// 删除单条历史
const removeHistory = async id => {
  try {
    await SearchHistoryService.remove(id)
    await loadHistory()
  } catch (err) {
    console.error('删除历史记录失败:', err)
  }
}

// 清空历史
const clearHistory = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: async res => {
      if (res.confirm) {
        try {
          await SearchHistoryService.clearAll()
          await loadHistory()
        } catch (err) {
          console.error('清空历史记录失败:', err)
        }
      }
    }
  })
}

// 使用历史记录
const useHistory = content => {
  searchText.value = content
  handleSearch()
}

// 处理搜索
const handleSearch = async () => {
  if (!searchText.value.trim()) return

  loading.value = true
  try {
    // 添加到历史记录
    await addHistory(searchText.value)

    // TODO: 实现搜索逻辑
    searchResults.value = []
  } catch (err) {
    console.error('搜索失败:', err)
    uni.showToast({
      title: '搜索失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 输入处理
const handleInput = e => {
  searchText.value = e.detail.value
}

// 清空搜索
const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到详情页
const goToDetail = book => {
  uni.navigateTo({
    url: `/pages/book/detail?id=${book.id}`
  })
}

// 生命周期
onMounted(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  background: #fff;
}

.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--status-bar-height) 20rpx 20rpx;
  background: #fff;
  display: flex;
  align-items: center;
  z-index: 100;

  .search-box {
    flex: 1;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 30rpx;
    margin-right: 20rpx;
    display: flex;
    align-items: center;

    input {
      flex: 1;
      margin: 0 20rpx;
      font-size: 28rpx;
    }
  }

  .cancel-btn {
    font-size: 28rpx;
    color: #333;
  }
}

.history-section {
  margin-top: calc(var(--status-bar-height) + 112rpx);
  padding: 0 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .title {
      font-size: 32rpx;
      color: #333;
    }

    .clear-btn {
      font-size: 28rpx;
      color: #999;
    }
  }

  .history-list {
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid #f5f5f5;

      .item-content {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;

        text {
          margin-left: 10rpx;
        }
      }
    }
  }
}

.search-result {
  margin-top: calc(var(--status-bar-height) + 112rpx);
  min-height: 200rpx;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200rpx;
  }

  .result-list {
    padding: 0 30rpx;

    .book-item {
      display: flex;
      padding: 30rpx 0;
      border-bottom: 1px solid #f5f5f5;

      .book-cover {
        width: 160rpx;
        height: 200rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }

      .book-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .book-title {
          font-size: 32rpx;
          color: #333;
          font-weight: bold;
        }

        .book-author {
          font-size: 28rpx;
          color: #666;
        }

        .book-desc {
          font-size: 24rpx;
          color: #999;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }

  .no-result {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400rpx;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
