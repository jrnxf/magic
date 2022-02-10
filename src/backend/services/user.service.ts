import { prisma } from '@/backend/prisma'

export default class UserService {
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user ?? null
  }
}
