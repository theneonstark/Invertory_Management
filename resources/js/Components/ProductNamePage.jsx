import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { fetchCategories, addProductName, fetchProductNames, deleteProductName, editProductName } from '@/lib/Apis';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function ProductNamePage() {
  const methods = useForm({
    defaultValues: {
      product_category_name: '',
      category_id: '',
    },
  });
  const { control, handleSubmit, formState: { errors }, reset } = methods;
  const [categories, setCategories] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchCategoryData();
    fetchProductNameData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProductNameData = async () => {
    try {
      const response = await fetchProductNames();
      setProductNames(response || []);
    } catch (error) {
      console.error('Error fetching product names:', error);
      toast.error('Failed to load product names');
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = { 
        name: data.product_category_name.trim(), 
        category_id: parseInt(data.category_id) 
      };

      if (editingProduct) {
        await editProductName(editingProduct.id, payload);
        toast.success('Product Name Updated Successfully!');
      } else {
        await addProductName(payload);
        toast.success('Product Name Added Successfully!');
      }

      await fetchProductNameData(); // Refresh product list
      resetForm(); // Reset form and editing state
    } catch (error) {
      console.error('Error adding/updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to add/update product');
    }
  };

  const resetForm = () => {
    reset({
      product_category_name: '',
      category_id: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      product_category_name: product.name,
      category_id: String(product.category_id),
    });
  };

  const handleDelete = async (productNameId) => {
    try {
      const response = await deleteProductName(productNameId);
      if (response.message) {
        toast.success(`${response.message}`);
        await fetchProductNameData();
      } else {
        toast.error('Failed to delete product name');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="p-6 flex flex-col items-center w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Product Names</h1>
      
      <Card className="p-8 shadow-lg rounded-lg bg-white max-w-2xl w-full mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingProduct ? 'Edit Product Name' : 'Add Product Name with Category'}
        </h3>
        <FormProvider {...methods}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="product_category_name"
              rules={{ 
                required: "Product name is required",
                minLength: { value: 2, message: "Product name must be at least 2 characters" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="p-4 border border-gray-300 rounded-md w-full" 
                      placeholder="Enter product name"
                    />
                  </FormControl>
                  <FormMessage>{errors.product_category_name?.message}</FormMessage>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="category_id"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select 
                          onValueChange={onChange} 
                          value={value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.category_id?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                {editingProduct ? 'Update Product Name' : 'Add Product Name'}
              </Button>
              {editingProduct && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </Card>

      <div className="w-full max-w-4xl">
        <Table className="w-full border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center font-semibold">ID</TableHead>
              <TableHead className="text-center font-semibold">Product Name</TableHead>
              <TableHead className="text-center font-semibold">Category</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productNames.length > 0 ? (
              productNames.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-100">
                  <TableCell className="text-center">{product.id}</TableCell>
                  <TableCell className="text-center">{product.name}</TableCell>
                  <TableCell className="text-center">
                    {categories.find((cat) => cat.id === product.category_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No product names available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ProductNamePage;