import { getAuthdUserFromCookies } from '@/backend/utils'
import { useAuth } from '@/context/auth.context'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent } from 'react'

const EditProfile = ({ authdUser }) => {
  const router = useRouter()
  const { updateAuthdUser } = useAuth()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value
    const imageUrl = (event.currentTarget.elements.namedItem('imageUrl') as HTMLInputElement).value
    const bio = (event.currentTarget.elements.namedItem('bio') as HTMLInputElement).value

    console.log({ name, imageUrl, bio })
    await updateAuthdUser({
      imageUrl,
      name,
      bio,
    })
    router.push('/profile')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-end">
      <div className="w-full">
        <div className="mb-2">
          <label htmlFor="name" className="">
            name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={authdUser?.name}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="imageUrl" className="">
            image url
          </label>
          <input
            id="imageUrl"
            type="text"
            name="imageUrl"
            defaultValue={authdUser?.imageUrl}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="bio" className="">
            bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={authdUser?.bio}
            className="form-control"
            rows={10}
            maxLength={1000}
          />
        </div>
      </div>

      <button className="btn-indigo">update</button>
    </form>
  )
}

export default EditProfile

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
