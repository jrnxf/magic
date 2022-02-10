import { prisma } from '@/backend/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id } = req.query

    const user = await prisma.user.findUnique({
      where: {
        id: id as string,
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
