// import { ManageAccount } from '@/components/server/shared/ManageProfile';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Community = async() => {
  const currentUserData = await currentUser();
  return (
    <div>
      {/* <ManageAccount /> */}

    </div>
  )
}

export default Community
