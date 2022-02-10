import AuthService from '@/backend/services/auth.service'
import { COOKIES } from '@/lib/constants'
import { setCookies } from '@/backend/utils'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const refreshToken = req.cookies?.[COOKIES.AUTH.REFRESH_TOKEN]

    if (refreshToken) {
      const { accessToken } = await AuthService.tryTokenRefresh(refreshToken)

      if (accessToken) {
        setCookies(res, [
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
        res.status(200).json({
          accessToken,
        })
      } else {
        setCookies(res, [
          {
            name: COOKIES.AUTH.REFRESH_TOKEN,
            value: '',
            options: {
              path: '/',
              maxAge: -1,
            },
          },
        ])
        res.status(400).json({
          success: false,
        })
      }
    } else {
      res.status(400).json({
        success: false,
      })
    }
  }
}

export default handler
