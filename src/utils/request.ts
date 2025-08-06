import env from '@/env';
import { getClientInfo } from './platform';

type RequestOptions = Parameters<typeof uni.request>[0];

export interface Failure {
    success: false;
    code: number;
    data: string;
    traceId: string;
}

export interface Success<T> {
    success: true;
    code: 0;
    data: T;
    traceId: string;
}

export type RequestResponse<T> = {
    data: T;
    statusCode: number;
    header: any;
    cookies: string;
};

export type BizResponse<T> = RequestResponse<Success<T> | Failure>;

export interface Paged<T> {
    total: number;
    pageNo: number;
    pageSize: number;
    hasNext: boolean;
    records: T[];
}

export interface PagedParams {
    pageNo: number;
    pageSize: number;
}

const tokenKey = 'token';
const newTokenKey = 'newToken';
let tokenValue = '';

export const clearToken = () => {
    tokenValue = '';
};

const defaultConfig = {
    options: {
        timeout: 10000,
        enableQuic: true,
        // enableHttp2: true,
        // enableCache: true,
        header: {
            'Content-Type': 'application/json',
            ...getClientInfo()
        }
    },
    // 拦截器
    interceptor: {
        // 请求拦截器，检测本地是否有token
        request(options: RequestOptions) {
            try {
                let token = tokenValue;

                if (!token) {
                    token = uni.getStorageSync(tokenKey);

                    if (token) {
                        tokenValue = token;
                    }
                }

                if (token && options.header) {
                    options.header['Authorization'] = 'Bearer ' + token;
                }
            } catch (e) {
                console.log('request exception: ', e);
            }

            return options;
        },

        // 响应拦截器
        response(response: any = {}, options: RequestOptions) {
            if (response.statusCode === 401) {
                uni.removeStorageSync(tokenKey);
                uni.showToast({
                    icon: 'none',
                    title: '登录已过期，需重新登录',
                    complete() {
                        uni.redirectTo({
                            url: '/pages/user/login'
                        });
                    }
                });
            }

            if (typeof response.data === 'object') {
                response.data.success = response.statusCode < 400 && response.data.code === 0;
            }

            if (response.data) {
                const data = response.data.data;
                if (
                    response.data.success &&
                    data &&
                    typeof data === 'object' &&
                    (data[tokenKey] || data[newTokenKey])
                ) {
                    const token = data[tokenKey] || data[newTokenKey];
                    if (token) {
                        tokenValue = token;
                        uni.setStorageSync(tokenKey, tokenValue);
                    }
                }
            } else {
                // #ifdef APP
                if (
                    tokenValue &&
                    !['huawei', 'honor'].includes(defaultConfig.options.header.brand)
                ) {
                    return new Promise(resolve => {
                        plus.nativeUI.confirm(
                            '当前无法响应您的请求，是否需要重试？',
                            async ({ index: yes }: { index: 0 | 1 }) => {
                                // @ts-ignore;
                                let tryTimes = options._tryTimes || 0;
                                tryTimes++;
                                if (yes && tryTimes < 4) {
                                    // @ts-ignore;
                                    options._tryTimes = tryTimes;

                                    const res = await request(options);
                                    resolve(res);
                                } else {
                                    resolve(response);
                                }
                            },
                            {
                                title: '发生网络错误',
                                verticalAlign: 'top',
                                buttons: ['算了', '重试']
                            }
                        );
                    });
                }
                // #endif

                // #ifdef H5
                uni.showToast({
                    title: '服务错误',
                    icon: 'none'
                });
                // #endif
            }

            switch (response.statusCode) {
                case 404:
                    console.error('请求的资源不存在');
                    break;
                case 500:
                    console.error('服务器错误');
                    break;
                case 502:
                    console.error('服务正在启动...');
                    uni.showToast({
                        icon: 'error',
                        title: '服务正在启动...',
                        duration: 5000
                    });
                    break;
                default:
                    break;
            }

            return response;
        }
    }
};

const isAbsoluteUrl = (url: string) => /(?:https?:)?\/\//i.test(url);

