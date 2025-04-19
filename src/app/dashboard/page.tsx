"use client";

import Link from "next/link";
import { useState } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

// Dashboard components
const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        <span className={`text-xs inline-block mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change} จากเดือนที่แล้ว
        </span>
      </div>
      <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("week");

  // Generate mock data for the last 30 days
  const today = new Date();
  const last30Days = eachDayOfInterval({
    start: subDays(today, 29),
    end: today
  });

  const dailyData = last30Days.map((date) => {
    // Random data for demonstration
    const randomCarWash = Math.floor(Math.random() * 15) + 5;
    const randomMotorcycleWash = Math.floor(Math.random() * 10) + 3;
    const randomPolish = Math.floor(Math.random() * 5) + 1;

    return {
      date: format(date, "MM/dd"),
      fullDate: format(date, "dd MMM yyyy"),
      รถยนต์: randomCarWash,
      รถจักรยานยนต์: randomMotorcycleWash,
      เคลือบสี: randomPolish,
      รวม: randomCarWash + randomMotorcycleWash + randomPolish
    };
  });

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === "week") {
      return dailyData.slice(-7);
    } else if (timeRange === "2weeks") {
      return dailyData.slice(-14);
    } else {
      return dailyData;
    }
  };

  const filteredData = getFilteredData();

  // Service distribution data for pie chart
  const serviceDistribution = [
    { name: "ล้างรถ", value: 45, color: "#0088FE" },
    { name: "ดูดฝุ่น", value: 20, color: "#00C49F" },
    { name: "เคลือบสี", value: 15, color: "#FFBB28" },
    { name: "ขัดสี", value: 10, color: "#FF8042" },
    { name: "ล้างห้องเครื่อง", value: 5, color: "#8884d8" },
    { name: "อื่นๆ", value: 5, color: "#82ca9d" },
  ];

  // Revenue by service type
  const revenueByService = [
    { name: "ล้างรถ", รถยนต์: 15000, รถจักรยานยนต์: 6400 },
    { name: "ดูดฝุ่น", รถยนต์: 12000, รถจักรยานยนต์: 5000 },
    { name: "เคลือบสี", รถยนต์: 22500, รถจักรยานยนต์: 12000 },
    { name: "ขัดสี", รถยนต์: 25000, รถจักรยานยนต์: 6000 },
    { name: "ล้างห้องเครื่อง", รถยนต์: 10000, รถจักรยานยนต์: 3000 },
  ];

  // Monthly revenue trend
  const monthlyRevenue = [
    { name: "Jan", รายได้: 42000 },
    { name: "Feb", รายได้: 52000 },
    { name: "Mar", รายได้: 48000 },
    { name: "Apr", รายได้: 61000 },
    { name: "May", รายได้: 55000 },
    { name: "Jun", รายได้: 67000 },
    { name: "Jul", รายได้: 72000 },
    { name: "Aug", รายได้: 68000 },
    { name: "Sep", รายได้: 71000 },
    { name: "Oct", รายได้: 78000 },
    { name: "Nov", รายได้: 82000 },
    { name: "Dec", รายได้: 91000 },
  ];

  // Calculate totals for stat cards
  const totalServices = filteredData.reduce((sum, day) => sum + day.รวม, 0);
  const avgDailyServices = Math.round(totalServices / filteredData.length);

  // Mocked month-over-month changes
  const servicesChange = "+12.5%";
  const revenueChange = "+8.3%";
  const customersChange = "+15.2%";
  const avgServiceChange = "+5.7%";

  return (
    <div className="flex min-h-screen flex-col p-4 page-transition">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">แดชบอร์ด</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              ภาพรวมการให้บริการและรายได้
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-input bg-white dark:bg-gray-800 py-1 px-3 text-sm rounded-md border border-gray-300 dark:border-gray-700"
            >
              <option value="week">7 วันที่ผ่านมา</option>
              <option value="2weeks">14 วันที่ผ่านมา</option>
              <option value="month">30 วันที่ผ่านมา</option>
            </select>

            <Link
      href="/"
      className="bg-gray-100 dark:bg-gray-800 py-1 px-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center"
      aria-label="กลับ"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="w-4 h-4 fill-current text-gray-700 dark:text-gray-200"
        aria-hidden="true"
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
      </svg>
    </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="ยอดให้บริการทั้งหมด"
            value={totalServices.toString()}
            change={servicesChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
            }
          />
          <StatCard
            title="รายได้"
            value="฿75,890"
            change={revenueChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 dark:text-green-400">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
          />
          <StatCard
            title="ลูกค้า"
            value="125"
            change={customersChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 dark:text-purple-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
          <StatCard
            title="บริการเฉลี่ยต่อวัน"
            value={avgDailyServices.toString()}
            change={avgServiceChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 dark:text-amber-400">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                <path d="M12 16c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <path d="M12 12h8" />
                <path d="M12 6h4" />
                <path d="M12 18h4" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Service Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">แนวโน้มการให้บริการรายวัน</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => {
                      const dataPoint = filteredData.find(d => d.date === label);
                      return dataPoint ? dataPoint.fullDate : label;
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="รวม" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="รถยนต์" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="รถจักรยานยนต์" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">การกระจายประเภทบริการ</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ครั้ง`, 'จำนวนครั้ง']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Service Type */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">รายได้ตามประเภทบริการ</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByService}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`฿${value.toLocaleString()}`, 'รายได้']} />
                  <Legend />
                  <Bar dataKey="รถยนต์" fill="#0088FE" />
                  <Bar dataKey="รถจักรยานยนต์" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">แนวโน้มรายได้รายเดือน</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenue}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`฿${value.toLocaleString()}`, 'รายได้']} />
                  <Legend />
                  <Line type="monotone" dataKey="รายได้" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">การทำรายการล่าสุด</h3>
            <button className="text-blue-500 dark:text-blue-400 text-sm hover:underline">
              ดูทั้งหมด
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    เลขที่บิล
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    บริการ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    จำนวนเงิน
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { id: "INV-2023112", date: "17 เม.ย. 2025", customer: "สมชาย แสนดี", service: "ล้างรถ + ดูดฝุ่น", amount: "฿300", status: "เสร็จสิ้น", statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
                  { id: "INV-2023111", date: "17 เม.ย. 2025", customer: "สมหญิง มีสุข", service: "ล้างรถ", amount: "฿150", status: "เสร็จสิ้น", statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
                  { id: "INV-2023110", date: "16 เม.ย. 2025", customer: "ประสิทธิ์ รักดี", service: "เคลือบสี", amount: "฿1,500", status: "เสร็จสิ้น", statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
                  { id: "INV-2023109", date: "16 เม.ย. 2025", customer: "วิชัย สว่าง", service: "ขัดสี + ล้างรถ", amount: "฿2,650", status: "กำลังดำเนินการ", statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
                  { id: "INV-2023108", date: "15 เม.ย. 2025", customer: "รัตนา แสงทอง", service: "ล้างห้องเครื่อง", amount: "฿500", status: "รอดำเนินการ", statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
                ].map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${transaction.statusColor}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mb-8">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
