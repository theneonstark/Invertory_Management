import React, { useEffect, useState } from "react";
import { AddProductForm } from "./Forms/add-product-form";
import { fetchProducts, fetchShops, updateProducts } from "@/lib/Apis";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function AddProductPage({ id }) {
  const [productData, setProductData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsName, setProductsName] = useState([]);
  const [shops, setShops] = useState([]);

  // Fetch product by ID for editing
  useEffect(() => {
    const getProduct = async () => {
      if (!id) return;
      try {
        const product = await updateProducts(id); // Assuming this fetches a single product
        setProductData(product);
      } catch (err) {
        console.error("Error fetching product by ID:", err);
        setError(err.message);
      }
    };
    getProduct();
  }, [id]);

  // Fetch all products and sort by latest first
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        // Sort products by created_at or updated_at (descending order for latest first)
        const sortedProducts = productsData
          .sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at);
            const dateB = new Date(b.updated_at || b.created_at);
            return dateB - dateA; // Latest first
          })
          .slice(0, 5); // Get top 5 latest products
        setProducts(sortedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  // Fetch shops
  useEffect(() => {
    const fetchAndSetShops = async () => {
      try {
        const shopsData = await fetchShops();
        setShops(shopsData || []);
      } catch (error) {
        console.error("Error fetching shops:", error);
        setError(error.message);
      }
    };
    fetchAndSetShops();
  }, []);

  return (
    <div className="md:p-6 space-y-6">
      {/* Left Side - Forms */}
      <AddProductForm 
        productData={productData} 
        productsName={productsName} 
        shops={shops} // Pass shops data to the form if needed
      />

      {/* Right Side - Table */}
      <Card className="shadow-lg rounded-xl bg-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Recently Added Products</h2>

          {error ? (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <AlertDescription>Error loading products: {error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="text-left text-gray-600">ID</TableHead>
                    <TableHead className="text-left text-gray-600">Category</TableHead>
                    <TableHead className="text-left text-gray-600">Price</TableHead>
                    <TableHead className="text-left text-gray-600">Paid Amount</TableHead>
                    <TableHead className="text-left text-gray-600">Pending Amount</TableHead>
                    <TableHead className="text-left text-gray-600">Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 border-t">
                        <TableCell className="py-4">{product.id}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-mono">{product.price}</TableCell>
                        <TableCell className="font-medium text-green-400">{product.paid_amount}</TableCell>
                        <TableCell className="font-medium text-red-400">{product.pending_amount}</TableCell>
                        <TableCell>
                          {new Date(product.updated_at || product.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="h-24 text-center text-gray-500">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}