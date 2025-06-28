import AddProductPage from '@/Components/AddProduct'
import Layout from '@/Components/Layout/Layout'
import React from 'react'

function AddProduct({id}) {
  
  return (
    <Layout>
      <AddProductPage id={id}/>
    </Layout>
  )
}

export default AddProduct
