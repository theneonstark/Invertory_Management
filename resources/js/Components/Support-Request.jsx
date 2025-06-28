"use client";

import { useState, useEffect } from "react";
import { fetchSupportRequests, updateSupportRequestStatus } from "@/lib/Apis";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SupportRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const data = await fetchSupportRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updatedRequest = await updateSupportRequestStatus(id, newStatus);
      setRequests(requests.map((req) =>
        req.id === id ? { ...req, status: updatedRequest.status } : req
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Support Requests</h1>

      {/* Responsive table wrapper */}
      <div className="w-full overflow-x-auto rounded-lg border shadow-sm">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left py-3 px-4">Name</TableHead>
              <TableHead className="text-left py-3 px-4 hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-left py-3 px-4 hidden md:table-cell">Subject</TableHead>
              <TableHead className="text-left py-3 px-4">Description</TableHead>
              <TableHead className="text-left py-3 px-4 hidden lg:table-cell">Priority</TableHead>
              <TableHead className="text-left py-3 px-4">Status</TableHead>
              <TableHead className="text-left py-3 px-4 hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-left py-3 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell className="py-3 px-4 font-medium align-middle">{request.name}</TableCell>
                <TableCell className="py-3 px-4 hidden sm:table-cell align-middle">{request.email}</TableCell>
                <TableCell className="py-3 px-4 hidden md:table-cell align-middle">{request.subject}</TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900 p-0 h-auto"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedRequest && selectedRequest.id === request.id && (
                      <DialogContent className="sm:max-w-md w-full">
                        <DialogHeader>
                          <DialogTitle>{request.subject}</DialogTitle>
                          <DialogDescription>
                            Support request details for {request.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Description</p>
                            <p className="text-sm text-gray-900 w-fit flex">{request.message}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-sm text-gray-900">{request.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Priority</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                request.priority === "high" && "bg-red-100 text-red-800 border-red-200",
                                request.priority === "medium" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                                request.priority === "low" && "bg-green-100 text-green-800 border-green-200"
                              )}
                            >
                              {request.priority}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Created</p>
                            <p className="text-sm text-gray-900">
                              {new Date(request.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
                <TableCell className="py-3 px-4 hidden lg:table-cell align-middle">
                  <Badge
                    variant="outline"
                    className={cn(
                      request.priority === "high" && "bg-red-100 text-red-800 border-red-200",
                      request.priority === "medium" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                      request.priority === "low" && "bg-green-100 text-green-800 border-green-200"
                    )}
                  >
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <Select
                    value={request.status}
                    onValueChange={(value) => handleStatusUpdate(request.id, value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-[120px] sm:w-[140px]",
                        request.status === "pending" && "border-yellow-500 text-yellow-700",
                        request.status === "in_progress" && "border-blue-500 text-blue-700",
                        request.status === "resolved" && "border-green-500 text-green-700"
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="py-3 px-4 hidden xl:table-cell align-middle">
                  {new Date(request.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(request.message)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}