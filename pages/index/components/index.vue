<template>
  <view class="bar">
    <view class="uni-bar">
      <view class="flex">
        <view @click="toVisList" style="padding-top: 4px">
          <u-icon :name="visList ? 'list-dot' : 'grid-fill'" size="28px"></u-icon>
        </view>
      </view>

      <view class="uni-title">
        {{ title }}
        <span v-if="showCount" style="font-size: 14px">（共 {{ count }} 本）</span>
      </view>

      <view class="icon">
        <navigator url="/pages/search/index" hover-stay-time="0">
          <icon type="search" color="#2f2f2f"></icon>
        </navigator>
        <view
          @click.stop="toggleMenu"
          style="
            width: 50rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 25rpx;
            margin-top: 5px;
          "
        >
          <u-icon name="more-dot-fill" color="#000" size="23" style="transform: rotate(90deg)">
          </u-icon>
        </view>
      </view>
    </view>

    <view class="index-menu" v-show="showMenu">
      <slot name="menu">
        <view class="item" @click="handleRefresh">
          <view class="item-left">
            <u-icon name="reload" bold size="18"></u-icon>
          </view>
          <view class="item-right">刷新目录</view>
        </view>
        <view class="item" @click="handleImport">
          <view class="item-left">
            <u-icon name="plus-circle" bold size="16"></u-icon>
          </view>
          <view class="item-right">本地导入</view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 定义props
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  count: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: true
  },
  visList: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['refresh', 'import', 'visChange'])

// 菜单显示状态
const showMenu = ref(false)

// 切换列表视图
const toVisList = () => {
  emit('visChange', !props.visList)
}

// 切换菜单
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// 刷新
const handleRefresh = () => {
  emit('refresh')
  showMenu.value = false
}

// 导入
const handleImport = () => {
  emit('import')
  showMenu.value = false
}

// 关闭菜单
const closeMenu = () => {
  showMenu.value = false
}

// 暴露方法给父组件
defineExpose({
  closeMenu
})
</script>

<style lang="scss" scoped>
.bar {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;

  .uni-bar {
    background-color: #ffffff;
    margin-top: 30px;
    margin-left: 30rpx;
    margin-right: 35rpx;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .uni-title {
      font-size: 20px;
      color: #2f2f2f;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.index-menu {
  position: fixed;
  width: 300rpx;
  top: 80px;
  right: 8px;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 8rpx;
  border: 1px solid rgba(239, 239, 239, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  opacity: 0;
  transform: translateY(-10%);
  animation: fadeInFromTop 0.2s forwards;
  transition: none;

  .item {
    display: flex;
    justify-items: center;
    align-items: center;
    height: 48px;

    .item-left {
      margin-right: 8px;
      margin-top: 2px;
    }

    .item-right {
      font-size: 16px;
      color: #333;
    }
  }
}

@keyframes fadeInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
