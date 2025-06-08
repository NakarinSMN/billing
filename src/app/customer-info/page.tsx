'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CustomerIcon } from '@/components/icons/customer-icon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faCalendarDay,
  faCalendarAlt,
  faCalendar,
  faCar,
  faUser,
  faPhone,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

const statusColor = {
  'ต่อภาษีแล้ว': 'bg-green-600 dark:bg-green-700 text-white',
  'ใกล้ครบกำหนด': 'bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white',
  'เกินกำหนด': 'bg-red-600 dark:bg-red-700 text-white',
  'รอดำเนินการ': 'bg-blue-600 dark:bg-blue-700 text-white',
}

const statusIcon = {
  'ต่อภาษีแล้ว': faCheckCircle,
  'ใกล้ครบกำหนด': faExclamationTriangle,
  'เกินกำหนด': faTimesCircle,
  'รอดำเนินการ': faClock,
}

export default function CustomerInfoPage() {
  const [search, setSearch] = useState('')
  const [filterDay, setFilterDay] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://script.google.com/macros/s/AKfycbxN9rG3NhDyhlXVKgNndNcJ6kHopPaf5GRma_dRYjtP64svMYUFCSALwTEX4mYCHoDd6g/exec?getAll=1`
        )
        const json = await res.json()
        console.log('📦 ได้ข้อมูลจาก Google Sheet:', json)

        const formatted = (json.data || []).map(item => {
          // ดึงฟิลด์เวลาที่ลงทะเบียน
          const dtField = item['เวลาที่ลงทะเบียน'] || ''
          const rawDate = dtField.includes('T') ? dtField.split('T')[0] : dtField
          return {
            licensePlate: item['ทะเบียนรถ'] || '',
            customerName: item['ชื่อลูกค้า'] || '',
            phone: item['เบอร์ติดต่อ'] || '',
            registerDate: rawDate,
            status: item['สถานะ'] || item['สถานะการเตือน'] || 'รอดำเนินการ',
          }
        })
        console.log('🗃 Formatted data:', formatted)
        setData(formatted)
      } catch (err) {
        console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err)
      }
    }
    fetchData()
  }, [])

  const resetFilters = () => {
    setSearch('')
    setFilterDay('')
    setFilterMonth('')
    setFilterYear('')
  }

  const filteredData = data
    .filter(item => !!item.registerDate)
    .filter(item => {
      const [year, monthRaw, dayRaw] = item.registerDate.split('-')
      const day = String(Number(dayRaw)).padStart(2, '0')
      const monthMap = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ]
      const month = monthMap[Number(monthRaw) - 1] || ''
      const matchSearch =
        item.licensePlate.includes(search) || item.customerName.includes(search)
      const matchDay = !filterDay || day === filterDay.padStart(2, '0')
      const matchMonth = !filterMonth || month === filterMonth
      const matchYear = !filterYear || year === filterYear
      return matchSearch && matchDay && matchMonth && matchYear
    })

  useEffect(() => {
    console.log('📊 Filtered data:', filteredData)
  }, [filteredData])

  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ]
  const years = ['2024', '2025', '2026']

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-white dark:bg-neutral-900 page-transition">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <CustomerIcon className="w-6 h-6 mr-2" />
          <h1 className="text-center text-2xl font-bold text-neutral-800 dark:text-white">
            ข้อมูลลูกค้า
          </h1>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mb-6" />

        <div className="bg-white dark:bg-neutral-800 rounded-md p-6 shadow-sm">
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm"
              />
              <input
                type="text"
                placeholder="ค้นหาทะเบียนรถ / ชื่อลูกค้า"
                className="w-full pl-10 px-4 py-2 rounded-lg bg-neutral-700 text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faCalendarDay}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs"
              />
              <select
                className="pl-6 pr-2 py-2 rounded-lg bg-neutral-700 text-white"
                value={filterDay}
                onChange={e => setFilterDay(e.target.value)}
              >
                <option value="">วัน</option>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs"
              />
              <select
                className="pl-6 pr-2 py-2 rounded-lg bg-neutral-700 text-white"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
              >
                <option value="">เดือน</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faCalendar}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs"
              />
              <select
                className="pl-6 pr-2 py-2 rounded-lg bg-neutral-700 text-white"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="">ปี</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
            >
              ล้างตัวกรอง
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-900 dark:text-gray-100">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="py-2"><FontAwesomeIcon icon={faCar} className="mr-2" />ทะเบียนรถ</th>
                  <th className="py-2"><FontAwesomeIcon icon={faCalendarDay} className="mr-2" />วันที่</th>
                  <th className="py-2"><FontAwesomeIcon icon={faUser} className="mr-2" />ลูกค้า</th>
                  <th className="py-2"><FontAwesomeIcon icon={faPhone} className="mr-2" />เบอร์โทร</th>
                  <th className="py-2"><FontAwesomeIcon icon={faClock} className="mr-2" />สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="py-2">{item.licensePlate}</td>
                    <td className="py-2">{item.registerDate}</td>
                    <td className="py-2">{item.customerName}</td>
                    <td className="py-2">{item.phone}</td>
                    <td className="py-2"><span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.status]}`}><FontAwesomeIcon icon={statusIcon[item.status]} /> {item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}
