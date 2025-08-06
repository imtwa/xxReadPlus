export interface ClientInfo {
    ios?: '1';
    android?: '1';
    platform: string;
    brand: string;
    version: string;
    ver: number | string;
    channel?: string;
    host?: string;
}

let clientInfo: ClientInfo | undefined;

type CallbackFunction<T> = (options: { success(res: T): void; fail(): void }) => void;

export const promisify = async <T extends AnyObject>(fn: CallbackFunction<T>, thisArg?: any) => {
    return new Promise<T>(resolve => {
        fn.call(thisArg || plus.device, {
            success(res: T) {
                resolve(res);
            },
            fail() {
                resolve({} as T);
            }
        });
    });
};

export interface DeviceInfo {
    imei: string;
    idfa: string;
    oaid: string;
    anonymousId: string;
}

let deviceInfo: DeviceInfo | Partial<DeviceInfo> | undefined;

export const getIdfa = async () => {
    return promisify<{ imei: string; uuid: string; idfa: string }>(plus.device.getInfo);
};

export const getDeviceInfo = async () => {
    if (!deviceInfo) {
        // #ifdef APP-PLUS
        const [{ imei = '', uuid = '', idfa = '' }, { oaid = '' }] = await Promise.all([
            promisify<{ imei: string; uuid: string; idfa: string }>(plus.device.getInfo),
            promisify<{ oaid: string }>(plus.device.getOAID)
        ]);

        deviceInfo = {
            imei: imei.trim(),
            idfa: idfa.trim(),
            // caid : string,
            oaid: oaid.trim(),
            // androidId : string,
            anonymousId: uuid.trim()
        };
        // #endif

        // #ifndef APP-PLUS
        deviceInfo = {
            // imei: '',
            // oaid: '',
            // anonymousId: ''
        };
        // #endif
    }

    return deviceInfo;
};

export const getClientInfo = () => {
    if (!clientInfo) {
        const deviceInfo = uni.getDeviceInfo();
        const appInfo = uni.getAppBaseInfo();

        const { appWgtVersion, appVersion, appVersionCode } = appInfo;
        const version = appWgtVersion || appVersion;
        let ver = appVersionCode;
        if (appWgtVersion) {
            ver = version
                .split('-')[0]
                .split('.')
                .map((n, i, vers) => parseInt(n) * Math.pow(100, vers.length - i - 1))
                .reduce<number>((total, n) => total + n, 0)
                .toString();
        }

        const platform = deviceInfo.platform === 'macos' ? 'ios' : deviceInfo.platform;

        clientInfo = {
            brand: deviceInfo.deviceBrand || 'apple',
            platform,
            version,
            ver,
            // #ifdef APP-PLUS
            channel: plus.runtime.channel,
            // #endif
            // #ifdef MP
            // @ts-ignore
            'host-app': appInfo.uniPlatform,
            // #endif
            // ...{
            //     platform: 'android',
            //     brand: 'huawei',
            //     channel: 'huawei'
            // },
            [platform]: '1'
        };
    }

    return clientInfo!;
};

export default getClientInfo;
