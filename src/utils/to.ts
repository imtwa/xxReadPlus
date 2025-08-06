interface ToImplements {
    navigateTo(options: UniApp.NavigateToOptions): void;
    redirectTo(options: UniApp.RedirectToOptions): void;
    reLaunch(options: UniApp.ReLaunchOptions): void;
    switchTab(options: UniApp.SwitchTabOptions): void;
}

type AnyFunction = (...args: any[]) => void;

const before = <T extends AnyFunction, P extends AnyFunction>(before: T, after?: P) => {
    if (after) {
        return (...args: any[]) => {
            before(...args);
            after(...args);
        };
    }

    return before;
};

class ToClass implements ToImplements {
    // #ifdef APP
    private static instance: ToClass;
    // private time : number;
    lock = false;
    // #endif

    private constructor() {
        // this.time = time;
        this.lock = false;
        this.unLock = this.unLock.bind(this);
    }

    // 单例模式，确保只有一个实例
    public static getInstance(): ToClass {
        if (!ToClass.instance) {
            ToClass.instance = new ToClass();
        }
        return ToClass.instance;
    }

    private unLock() {
        this.lock = false;
    }

    // 私有方法，用于执行导航操作并设置锁
    private navigateAndLock<T extends AnyFunction>(func: T, options: Parameters<T>[0]): void {
        if (this.lock) {
            return;
        }

        this.lock = true;

        options.success = before(this.unLock, options.success);
        func(options);
    }

    // 返回到历史页面
    navigateBack(options: UniApp.NavigateBackOptions): void {
        this.navigateAndLock(uni.navigateBack, options);
    }

    // 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面
    navigateTo(options: UniApp.NavigateToOptions): void {
        this.navigateAndLock(uni.navigateTo, options);
    }

    // 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
    redirectTo(options: UniApp.RedirectToOptions): void {
        this.navigateAndLock(uni.redirectTo, options);
    }

    // 关闭所有页面，打开应用内的某个页面
    reLaunch(options: UniApp.ReLaunchOptions): void {
        this.navigateAndLock(uni.reLaunch, options);
    }

    // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
    switchTab(options: UniApp.SwitchTabOptions): void {
        this.navigateAndLock(uni.switchTab, options);
    }
}

// 获取单例实例
export const useUni = ToClass.getInstance();
