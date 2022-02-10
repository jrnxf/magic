/* This example requires Tailwind CSS v2.0+ */
import { useAuth } from '@/context/auth.context'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { GlobeIcon } from '@heroicons/react/outline'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

export const Navbar = () => {
  const router = useRouter()
  const { authdUser, logout } = useAuth()
  const navigation = [
    {
      icon: <GlobeIcon className="w-7 h-7" />,
      href: '/users',
      current: router.pathname === '/users',
    },
  ]

  return (
    <Disclosure as="nav">
      {() => (
        <>
          <div className="w-full max-w-[90vw] mx-auto">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-stretch justify-between flex-1">
                <div className="flex items-center flex-shrink-0 text-3xl font-semibold cursor-pointer">
                  <Link href="/users" passHref>
                    <p>magic 🪄</p>
                  </Link>
                </div>
                <div className="block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} passHref>
                        <button
                          className={classnames(
                            'p-2 rounded-full font-medium focus:ring-[3px] ring-inset ring-indigo-500 focus:ring-indigo-400 outline-none',
                            item.current && 'ring-[3px]',
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.icon}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="static inset-auto flex items-center pr-0 ml-3">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex text-sm rounded-full outline-none ring-offset-2 ring-offset-indigo-700 ring-indigo-400 bg-mirage-500 focus:ring-indigo-400 focus:ring-2 hover:ring-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="object-cover w-10 h-10 rounded-full"
                        src={authdUser?.imageUrl || '/placeholder.svg'}
                        alt={authdUser?.name || 'placeholder image'}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right rounded-md shadow-lg bg-mirage-500 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {authdUser ? (
                        <>
                          <Menu.Item>
                            <div className="block px-4 py-2">
                              <div className="text-sm font-bold truncate">{authdUser.name}</div>
                              <div className="text-xs font-medium truncate text-mirage-400">
                                {authdUser.email}
                              </div>
                            </div>
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href="/profile" passHref>
                                <button
                                  className={classnames(
                                    router.pathname.startsWith('/profile')
                                      ? 'bg-mirage-600'
                                      : 'hover:bg-mirage-500',
                                    active && 'ring-[3px] ring-inset ring-indigo-400',
                                    'block w-full text-left px-4 py-2 text-sm font-medium',
                                  )}
                                >
                                  profile
                                </button>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classnames(
                                  active && 'ring-[3px] ring-inset ring-indigo-400',
                                  'block w-full text-left px-4 py-2 text-sm font-medium',
                                )}
                                onClick={logout}
                              >
                                logout
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/auth" passHref>
                              <button
                                className={classnames(
                                  router.pathname.startsWith('/auth')
                                    ? 'bg-mirage-600'
                                    : 'hover:bg-mirage-500',
                                  active && 'ring-[3px] ring-inset ring-indigo-400',
                                  'block w-full text-left px-4 py-2 text-sm font-medium',
                                )}
                              >
                                authenticate
                              </button>
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
