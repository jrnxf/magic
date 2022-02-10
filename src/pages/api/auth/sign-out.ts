import { setCookies } from '@/backend/utils'
import { COOKIES } from '@/lib/constants'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    setCookies(res, [
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

    return res.status(200).json({ success: true })
  }
}

export default handler
