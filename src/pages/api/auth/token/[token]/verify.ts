import { prisma } from '@/backend/prisma'
import { setCookies } from '@/backend/utils'
import { COOKIES } from '@/lib/constants'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { token } = req.query

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: token as string,
      },
    })

    if (verificationToken) {
      if (verificationToken.expires < new Date()) {
        res.redirect('/auth?error=token_expired')
      }
      // TODO: check token expiry right here
      await prisma.verificationToken.delete({ where: { token: token as string } })

      const { email } = verificationToken

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: nanoid(10),
            email,
          },
        })
      }

      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 15, // 15 minutes
        },
      )

      const refreshToken = await prisma.refreshToken.create({
        data: {
          token: nanoid(10),
          userId: user.id,
          expires: moment().add(1, 'year').toDate(),
        },
      })

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
        {
          name: COOKIES.AUTH.REFRESH_TOKEN,
          value: refreshToken.token,
          options: {
            path: '/',
            expires: moment().add(1, 'year').toDate(),
            httpOnly: true,
            secure: true,
          },
        },
      ])
      res.redirect('/profile')
    } else {
      res.redirect('/auth?error=token_not_found')
    }
  }
}

export default handler
