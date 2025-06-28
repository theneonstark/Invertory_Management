import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { deleteCategory, fetchCategories, addCategory, updateCategory } from '@/lib/Apis';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoryPage() {
  const methods = useForm({
    defaultValues: {
      name: '',
    },
  });
  const { control, handleSubmit, formState: { errors }, reset } = methods;
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
    });
    setImagePreview(category.imageUrl || null); // Assuming imageUrl is available
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.message) {
        toast.success(`${response.message}`);
        await fetchData();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      if (image) {
        formData.append('image', image);
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, formData); // Assuming updateCategory accepts FormData
        toast.success('Category updated successfully!');
      } else {
        await addCategory(formData);
        toast.success('Category added successfully!');
      }

      resetForm(); // Reset form and state
      await fetchData();
    } catch (error) {
      console.error('Error adding/updating category:', error);
      toast.error(error.response?.data?.message || error.response?.data?.errors?.name || 'Failed to add/update category');
    }
  };

  const resetForm = () => {
    reset({
      name: '',
    });
    setImage(null);
    setImagePreview(null);
    setEditingCategory(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="p-6 flex flex-col items-center w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <Card className="p-8 shadow-lg rounded-lg bg-white max-w-2xl w-full mb-8">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h3>
        <FormProvider {...methods}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              rules={{ 
                required: 'Category Name is required',
                minLength: { value: 2, message: 'Category name must be at least 2 characters' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="p-4 border border-gray-300 rounded-md w-full" 
                      placeholder="Enter category name" 
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Category Image (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="p-2 border border-gray-300 rounded-md w-full" 
                    />
                  </FormControl>
                  {imagePreview && (
                    <div className="mt-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-w-xs h-auto rounded-md shadow-sm" 
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
              {editingCategory && (
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
              <TableHead className="text-center font-semibold">Name</TableHead>
              <TableHead className="text-center font-semibold">Image</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-100">
                  <TableCell className="text-center">{category.id}</TableCell>
                  <TableCell className="text-center">{category.name}</TableCell>
                  <TableCell className="text-center">
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="w-12 h-12 object-cover rounded-md mx-auto" 
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(category)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(category.id)}
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
                  No categories available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CategoryPage;