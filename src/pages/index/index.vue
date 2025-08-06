<template>
    <view class="content">
        <view class="text-area">
            <text class="title">{{ userStore.title }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '@/stores/user';
import { parser } from '@/utils/parser';

const userStore = useUser();

userStore.title = parser('你好，{{name}}，欢迎来到我的小程序！');
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}
</style>
