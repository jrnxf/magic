import { AuthStates, COOKIES } from '@/lib/constants'
import { extractJwtClaims } from '@/lib/utils'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

type AuthContextProps = {
  authdUser: User | null
  authState: AuthStates
  sendMagicLink: (email: string) => Promise<void>
  updateAuthdUser: (user: any) => Promise<void>
  logout: () => Promise<void>
}
export const AuthContext = createContext<AuthContextProps>({
  authdUser: null,
  authState: AuthStates.UNSET,
  sendMagicLink: async (_: string) => {},
  updateAuthdUser: async (_: any) => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({
  initialUser,
  children,
}: {
  initialUser?: User
  children: JSX.Element | string
}) => {
  const router = useRouter()
  const [cookies] = useCookies()
  const [authdUser, setAuthdUser] = useState<any>(initialUser)
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.UNSET)

  const updateAuthdUser = async (updatedUser: User) => {
    const response = await axios.post('/api/profile/edit', updatedUser)
    setAuthdUser(response?.data || null)
  }

  const hydrateUser = useCallback(async (id) => {
    const response = await axios(`/api/user/${id}`)
    setAuthdUser(response?.data)
  }, [])

  const clientSideSilentRefresh = useCallback(async () => {
    if (!cookies?.[COOKIES.AUTH.ACCESS_TOKEN]) {
      try {
        const response = await axios.get('/api/auth/token/refresh')

        const { accessToken } = response?.data || {}
        if (accessToken) {
          const { user } = extractJwtClaims(accessToken) || {}
          if (user) {
            setAuthdUser(user)
            hydrateUser(user.id)
            setAuthState(AuthStates.AUTHENTICATED)
          }
        }
      } catch {
        setAuthState(AuthStates.UNAUTHENTICATED)
      }
    }
  }, [cookies, hydrateUser])

  useEffect(() => {
    const accessToken = cookies?.[COOKIES.AUTH.ACCESS_TOKEN]
    if (accessToken) {
      const user = extractJwtClaims(accessToken)?.user
      if (user) {
        setAuthdUser(user)
        hydrateUser(user.id)
        setAuthState(AuthStates.AUTHENTICATED)
      }
    } else {
      clientSideSilentRefresh()
    }
  }, [cookies, clientSideSilentRefresh, hydrateUser])

  const sendMagicLink = async (email: string) => {
    await axios.post(`/api/auth/send-magic-link`, {
      email,
    })
  }

  const logout = async () => {
    await axios.post('/api/auth/sign-out')

    setAuthdUser(null)
    setAuthState(AuthStates.UNAUTHENTICATED)
    router.push('/auth')
  }

  return (
    <AuthContext.Provider
      value={{
        authdUser,
        authState,
        updateAuthdUser,
        sendMagicLink,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
