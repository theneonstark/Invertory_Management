import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Inertia } from "@inertiajs/inertia";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/login", {
        email: data.email,
        password: data.password,
      });

      console.log("Login successful:", response);
      if (response.data.redirect) {
        Inertia.visit(response.data.redirect);
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-2xl rounded-xl border border-gray-200 bg-white">
        <CardHeader className="text-center p-8 border-b border-gray-200">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Login to Aryan Event Admin
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}