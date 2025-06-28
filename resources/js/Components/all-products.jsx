import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteProducts, fetchProducts } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Link } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AllProducts({ setActiveSection, setproductData }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAction = (action, product) => {
    if (action === "delete") {
      setSelectedProduct(product);
      setIsDialogOpen(true);
    } else if (action === "edit") {
      window.location.href = `product/${product.id}`;
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProducts(selectedProduct.id);
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== selectedProduct.id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
      toast.error("Failed to delete product.");
    } finally {
      setIsDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  // Filter products based on category, stock status, and search query
  const filteredProducts = () => {
    let filtered = [...products];

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Stock status filter
    if (stockFilter !== "All") {
      filtered = filtered.filter((product) =>
        stockFilter === "In Stock" ? product.stock_quantity > 0 : product.stock_quantity === 0
      );
    }

    // Search filter (productName, companyName, or shop_name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(query) ||
        (product.companyName && product.companyName.toLowerCase().includes(query)) ||
        (product.shop_name && product.shop_name.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  // Extract unique categories for the filter
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <CubeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
          Product Inventory
        </h2>
        {/* <Button
          onClick={() => setActiveSection("add-product")}
          className="mt-4 sm:mt-0 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-md transition-colors duration-200"
        >
          Add New Product
        </Button> */}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Search</label>
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or branch..."
              className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Stock Status</label>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full sm:w-[200px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectItem value="All" className="text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600">All</SelectItem>
              <SelectItem value="In Stock" className="text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600">In Stock</SelectItem>
              <SelectItem value="Out of Stock" className="text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Table */}
      <Card className="w-full shadow-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>Error loading products: {error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-200">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Price</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Paid Amount</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Pending Amount</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Stock</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Source</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts().length > 0 ? (
                  filteredProducts().map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <TableCell className="text-gray-600 dark:text-gray-400">{product.category}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-100">₹{product.price}</TableCell>
                      <TableCell className="text-green-400 font-bold dark:text-gray-100">₹{product.paid_amount}</TableCell>
                      <TableCell className="text-red-400 font-bold dark:text-gray-100">₹{product.pending_amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs font-medium",
                            product.stock_quantity > 0
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          )}
                        >
                          {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {product?.companyName ? `Vendor: ${product.companyName}` : `Vendor: ${product?.shop_name || "N/A"}`}
                      </TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => handleAction(value, product)}>
                          <SelectTrigger className="w-[120px] sm:w-[140px] rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                            <SelectItem value="edit" className="text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600">Edit</SelectItem>
                            <SelectItem value="delete" className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600">Delete</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center text-gray-500 dark:text-gray-400 py-6">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete <span className="font-medium">{selectedProduct?.productName}</span>?</p>
          <DialogFooter className="mt-4">
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700 rounded-md shadow-md transition-colors duration-200">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}