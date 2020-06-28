export function debug(data: any) {
  console.log(data)
}

export function notice(data: any) {
  console.log(data)
}

export function error(data: any) {
  console.error(data)
}

export default {
  debug,
  notice,
  error,
}
