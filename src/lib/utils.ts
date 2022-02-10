export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const extractJwtClaims = (jwt: string) => {
  try {
    const claims = JSON.parse(Buffer.from(jwt?.split('.')[1], 'base64').toString('binary'))
    return claims
  } catch (e) {
    return null
  }
}
