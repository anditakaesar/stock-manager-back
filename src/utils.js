/* eslint-disable import/prefer-default-export */
export const genError = (message, intmsg, status = 500) => {
  const newError = new Error(message)
  newError.intmsg = intmsg
  newError.status = status

  return newError
}
