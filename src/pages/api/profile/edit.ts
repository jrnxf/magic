import { prisma } from '@/backend/prisma'
import { COOKIES } from '@/lib/constants'
import { extractJwtClaims } from '@/lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const accessToken = req.cookies?.[COOKIES.AUTH.ACCESS_TOKEN]
    const jwtClaims = extractJwtClaims(accessToken)

    const { id } = jwtClaims.user
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    })

    res.status(200).json(user)
  } else {
    res.status(400).json({
      success: false,
    })
    // Handle any other HTTP method
  }
}

export default handler
