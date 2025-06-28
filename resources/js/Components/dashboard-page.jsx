"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { DashboardContent } from "./dashboard-content";
import { Expenses, fetchOrders, fetchProducts, fetchUsers } from "@/lib/Apis";
import axios from "axios";

export function DashboardPage({userorders}) {
  const [activeSection, setActiveSection] = useState("dashboard");
  // console.log(userorders);


  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/logged-in-user");
        setUser(response.data.user);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const [GetAllProducts, setAllProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setAllProducts(productsData);
      } catch (err) {
        setError(err.message);
      }
    };
    getProducts();
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const [AllUserData, setAllUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setAllUsers(usersData.users);
      } catch (err) {
        setError(err.message);
      }
    };
    getUsers();
  }, []);

  const [ExpensesData, setAExpenses] = useState([]);
  useEffect(() => {
    const expense = async () => {
      try {
        const response = await Expenses();
        console.log(response.data.data);
        
        setAExpenses(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    expense();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="flex-1 flex">
        <aside className="fixed hidden h-full w-64 lg:block">
          <Sidebar setActiveSection={setActiveSection} user={user} />
        </aside>
        <main className="flex-1 lg:pl-64">
          <Navbar className="lg:pl-64" setActiveSection={setActiveSection} />
       <DashboardContent orders={orders} GetAllProducts={GetAllProducts} AllUsers={AllUserData} Expenses={ExpensesData} />        </main>
      </div>
    </div>
  );
}
