import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='w-52'>
      Sidebar
      <nav className='flex flex-col gap-5'>
        <Link href='/community'>FYP</Link>
        <Link href='/explore'>Explore</Link>
        <Link href='/all-users'>People</Link>
        <Link href='/saved'>Saved</Link>
        <Link href='/create-post'>Create Post</Link>
        <Link href='/messages'>Messages</Link>
      </nav>
    </div>
  )
}

export default Sidebar
