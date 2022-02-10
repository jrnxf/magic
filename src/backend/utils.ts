import { CookieSerializeOptions, serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { GetServerSidePropsContext } from 'next'
import { COOKIES } from '@/lib/constants'
import { extractJwtClaims } from '@/lib/utils'
import AuthService from '@/backend/services/auth.service'
import UserService from '@/backend/services/user.service'

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const setCookies = (
  res: any,
  cookies: {
    name: string
    value: any
    options: CookieSerializeOptions
  }[],
) => {
  const cookieList = serializeCookies(cookies)
  res.setHeader('Set-Cookie', cookieList)
}

export const serializeCookies = (
  cookies: {
    name: string
    value: any
    options: CookieSerializeOptions
  }[],
) => {
  let serializedCookies = []

  for (const { name, value, options } of cookies) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
    serializedCookies.push(serialize(name, String(stringValue), options))
  }

  return serializedCookies
}

export const ssrAuthCheck = async (ctx: GetServerSidePropsContext) => {
  const cookies = ctx?.req?.cookies

  try {
    const accessToken = cookies?.[COOKIES.AUTH.ACCESS_TOKEN]
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_SECRET)
      const userId = extractJwtClaims(accessToken)?.user?.id
      if (userId) {
        const user = await UserService.getUserById(userId)
        if (user) {
          return {
            user,
          }
        }
      }
    }
  } catch (err) {
    // The provided access token was invalid. Will attempt to generate access token from refresh token
  }

  const refreshToken = cookies?.[COOKIES.AUTH.REFRESH_TOKEN]
  if (!refreshToken) return {}

  const { accessToken, user } = await AuthService.tryTokenRefresh(refreshToken)
  if (accessToken && user) {
    // let's set the new accessTokenCookie
    setCookies(ctx.res, [
      {
        name: COOKIES.AUTH.ACCESS_TOKEN,
        value: accessToken,
        options: {
          path: '/',
          expires: moment().add(15, 'minutes').toDate(),
          secure: true,
        },
      },
    ])
    return {
      user,
    }
  } else {
    return {}
  }
}

export const logout = async (ctx: GetServerSidePropsContext) => {
  setCookies(ctx.res, [
    {
      name: COOKIES.AUTH.ACCESS_TOKEN,
      value: '',
      options: {
        path: '/',
        maxAge: -1,
      },
    },
    {
      name: COOKIES.AUTH.REFRESH_TOKEN,
      value: '',
      options: {
        path: '/',
        maxAge: -1,
      },
    },
  ])
  return {
    redirect: {
      destination: `/auth`,
      permanent: false,
    },
  }
}

export const getAuthdUserFromCookies = async (ctx: GetServerSidePropsContext) => {
  const { user } = (await ssrAuthCheck(ctx)) || {}
  if (user) return user
  throw new Error('User not authenticated')
}
