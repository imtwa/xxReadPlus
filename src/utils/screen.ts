const systemInfo = uni.getSystemInfoSync();
const platform = systemInfo.platform;

let storedVisibility = 0;
/**
 * 设置全屏
 */
export function enterFullScreen() {
    // #ifdef APP-PLUS

    if (platform === 'android') {
        // const WindowManager = plus.android.importClass('android.view.WindowManager');
        const View = plus.android.importClass('android.view.View');
        // const Color = plus.android.importClass('android.graphics.Color');

        plus.android.importClass('android.view.Window');

        const mainActivity = plus.android.runtimeMainActivity();
        const windowAndroid = mainActivity.getWindow();
        const decorView = windowAndroid.getDecorView();

        storedVisibility = decorView.getSystemUiVisibility();

        decorView.setSystemUiVisibility(
            storedVisibility |
                // | View.SYSTEM_UI_FLAG_FULLSCREEN
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            // | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            // | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            // | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            // | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );
        // windowAndroid.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
    } else {
        plus.navigator.setFullscreen(true);
    }

    // #endif
}

/**
 * 恢复屏幕
 */
export function exitFullScreen() {
    // #ifdef APP-PLUS
    if (platform === 'android') {
        // const WindowManager = plus.android.importClass('android.view.WindowManager');
        // const View = plus.android.importClass('android.view.View');
        // const Color = plus.android.importClass('android.graphics.Color');

        plus.android.importClass('android.view.Window');

        const mainActivity = plus.android.runtimeMainActivity();
        const windowAndroid = mainActivity.getWindow();

        const decorView = windowAndroid.getDecorView();
        decorView.setSystemUiVisibility(
            storedVisibility
            // View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            //     | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            //     | View.SYSTEM_UI_FLAG_VISIBLE
        );
        // windowAndroid.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN); // 清除全屏标志
    } else {
        plus.navigator.setFullscreen(false);
    }
    // #endif
}

export const setFullScreen = (isFullScreen = true) =>
    isFullScreen ? enterFullScreen() : exitFullScreen();
