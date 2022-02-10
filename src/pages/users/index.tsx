import { NextPage } from 'next'
import React from 'react'
import { prisma } from '@/backend/prisma'
import { UserCardSmall } from '@/components/UserCardSmall'
import { User } from '@prisma/client'

const Users: NextPage<{ users: User[] }> = ({ users }) => {
  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        users?.map((user: User) => (
          <div key={user.id}>
            <UserCardSmall user={user} />
          </div>
        ))
      ) : (
        <div className="text-2xl text-center lowercase tracking-wide font-semibold">
          <p>No users found</p>
        </div>
      )}
    </div>
  )
}

export default Users

export const getServerSideProps = async () => {
  try {
    const users = await prisma.user.findMany()
    return {
      props: {
        users,
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
