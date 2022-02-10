import { Transition } from '@headlessui/react'
import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent, Fragment, useState } from 'react'
import { getAuthdUserFromCookies } from '@/backend/utils'
import { useAuth } from '@/context/auth.context'

enum MagicLinkStatuses {
  NotSent = 'not sent',
  Sending = 'sending',
  Sent = 'sent',
}

enum TokenErrors {
  NotFound = 'token_not_found',
  Expired = 'token_expired',
}

const Login: NextPage = () => {
  const router = useRouter()
  const { sendMagicLink } = useAuth()
  const [magicLinkData, setMagicLinkData] = useState({
    status: MagicLinkStatuses.NotSent,
    email: null,
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value

    setMagicLinkData({
      status: MagicLinkStatuses.Sending,
      email,
    })

    await sendMagicLink(email)

    setMagicLinkData({
      status: MagicLinkStatuses.Sent,
      email,
    })
  }

  return (
    <div>
      <Transition
        as={Fragment}
        show={magicLinkData.status === MagicLinkStatuses.Sent}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="p-3 mx-auto mb-4 text-xl font-medium text-white rounded-md shadow-sm bg-emerald-700 max-w-fit">
          A magic link has been sent to your email! Click the link within 24 hours to login.
        </div>
      </Transition>

      {router.query?.error === TokenErrors.NotFound &&
        magicLinkData.status === MagicLinkStatuses.NotSent && (
          <div className="p-3 mx-auto mb-4 text-xl font-medium text-white rounded-md shadow-sm bg-rose-700 max-w-fit">
            The link you clicked was not found or has already been used! Please login again!
          </div>
        )}

      {router.query?.error === TokenErrors.Expired &&
        magicLinkData.status === MagicLinkStatuses.NotSent && (
          <div className="p-3 mx-auto mb-4 text-xl font-medium text-white rounded-md shadow-sm bg-rose-700 max-w-fit">
            The link you clicked has already expired. Please login again!
          </div>
        )}

      {magicLinkData.status !== MagicLinkStatuses.Sent && (
        <form onSubmit={onSubmit} className="flex flex-col items-end max-w-xs mx-auto">
          <div className="w-full mb-2">
            <label htmlFor="email" className="label">
              email
            </label>
            <input id="email" className="mb-1 form-control" type="email" name="email" required />
          </div>
          <button className="btn-indigo">
            {magicLinkData.status !== MagicLinkStatuses.Sending ? 'send magic link' : 'sending...'}
          </button>
        </form>
      )}
    </div>
  )
}

export default Login

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authdUser = await getAuthdUserFromCookies(ctx)

    if (authdUser) {
      return {
        redirect: {
          destination: `/profile`,
          permanent: false,
        },
      }
    }
  } catch {
    // not authenticated... proceed
  }
  return {
    props: {},
  }
}
