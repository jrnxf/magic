import Link from 'next/link'
import { useAuth } from '@/context/auth.context'

export const UserCardLarge = ({ user }) => {
  const { authdUser } = useAuth()
  return (
    <div className="flex flex-col items-center p-6 space-y-3 rounded-md shadow-sm bg-mirage-500">
      <img
        className="object-cover w-32 h-32 rounded-full shadow-md bg-mirage-400"
        src={user?.imageUrl || '/placeholder.svg'}
        alt={user?.name || 'placeholder image'}
      />
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold truncate">{user?.name}</div>
        <div className="text-xl font-medium text-gray-400 truncate">{user?.email}</div>
      </div>
      <p className="text-lg">{user?.bio}</p>
      {authdUser?.id === user?.id && (
        <Link href="/profile/edit" passHref>
          <button className="btn-indigo">edit</button>
        </Link>
      )}
    </div>
  )
}
