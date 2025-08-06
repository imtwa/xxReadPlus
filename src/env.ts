export type Environment = {
    wsUrl: string;
    apiUrl: string;
    inviteUrl: string;
};

// 判断是否为开发环境
export const isDev = (): boolean => {
    // @ts-ignore
    return process.env.NODE_ENV === 'development';
};

// 判断是否为H5环境
export const isH5 = (): boolean => {
    // #ifdef H5
    return true;
    // #endif

    // #ifndef H5
    return false;
    // #endif
};

let dev = isDev() ? 1 : 0;

export const toggleEnv = () => {
    dev = 1 - dev;
    console.log('已切换至 dev=', dev);
};

const nEnv = {
    get apiUrl() {
        if (isDev() && isH5()) {
            return '/api';
        }
        return dev === 1 ? 'https://api.mingo.host' : 'https://api.mingo.fun';
    },
    get inviteUrl() {
        if (isDev() && isH5()) {
            return '/app';
        }
        return dev === 1 ? 'https://app.mingo.host' : 'https://app.mingo.fun';
    }
};

export default nEnv;
