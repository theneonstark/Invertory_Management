import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../ui/button'; // Adjust the path
import { Input } from '../ui/input'; // Adjust the path
import { Card } from '../ui/card'; // Adjust the path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';
import { addShop } from '@/lib/Apis'; // Import API utility
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddShopForm({  onSuccess}) {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;

  // const fetchAndSetShops = async () => {
  //   try {
  //     const shopsData = await fetchShops();
  //     setShops(shopsData);
  //   } catch (error) {
  //     console.error('Error fetching shops:', error);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      // Add the shop
      await addShop(data);
      toast.success('Shop added successfully!');
      onSuccess()
      // Reset the form after adding the shop
      reset({
        name: '',
        location: '',
        owner_name: '',
        contact_number: ''
      });
  
      // Fetch and set shops again after adding
    //   fetchAndSetShops(); 
    } catch (error) {
      console.error('Error adding shop:', error.response?.data || error.message);
      toast.error('Failed to add shop');
    }
  };

  return (
    <div className="max-w-2xl p-6 md:p-8 w-full mx-auto">
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Shop</h3>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              rules={{ required: 'Shop Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter shop name" />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="location"
              rules={{ required: 'Location is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location" />
                  </FormControl>
                  <FormMessage>{errors.location?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="owner_name"
              rules={{ required: 'Owner Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter owner name" />
                  </FormControl>
                  <FormMessage>{errors.owner_name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contact_number"
              rules={{ required: 'Contact Number is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter contact number" />
                  </FormControl>
                  <FormMessage>{errors.contact_number?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition">
              Add Shop
            </Button>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

export default AddShopForm;
