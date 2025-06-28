import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { addSalary, getSalary } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout/Layout";

export default function AddSalary({ setActiveSection, setUserData }) {
  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [salaryData, setSalaryData] = useState({
    userId: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    panNumber: "",
    accountNumber: "",
    branch: "",
    ifsc_code: "",
    bankName: "", // Added bankName to state
  });
  

  useEffect(() => {
    const getSalaries = async () => {
      try {
        const userSalary = await getSalary();
        setSalaries(userSalary.salary || []); // Ensure salary is an array
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getSalaries();
  }, []);

  const handleSalaryButtonClick = (salary) => {
    setSelectedUser(salary);
    setSalaryData((prev) => ({ ...prev, userId: salary.id }));
    setIsSalaryDialogOpen(true);
  };

  const handleSalaryInputChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    try {
      await addSalary(salaryData);
      toast.success("Salary details saved successfully!");
      setIsSalaryDialogOpen(false);
      setSalaryData({
        userId: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
        panNumber: "",
        accountNumber: "",
        branch: "",
        ifsc_code: "",
        bankName: "",
      });
      // Refresh salaries
      const userSalary = await getSalary();
      setSalaries(userSalary.salary || []);
    } catch (err) {
      toast.error("Failed to save salary details");
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 text-indigo-800">
            <CubeIcon className="h-8 w-8 text-indigo-600" /> Salary Data
          </h2>
        </div>
        <div className="flex items-center justify-between mb-4"></div>

        <Card className="w-full shadow-lg rounded-xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="p-6">
              {error ? (
                <Alert variant="destructive" className="mb-6 bg-red-100 border border-red-400">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">Error loading salaries: {error}</AlertDescription>
                </Alert>
              ) : isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-200" />
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-auto shadow-lg">
                  <Table className="w-full min-w-[600px] sm:w-full">
                    <TableHeader className="bg-indigo-100">
                      <TableRow>
                        <TableHead className="text-center text-indigo-800">ID</TableHead>
                        <TableHead className="text-center text-indigo-800">Name</TableHead>
                        <TableHead className="text-center text-indigo-800">Salary</TableHead>
                        <TableHead className="text-center text-indigo-800">Account</TableHead>
                        <TableHead className="text-center text-indigo-800">BanK</TableHead>
                        <TableHead className="text-center text-indigo-800">Payment At</TableHead>
                        <TableHead className="text-center text-indigo-800">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaries.length > 0 ? (
                        salaries.map((salary) => (
                          <TableRow key={salary.id} className="hover:bg-indigo-50 border-t">
                            <TableCell className="text-center py-4">{salary.id}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-indigo-600">
                                {salary.user_name || "N/A"} {/* Adjust based on actual field */}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{salary.amount || "N/A"}</TableCell>
                            <TableCell className="text-center font-mono text-gray-600">{salary.account_number || "N/A"}</TableCell>
                            <TableCell className="text-center text-sm text-gray-500">
                              {salary.bank_name || "N/A"}
                            </TableCell>
                            <TableCell className="text-center text-sm text-gray-500">
                              <Button className={salary.status !== false ? "bg-red-500" : "bg-green-500"}>{salary.status !== false ? "Pending" : "Paid"}</Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button onClick={() => handleSalaryButtonClick(salary)}>Salary Details</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="6" className="h-24 text-center text-gray-500">
                            <CubeIcon className="h-8 w-8 text-gray-400" />
                            No salaries found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-indigo-800">
                Add Salary for {selectedUser?.user_name || "User"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalarySubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="basicSalary" className="text-sm font-medium text-gray-700">
                      Basic Salary <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="basicSalary"
                      name="basicSalary"
                      type="number"
                      value={salaryData.basicSalary || selectedUser?.amount}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter basic salary"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="allowances" className="text-sm font-medium text-gray-700">
                      Allowances
                    </Label>
                    <Input
                      id="allowances"
                      name="allowances"
                      type="number"
                      value={salaryData.allowances || selectedUser?.allowance}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter allowances"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="deductions" className="text-sm font-medium text-gray-700">
                      Deductions
                    </Label>
                    <Input
                      id="deductions"
                      name="deductions"
                      type="number"
                      value={salaryData.deductions || selectedUser?.deduction}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter deductions"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">
                      PAN Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      type="text"
                      value={salaryData.panNumber || selectedUser?.panNumber}
                      onChange={handleSalaryInputChange}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                      Account Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      value={salaryData.accountNumber || selectedUser?.account_number}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter Account Number"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="ifsc_code" className="text-sm font-medium text-gray-700">
                      IFSC Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ifsc_code"
                      name="ifsc_code"
                      type="text"
                      value={salaryData.ifsc_code || selectedUser?.ifsc_code}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter IFSC"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                      Bank Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      type="text"
                      value={salaryData.bankName || selectedUser?.bank_name}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter Bank"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
                      Branch <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="branch"
                      name="branch"
                      type="text"
                      value={salaryData.branch || selectedUser?.branch}
                      onChange={handleSalaryInputChange}
                      placeholder="Enter Branch"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSalaryDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Salary
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}