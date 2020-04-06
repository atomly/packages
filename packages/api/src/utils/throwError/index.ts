import * as Errors from './errors';

const errorsByStatus: Errors.ErrorMap = {
  500: {
    name: 'Internal Server Error',
    description: 'The server has encountered a situation it doesn\'t know how to handle.',
  },
  501: {
    name: 'Not Implemented',
    description: 'The request method is not supported by the server and cannot be handled.',
  },
  502: {
    name: 'Bad Gateway',
    description: 'The server while working as a gateway to get a response needed to handle the request, got an invalid response.',
  },
  503: {
    // Note that together with this response, a user-friendly page explaining the problem should be sent.
    // If possible, the response should contain the estimated time before the recovery of the service.
    // The webmaster must also take care about the caching-related headers that are sent along with
    // this response, as these temporary condition responses should usually not be cached.
    name: 'Service Unavailable',
    description: 'The server is not ready to handle the request. Server is down for maintenance or might be overloaded.',
  },
  504: {
    name: 'Gateway Timeout',
    description: 'This error response is given when the server is acting as a gateway and cannot get a response in time.',
  },
  505: {
    name: 'HTTP Version Not Supported',
    description: 'The HTTP version used in the request is not supported by the server.',
  },
  506: {
    name: 'Variant Also Negotiates',
    description: 'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.',
  },
  507: {
    name: 'Insufficient Storage (WebDAV)',
    description: 'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
  },
  508: {
    name: 'Loop Detected (WebDAV)',
    description: 'The server detected an infinite loop while processing the request.',
  },
  510: {
    name: 'Not Extended',
    description: 'Further extensions to the request are required for the server to fulfil it.',
  },
  511: {
    // Authentication Middlewares will return this error.
    name: 'Network Authentication Required',
    description: 'The 511 status code indicates that the client needs to authenticate to gain network access.',
  },
  512: {
    name: 'Query Error',
    description: 'Data not found or not saved in session.',
  },
  513: {
    name: 'Authentication Error',
    description: 'User not found or error during user creation.',
  },
  514: {
    name: 'Logout Error',
    description: 'User not logged in.',
  },
  515: {
    name: 'Redis Logout Error',
    description: 'Something went wrong when deleting the user\'s session out from the Redis store.',
  },
  516: {
    name: 'Entity Validation Error',
    description: 'Validation went wrong creating a new entity. Data is either missing or of the wrong type.',
  },
  517: {
    name: 'GraphQL Depth Limit Error',
    description: 'GraphQL queries suffer from a possible DOS vulnerability. For this reason, there is a limit set to the depth of the queries.',
  },
}

export function throwError({
  status = Errors.EStatuses.INTERNAL_SERVER_ERROR,
  message,
  details,
  cause,
  downtime_end_date: downtimeEndDate,
  shouldDisplayMessageInProduction = true,
}: Errors.IThrowErrorOptions = {}): Errors.IThrowError {
  const error = errorsByStatus[status ?? Errors.EStatuses.INTERNAL_SERVER_ERROR];
  const errorPayload = {
    status: status,
    statusText: error.name,
    type: 'error',
    body: {
      name: error.name,
      description: error.description,
      message: shouldDisplayMessageInProduction ? message : undefined,
      details,
      cause,
      // eslint-disable-next-line @typescript-eslint/camelcase
      downtime_end_date: downtimeEndDate,
    },
  };
  throw new Error(JSON.stringify(
    errorPayload,
    null,
    2,
  ));
}

throwError.Errors = Errors;
