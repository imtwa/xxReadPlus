<template>
    <view
        class="navigation-container"
        :class="[{ dark: darkMode, 'navigation-container-invert': isInvert, hide }, props['class']]"
        :style="!props.fixed ? 'position: static' : ''"
    >
        <view
            class="wrapper"
            :style="{
                ...(props.bgcolor ? { background: props.bgcolor } : {}),
                position: props.fixed ? 'fixed' : 'static',
                paddingTop: info.safeArea.top * 2 + 'rpx',
                height: height * 2 + 'rpx'
            }"
        >
            <view class="left" @click="onLeftClick">
                <slot v-if="showLeft" name="left" :data="props">
                    <image v-if="darkMode" class="btn-icon" src="@/static/icon/back.png" />
                    <image v-else class="btn-icon" src="@/static/icon/back-black.png" />
                </slot>
            </view>
            <view class="center" :class="{ 'align-left': alignLeft }">
                <slot :data="props">
                    <text class="title">
                        {{ props.title }}
                    </text>
                </slot>
            </view>

            <view class="right" @click="onRightClick">
                <slot v-if="props.showRight" name="right" :data="props">
                    <image v-if="darkMode" class="btn-icon" src="@/static/icon/reset.png" />
                    <image v-else class="btn-icon" src="@/static/icon/reset-black.png" />
                </slot>
            </view>
        </view>
    </view>
    <view
        v-if="props.fixed"
        class="navigation-placeholder"
        :style="{
            ...(props.bgcolor ? { background: props.bgcolor } : {}),
            height: height * 2 + 'rpx'
        }"
    />
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';

interface Props {
    class?: string;
    fixed: boolean;
    title: string;
    //当页面的scrollTop大于此值时，会显示标题(title)，否则不显示
    showTitleScrollDelta: number;
    bgcolor?: string;
    showLeft: boolean;
    showRight: boolean;
    alignLeft?: boolean;
    isTab?: boolean;
    darkMode?: boolean;
    hide?: boolean;
}

const props = withDefaults(defineProps<Partial<Props>>(), {
    fixed: true,
    showTitleScrollDelta: 0,
    showLeft: false,
    showRight: true,
    alignLeft: false,
    isTab: false,
    darkMode: false,
    hide: false
});

const emit = defineEmits<{
    leftclick: [];
    rightclick: [];
    invert: [boolean];
}>();

const showLeft = ref(props.showLeft);
const hide = computed(() => !!props.hide);

onBeforeMount(() => {
    const pages = getCurrentPages();
    if (!props.isTab && pages.length > 1) {
        showLeft.value = true;
    }
});

const info = uni.getWindowInfo();
const height = ref(info.safeArea.top + 44);
const isInvert = ref(false);

if (props.showTitleScrollDelta > 0) {
    onPageScroll(e => {
        const scrollTop = e.scrollTop;
        if (scrollTop > props.showTitleScrollDelta) {
            isInvert.value = true;
        } else {
            isInvert.value = false;
        }
        emit('invert', isInvert.value);
    });
}

const onLeftClick = () => {
    emit('leftclick');
};

const onRightClick = () => {
    emit('rightclick');
};
</script>

<style lang="scss" scoped>
@import '/constants/variables';

.navigation {
    &-container {
        // 仅低于 popup 的 99
        z-index: 98;
        position: relative;
        left: 0;
        top: 0;
        right: 0;

        &.hide {
            visibility: hidden;
        }

        .wrapper {
            left: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            width: 750rpx;
            padding-left: 36rpx;
            padding-right: 36rpx;
            transition: all 250ms ease-in-out;
            // background-color: #ff00bf;
        }

        .left,
        .right {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 64rpx;
            height: 100%;
            // background-color: #FF5793;
        }

        .right {
            // background-color: #FFEF5E;
        }

        .btn-icon {
            width: 64rpx !important;
            height: 64rpx !important;
        }

        .center {
            flex: 1;
            padding: 0 36rpx;
            text-align: center;
            // background-color: #99FF96;

            &.align-left {
                text-align: left;
            }
        }

        .title {
            overflow: hidden;
            display: block;
            height: 88rpx;
            text-overflow: ellipsis;
            -webket-line-clamp: 1;
            font: 600 36rpx / 88rpx $ming-font;
            color: #2d3548;
        }

        &.dark {
            .title {
                color: #ffffff;
            }
        }
    }

    &-placeholder {
        // background-color: #75ACFF;
    }

    /** 反色效果（默认为白色） */
    &-container-invert {
        .wrapper {
            // background-color: #ffffff;
        }
    }
}
</style>
