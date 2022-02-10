import { KeyboardLink } from '@/components/KeyboardLink'

export const UserCardSmall = ({ user }) => (
  <KeyboardLink
    href={`/users/${user.id}`}
    className="flex flex-col items-start p-5 space-y-2 rounded-md shadow-sm outline-none cursor-pointer bg-mirage-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-indigo-400"
  >
    <>
      <div className="flex items-center">
        <img
          className="object-cover w-24 h-24 rounded-full shadow-md bg-mirage-400"
          src={user?.imageUrl || '/placeholder.svg'}
          alt={user?.name || 'placeholder image'}
        />
        <div className="block px-4">
          <div className="text-3xl font-bold truncate">{user.name}</div>
          <div className="text-xl font-semibold text-gray-400 truncate">{user.email}</div>
        </div>
      </div>
      <div className="px-2 pt-2 text-lg ">
        <p className="line-clamp-4">{user?.bio}</p>
      </div>
    </>
  </KeyboardLink>
)
