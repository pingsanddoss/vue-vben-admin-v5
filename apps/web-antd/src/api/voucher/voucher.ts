import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 保存凭证
 * @param {*} data
 */
export function fmFinanceVoucherAddAPI(data) {
  // return request({
  //   url: `/financeCertificate/${data.certificateId ? 'update' : 'add'}`,
  //   method: 'post',
  //   data: data,
  //   headers: {
  //     'Content-Type': 'application/json;charset=UTF-8'
  //   }
  // })
  return requestClient.post<>(
    `/financeCertificate/${data.certificateId ? 'update' : 'add'}`,
    data,
  );
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
