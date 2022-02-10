import { getAuthdUserFromCookies } from '@/backend/utils'
import { UserCardLarge } from '@/components/UserCardLarge'
import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'

const Profile: NextPage = ({ authdUser }: any) => <UserCardLarge user={authdUser} />

export default Profile

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authdUser = await getAuthdUserFromCookies(ctx)
    return {
      props: {
        authdUser,
      },
    }
  } catch {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    }
  }
}
