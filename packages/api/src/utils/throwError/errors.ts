export interface IError {
  name: string
  description: string
  message?: string
  details?: string
  cause?: string
  downtime_end_date?: Date
}

export enum EStatuses {
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE_WEBDAV = 507,
  LOOP_DETECTED_WEBDAV = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
  QUERY = 512,
  AUTHENTICATION = 513,
  LOGOUT = 514,
  REDIS_LOGOUT = 515,
  ENTITY_VALIDATION = 516,
}

export type ErrorMap = {
  [key in EStatuses]: IError;
}

export interface IThrowErrorOptions extends Pick<IError, 'message' | 'details' | 'cause' | 'downtime_end_date'> {
  status?: EStatuses
  shouldDisplayMessageInProduction?: boolean
}

export interface IThrowError {
  status: EStatuses
  statusText: string
  type: string
  body: IError
}
