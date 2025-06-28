import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Button } from '../ui/button'; // Adjust path
import { Input } from '../ui/input'; // Adjust path
import { Card } from '../ui/card'; // Adjust path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/Components/ui/select';
import { fetchCategories, addProductName, fetchProductNames } from '@/lib/Apis'; // Import the API functions
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function AddProductName({ categories, onSuccess}) {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.product_category_name,
        category_id: data.category_id, // Send category_id
      };

      await addProductName(payload); // Use addProductName from api.js
      toast.success('Product Name Added Successfully!');
      onSuccess()
      reset(); // Reset form
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };


  return (
    <div className="p-6 md:p-8 w-full mx-auto max-w-2xl">
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add Product Name with Category</h3>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Product Name */}
            <FormField
              control={control}
              name="product_category_name"
              rules={{ required: "Product name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter product name"
                    />
                  </FormControl>
                  <FormMessage>{errors.product_category_name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Category Selection */}
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
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
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

            <Button
              type="submit"
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Add Product Name
            </Button>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

export default AddProductName;
