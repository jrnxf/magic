import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import { prisma } from '@/backend/prisma'
import { UserCardLarge } from '@/components/UserCardLarge'

const User: NextPage = ({ user }: any) => <UserCardLarge user={user} />

export default User

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.query.id as string,
      },
    })
    return {
      props: {
        user,
      },
    }
  } catch {
    return {
      redirect: {
        destination: `/users`,
        permanent: false,
      },
    }
  }
}
