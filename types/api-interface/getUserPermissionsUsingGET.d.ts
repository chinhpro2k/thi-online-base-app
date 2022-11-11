declare namespace queryTestInfoUsingGET {
  interface Params {}

  interface Response {
    code: number
    status: boolean
    data: {
      info: string
    }
  }
}
declare namespace queryGet {
  interface Params {
    page: number;
    limit: number;
    cond: {
      [x: string]: unknown;
    };
    [x: string]: unknown;
  }
  interface Response {
    data: any;
    message: string;
    statusCode: number;
  }
}
declare namespace UserInfoNS {
  export interface SystemInfo {
    indentityValidate: boolean;
    emailValidate: boolean;
    thirdPartyAuth: boolean;
  }

  export interface NotifLichHoc {
    isReceiverNotifLichHoc: boolean;
  }

  export interface NotifChung {
    isReceiverNotifChung: boolean;
  }

  export interface UserNotifSetting {
    notifLichHoc: NotifLichHoc;
    notifChung: NotifChung;
  }

  export interface LastRequest {
    resetPassword: Date;
  }

  export interface User {
    "uid": number,
    "partnerId": any[],
    "hoTen": string,
    "maDinhDanh": string,
    "gioiTinh": string,
    "vaiTro": string,
    "donViId": boolean
    "anhDaiDien":any
  }

  export interface RootObject {
    user: User;
    accessToken: string;
  }
}