/**
 * 操作类型
 */
export enum MethodType {
    GET,
    POST,
    DELETE,
    PUT,
    HEAD
}

export interface IPointer {
    from: string;
    to: string;
}

/**
 * 数据拷贝移动操作
 */
export interface IJpp {
    set?: Array<IPointer>,
    copy?: Array<IPointer>,
    move?: Array<IPointer>,
    del?: Array<string>
}

/**
 * 操作的模型
 */
export interface IInterfaceModel {
    // 唯一字符串
    key: string;
    // 调用方法
    method: MethodType;
    // 接口服务器地址
    address: string;
    // 端口
    port?: number;
    // 接口地址
    path: string;
    // 接口所对应的服务器key
    serverKey?: string;
    // 接口所需参数,false 为不需要参数
    params?: boolean | Object;
    // 是否是restful接口
    isRestful: boolean;
    // 数据拷贝等
    jpp?: IJpp;
    // 复制header数据
    header?: IJpp;
    // put和delete请求时候带参数
    idFieldPath?: string;
    // 请求带上的配置
    config?: Object;
    // open ：表单打开时候调用接口
    useType?:string;
}