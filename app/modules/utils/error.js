
class CCError {
  constructor(code, errMsg, message, data = {}) {
    this.code = code;
    this.errMsg = errMsg;
    this.message = message;
    this.data = data;
  }
}

export const isCCError = err => err instanceof CCError;
export const throwCCError = (code, errMsg, message = errMsg, data = {}) => { throw new CCError(code, errMsg, message, data); };
export const invalidToken = () => throwCCError(1001, 'Access token is invalid.', 'Authentication Error');
export const accessDenied = () => throwCCError(1002, 'Access denied.', 'Authentication Error');
export const userNotFound = () => throwCCError(1003, 'User is not found.', 'Authentication Error');
export const invalidPwd = () => throwCCError(1004, 'User and password do not match.', 'Authentication Error');
export const invalidParams = () => throwCCError(1005, 'Params is error.', 'Query Error');
