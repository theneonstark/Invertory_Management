import AddUserForm from '@/Components/add-user-form'
import Layout from '@/Components/Layout/Layout'
import React from 'react'

function AddUser({id}) {
  return (
    <Layout>
      <AddUserForm id={id}/>
    </Layout>
  )
}

export default AddUser
