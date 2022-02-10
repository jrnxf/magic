import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

type Props = {
  href: string
  children: JSX.Element | string
  fullWidth?: boolean
  [x: string]: any
}
export const KeyboardLink: FC<Props> = ({ href, children, className, ...rest }) => {
  const router = useRouter()
  return (
    <Link href={href} passHref {...rest}>
      <span role="link" className={className} tabIndex={0} onKeyPress={() => router.push(href)}>
        {children}
      </span>
    </Link>
  )
}
