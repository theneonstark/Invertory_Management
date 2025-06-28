import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Layout from './Layout/Layout';
import { deleteShops, fetchShops, addShop, editShops } from '@/lib/Apis';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';

function ShopPage() {
  const [shops, setShops] = useState([]);
  const [editingShop, setEditingShop] = useState(null);
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset, setValue } = methods;

  const fetchAndSetShops = async () => {
    try {
      const shopsData = await fetchShops();
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to fetch shops');
    }
  };

  useEffect(() => {
    fetchAndSetShops();
  }, []);

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setValue('name', shop.name);
    setValue('location', shop.address);
    setValue('contact_number', shop.contact_number);
    setValue('gstin_number', shop.gstin_number);
  };

  const handleDelete = async (shopId) => {
    try {
      const response = await deleteShops(shopId);
      if (response.message) {
        toast.success(`${response.message}`);
        fetchAndSetShops();
      } else {
        toast.error('Failed to delete shop');
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast.error('Failed to delete shop');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingShop) {
        await editShops(editingShop.id, data);
        toast.success('Shop updated successfully!');
      } else {
        await addShop(data);
        toast.success('Shop added successfully!');
      }
      setEditingShop(null);
      fetchAndSetShops();
      reset({
        name: '',
        location: '',
        contact_number: '',
        gstin_number: ''
      });
    } catch (error) {
      console.error('Error adding/editing shop:', error.response?.data || error.message);
      toast.error('Failed to add/edit shop');
    }
  };

  return (
    <Layout>
      <div className="p-6 flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-6">Vendors</h1>
        <div className="max-w-2xl p-6 md:p-8 w-full mx-auto">
          <Card className="p-8 shadow-lg rounded-lg bg-white">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">{editingShop ? 'Edit Vendor' : 'Add New Vendor'}</h3>
            <FormProvider {...methods}>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name="name"
                  rules={{ required: 'Shop Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Vendor name" />
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
                <FormField
                  control={control}
                  name="gstin_number"
                  // rules={{ pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter GSTIN number" />
                      </FormControl>
                      <FormMessage>{errors.gstin_number?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition">
                  {editingShop ? 'Update Vendor' : 'Add Vendor'}
                </Button>
              </form>
            </FormProvider>
          </Card>
        </div>

        <div className="mt-6 w-full flex justify-center">
          <div className="w-full max-w-4xl">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Vendor Name</TableHead>
                  <TableHead className="text-center">Contact</TableHead>
                  <TableHead className="text-center">GSTIN Number</TableHead>
                  <TableHead className="text-center">Address</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="text-center">{shop.id}</TableCell>
                    <TableCell className="text-center">{shop.name}</TableCell>
                    <TableCell className="text-center">{shop.contact_number}</TableCell>
                    <TableCell className="text-center">{shop.gstin_number}</TableCell>
                    <TableCell className="text-center">{shop.location}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex space-x-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(shop)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(shop.id)}>
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShopPage;
