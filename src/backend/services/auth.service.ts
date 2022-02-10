import { prisma } from '@/backend/prisma'
import jwt from 'jsonwebtoken'

export default class AuthService {
  static async tryTokenRefresh(token: string) {
    const refreshTokenObj = await prisma.refreshToken.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    })

    const { user } = refreshTokenObj || {}
    if (user) {
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

      return {
        accessToken,
        user,
      }
    }
  }
}
