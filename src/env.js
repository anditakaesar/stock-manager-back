export const PORT = parseInt(process.env.PORT, 10) || 3000
export const JWT_ALGORITHM = 'RS256'
export const JWT_EXPSEC = parseInt(process.env.JWT_EXPSEC, 10) || 120
export const HTTP_STATUS = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  OK: 200,
}

export const env = {
  PORT,
  JWT_ALGORITHM,
  JWT_EXPSEC,
  HTTP_STATUS,
}
