enum EErrors {
  QUERY = 'query',
  AUTHENTICATION = 'authentication',
  AUTHENTICATION_MIDDLEWARE = 'authentication_middleware',
  LOGOUT = 'logout',
}

interface IThrowErrorByTypeArgs {
  errorType?: EErrors
  message?: string
  error: Error
  shouldThrowInProd?: boolean
}

export function throwError({
  errorType,
  message,
  error,
  shouldThrowInProd = true,
}: IThrowErrorByTypeArgs): void | null {
  const errorMesage = `${message}\n${error.message}`;
  if (
    shouldThrowInProd
    // (
    //   process.env.NODE_ENV === 'development' ||
    //   process.env.NODE_ENV === 'test'
    // )
  ) {
    switch (errorType) {
      case EErrors.QUERY:
        throw new Error(`[QUERY ERROR]: ${errorMesage}`);
      case EErrors.AUTHENTICATION:
        throw new Error(`[AUTHENTICATION ERROR]: ${errorMesage}`);
      case EErrors.AUTHENTICATION_MIDDLEWARE:
        throw new Error(`[AUTHENTICATION MIDDLEWARE ERROR]: ${errorMesage}`);
      case EErrors.LOGOUT:
        throw new Error(`[LOGOUT ERROR]: ${errorMesage}`);
      default:
        throw new Error(`[ERROR]: ${errorMesage}`);
    }
  }
  return null;
}

throwError.EErrors = EErrors;
