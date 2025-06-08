'use client'

import Link from 'next/link'
import { CustomerIcon } from '@/components/icons/customer-icon'

const mockData = [
  {
    licensePlate: 'ฎอ-5100 กทม',
    date: '8 มิ.ย. 2025',
    customer: 'สมชาย แสนดี',
    service: 'ลงทะเบียนรถ',
    status: 'ต่อภาษีแล้ว',
  },
  {
    licensePlate: 'กข-2345 ชลบุรี',
    date: '8 มิ.ย. 2025',
    customer: 'สมหญิง มีสุข',
    service: 'ลงทะเบียนรถ',
    status: 'ใกล้ครบกำหนด',
  },
  {
    licensePlate: 'ขย-9999 ลพบุรี',
    date: '7 มิ.ย. 2025',
    customer: 'ประสิทธิ์ รักดี',
    service: 'ลงทะเบียนรถ',
    status: 'เกินกำหนด',
  },
]

const filteredData = mockData.filter(item => {
  const [day, monthText, year] = item.date.split(' ') // "8 มิ.ย. 2025"

  const matchSearch = item.licensePlate.includes(search) || item.customer.includes(search)
  const matchDay = !filterDay || day === filterDay
  const matchMonth = !filterMonth || monthText === filterMonth
  const matchYear = !filterYear || year === filterYear

  return matchSearch && matchDay && matchMonth && matchYear
})


const statusColor = {
  'ต่อภาษีแล้ว': 'bg-green-700 text-white',
  'ใกล้ครบกำหนด': 'bg-yellow-600 text-white',
  'เกินกำหนด': 'bg-red-700 text-white',
  'รอดำเนินการ': 'bg-blue-700 text-white',
}

export default function CustomerInfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 page-transition">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <CustomerIcon className="w-6 h-6 mr-2" />
          <h1 className="text-center text-2xl font-bold">ข้อมูลลูกค้า</h1>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mb-6" />

        <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-800 dark:text-gray-100">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="py-2">ทะเบียนรถ</th>
                  <th className="py-2">วันที่</th>
                  <th className="py-2">ลูกค้า</th>
                  <th className="py-2">บริการ</th>
                  <th className="py-2">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="py-2">{item.licensePlate}</td>
                    <td className="py-2">{item.date}</td>
                    <td className="py-2">{item.customer}</td>
                    <td className="py-2">{item.service}</td>
                    <td className="py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}