const request = <T>(options: RequestOptions): Promise<BizResponse<T>> => {
    const { interceptor } = defaultConfig;
    if (!isAbsoluteUrl(options.url)) {
        options.url = env.apiUrl + options.url;
    }

    let newOptions = interceptor.request({
        ...defaultConfig.options,
        ...options
    });

    if (process.env.NODE_ENV === 'development') {
        if (newOptions.method === 'POST') {
            console.log(
                `[HTTP ${newOptions.method}] ${newOptions.url} with DATA ${JSON.stringify(newOptions.data)}`
            );
        } else {
            console.log(
                `[HTTP ${newOptions.method}] ${newOptions.url} with HEADER ${JSON.stringify(newOptions.header)}`
            );
        }
    }

    return new Promise((resolve, reject) => {
        newOptions.complete = (response: any) => {
            if (process.env.NODE_ENV === 'development') {
                // #ifndef H5
                console.log(
                    `[HTTP ${newOptions.method}] ${newOptions.url} [${response.statusCode}] result: ${JSON.stringify(
                        response
                    )}`
                );
                // #endif
            }

            const { statusCode } = response;

            let newResponse = interceptor.response(response, options);

            // @ts-ignore
            if (newResponse.then) {
                resolve(newResponse);
                return;
            }

            if (statusCode < 400) {
                resolve(newResponse);
            } else {
                reject(newResponse);
            }

            if (typeof options.complete === 'function') {
                // @ts-ignore
                options.complete(newResponse);
            }
        };

        // @ts-ignore
        uni.request<BizResponse<T>>(newOptions);
    });
};

export const post = <T>(
    url: string,
    data: RequestOptions['data'],
    method: RequestOptions['method'] = 'POST'
) => {
    return request<T>({
        url,
        data,
        method
    });
};

export const put = <T>(url: string, data: RequestOptions['data']) => post<T>(url, data, 'PUT');

export const get = <T>(
    url: string,
    params?: Record<string, any>,
    method: RequestOptions['method'] = 'GET'
) => {
    if (params) {
        const searchParams: string[] = [];
        for (let [key, value] of Object.entries(params)) {
            if (value != null) {
                searchParams.push(`${key}=${encodeURIComponent(value)}`);
            }
        }

        if (searchParams.length) {
            url = `${url}${url.includes('?') ? '&' : '?'}${searchParams.join('&')}`;
        }
    }

    return request<T>({
        url,
        method
    });
};

export const upload = (url: string, filePath: string): Promise<BizResponse<string>> => {
    // @ts-ignore
    return new Promise<string>((resolve, reject) => {
        // @ts-ignore
        const { header } = defaultConfig.interceptor.request({ header: {} });

        const options = {
            url: `${env.apiUrl}${url}`,
            filePath,
            name: 'file',
            header,
            success(response: any = {}) {
                response.data = JSON.parse(response.data);
                response = defaultConfig.interceptor.response(response, options);
                // @ts-ignore
                resolve(response);
            },
            fail(e: any = {}) {
                reject(e);
            }
        };
        uni.uploadFile(options);
    });
};

export interface CallFunctionOptions<T = {}, P = {}> {
    name: string;
    data?: P;
    success(res: BizResponse<T>): void;
    fail(e: Error): void;
}

let systemInfo: UniApp.GetSystemInfoResult & { APPID: string; DEVICEID: string };

uni.getSystemInfo().then(
    info => (systemInfo = Object.assign({ APPID: info.appId, DEVICEID: info.deviceId }, info))
);

export const callFunction = <T, P>(options: CallFunctionOptions<T, P>): void => {
    if (!systemInfo) {
        const info = uni.getSystemInfoSync();
        systemInfo = Object.assign({ APPID: info.appId, DEVICEID: info.deviceId }, info);
    }

    console.log('xxxxxxxxxxxxxxxx callFunction', options);
    post<T>(
        `${env.pushUrl}/${options.name}New`,
        Object.assign(options.data || {}, { clientInfo: systemInfo })
    )
        .then(res => {
            if (res.data.success) {
                options.success(res);
            }
        })
        .catch(e => options.fail(e));
};
