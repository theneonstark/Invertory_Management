import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../ui/button'; // Adjust the path
import { Input } from '../ui/input'; // Adjust the path
import { Card } from '../ui/card'; // Adjust the path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';
import { addCategory } from '@/lib/Apis'; // Import API utility
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCategoryForm({ onSuccess }) {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      formData.append('name', data.name);
      if (image) {
        formData.append('image', image);
      }

      await addCategory(formData);
      toast.success('Category added successfully!');
      reset({
        name: '',
      })
      setImage(null);
      setImagePreview(null);
      onSuccess(); // Trigger refetch of categories
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      toast.error(`${error.response?.data.errors.name}`);
    }
  };

  return (
    <div className="max-w-2xl p-6 md:p-8 w-full mx-auto">
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Category</h3>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              rules={{ required: 'Category Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="p-4 border border-gray-300 rounded-md shadow-sm w-full" placeholder="Enter category name" />
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
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border border-gray-300 rounded-md shadow-sm w-full" />
                  </FormControl>
                  {image && <p className="text-sm text-gray-500 mt-2">Selected Image: {image.name}</p>}
                </FormItem>
              )}
            />
            {imagePreview && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Image Preview:</h4>
                <img src={imagePreview} alt="Category Preview" className="mt-2 w-full max-w-sm rounded-md" />
              </div>
            )}
            <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition">
              Add Category
            </Button>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

export default AddCategoryForm;