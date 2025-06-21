import MonthlyReport from "@/components/analytics/MonthlyReport";
import YearlyReport from "@/components/analytics/YearlyReport";
import { DialogButton } from "@/components/dialogButton/DialogButton";
import TransactionTable from "@/components/transactionTable/TransactionTable";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  const { logout, user, hasHydrated, isInitializing } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [analyticYear, setAnalyticYear] = useState(currentYear);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // last 5 years

  if (!hasHydrated || isInitializing) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-600" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-600" />
          <Skeleton className="h-4 w-[200px] bg-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
        <div className="flex md:flex-row flex-col md:gap-0 gap-6 justify-between items-center">
          <h1 className="text-2xl font-bold">
            Welcome!{" "}
            <span className="text-yellow-500">
              {user ? user.fullName : "Dashboard"}
            </span>
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant={"outline"} className="bg-gray-800 ">
              <Link to={"/category"}>Category</Link>
            </Button>
            <DialogButton />
            <Button
              variant={"outline"}
              className="bg-red-800 "
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        <TransactionTable />

        <div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm">Select Month</label>
              <Select
                value={month.toString()}
                onValueChange={(val) => setMonth(Number(val))}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 text-white">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((name, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Select Year</label>
              <Select
                value={year.toString()}
                onValueChange={(val) => setYear(Number(val))}
              >
                <SelectTrigger className="w-[140px] bg-gray-800 text-white">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <MonthlyReport year={year} month={month} />
        </div>

        <div>
          <div className="">
            <label className="text-sm">Select Year</label>
            <Select
              value={analyticYear.toString()}
              onValueChange={(val) => setAnalyticYear(Number(val))}
            >
              <SelectTrigger className="w-[140px] bg-gray-800 text-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <YearlyReport year={analyticYear} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
