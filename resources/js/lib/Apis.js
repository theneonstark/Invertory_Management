import axios from 'axios';

export const storeUserRole = async  (name)=>{
    try {
        const response = await axios.post(`/roles/create`,{
            name : name
        }); 
        return response.data;
    } catch (error) {
        console.error('Error storing user role:', error);
        throw error;
    }
}



export const getUserRoles = async () => {
  try {
    const response = await axios.get(`/roles/list`);
    
    return response.data.roles;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};








export const addUsers = async (data) => {
  try {
    const response = await axios.post(`/users/register`, data);    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`/users/list`);    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.put(`/users/update/${id}`, data);    
    return response.data.user;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
export const deleteUser = async (id,) => {
  try {
    const response = await axios.delete(`/users/delete/${id}`);    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};








// Fetch all product names
export const fetchProductNames = async () => {
  try {
    const response = await axios.get(`/product-names`); // New endpoint to fetch product names
    return response.data.productNames; // Assuming the response contains 'productNames' array
  } catch (error) {
    console.error('Error fetching product names:', error);
    throw error;
  }
};

// Add product name with category
export const addProductName = async (payload) => {
  try {
    const response = await axios.post(`/product-names`, payload);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};
export const deleteProductName = async (id) => {
  try {
    const response = await axios.delete(`/product-names/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};
export const editProductName = async (id, data) => {
  try {
    const response = await axios.put(`/product-names/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};


export const fetchProducts = async () => {
    try {
      const response = await axios.get(`/products`);
      return response.data.products; // Ensure this matches the Laravel API response
      
    } catch (error) {
      console.error('Error fetching products', error);
      throw error;
    }
  };
  
export const deleteProducts = async (id) => {
    try {
      const response = await axios.delete(`/products/delete/${id}`);
      return response
      
    } catch (error) {
      console.error('Error fetching products', error);
      throw error;
    }
  };

export const updateProducts = async (id, data) => {
    try {
      const response = await axios.put(`/products/update/${id}`, data);
      return response.data.product
      
    } catch (error) {
      console.error('Error fetching products', error);
      throw error;
    }
  };
  






export const fetchCategories = async () => {
  try {
    const response = await axios.get(`/categories`);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


export const addCategory = async (data) => {
  try {
    const response = await axios.post('/categories', data);
    return response.data;
  } catch (error) {
    throw error;
  }

}

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};  


export const updateCategory = async (id, data) => {
  try {
    console.log(data);
    
    const response = await axios.put(`/categories/${id}`, data);
    // console.log(response);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};  








// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`/orders/list`);
     console.log(response.data.userorders );
     
    return response.data.userorders    ; // Ensure this matches the Laravel API response
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const UpdateOrders = async (id,data) => {
  try {
    const response = await axios.put(`/orders/update/${id}`, data);
     console.log(response.data.success );
     
    return response.data.success    ; // Ensure this matches the Laravel API response
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const getSalary = async () => {
  try{
    const res = await axios.get('/salary/salaryData');
    return res.data;
  }catch(err){
    console.error(err);
    throw err;
  }
}

export const addSalary = async (data) => {
  try{
    const res = await axios.post('/salary/addSalary', data);
    return res;
  } catch (err){
    console.error('Not Salary Data', err);
    throw err;
  }
};



export const addShop = async (data) => {
  try {
    const response = await axios.post(`/shops`, data);
    return response
  } catch (error) {
    console.error('Not Store Shops Data', error);
    throw error;
  }
};


export const fetchShops = async () => {
  try {
    const response = await axios.get(`/shops`);
    return response.data
  } catch (error) {
    console.error('Not Store Shops Data', error);
    throw error;
  }
};

export const deleteShops = async (id) => {
  try {
    const response = await axios.delete(`/shops/${id}`);
    return response.data
  } catch (error) {
    console.error('Not Store Shops Data', error);
    throw error;
  }
};
export const editShops = async (id, data) => {
  try {
    const response = await axios.put(`/shops/${id}`, data);
    return response.data
  } catch (error) {
    console.error('Not Store Shops Data', error);
    throw error;
  }
};

export const fetchSupportRequests = async () => {
  try {
    const response = await axios.get(`/support/support-requests`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch support requests: " + (error.response?.data?.message || error.message));
  }
};

// Update support request status
export const updateSupportRequestStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `/support/support-requests/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to update status: " + (error.response?.data?.message || error.message));
  }
};

export const Expenses = async () => {
  try {
    const response = await axios.get(`/expenses`);
    return response;
  } catch (error) {
    throw new Error("Failed to fetch espenses: " + (error.response?.data?.message || error.message));
  }
};