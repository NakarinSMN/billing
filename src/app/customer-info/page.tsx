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
  faTimesCircle,
  faChevronLeft,
  faChevronRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

const statusColor = {
  'ต่อภาษีแล้ว': 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-white',
  'กำลังจะครบกำหนด': 'bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-black',
  'ใกล้ครบกำหนด': 'bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-black',
  'เกินกำหนด': 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-white',
  'รอดำเนินการ': 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-white',
}

const statusIcon = {
  'ต่อภาษีแล้ว': faCheckCircle,
  'กำลังจะครบกำหนด': faExclamationTriangle,
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
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbxN9rG3NhDyhlXVKgNndNcJ6kHopPaf5GRma_dRYjtP64svMYUFCSALwTEX4mYCHoDd6g/exec?getAll=1')
        const json = await res.json()
        const formatted = (json.data || []).map(item => {
          const dtField = item['วันที่ชำระภาษีล่าสุด'] || ''
          const registerDate = dtField.includes('T') ? dtField.split('T')[0] : dtField
          const rawPhone = (item['เบอร์ติดต่อ'] || '').toString()
          const phone = rawPhone.startsWith('0') ? rawPhone : `0${rawPhone}`
          return {
            licensePlate: item['ทะเบียนรถ'] || '',
            customerName: item['ชื่อลูกค้า'] || '',
            phone,
            registerDate,
            status: item['สถานะ'] || item['สถานะการเตือน'] || 'รอดำเนินการ',
          }
        })
        setData(formatted)
      } catch (err) {
        console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const resetFilters = () => {
    setSearch('')
    setFilterDay('')
    setFilterMonth('')
    setFilterYear('')
    setCurrentPage(1)
  }

  const filteredData = data
    .filter(item => !!item.registerDate)
    .filter(item => {
      const [year, monthRaw, dayRaw] = item.registerDate.split('-')
      const day = String(Number(dayRaw)).padStart(2, '0')
      const monthMap = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
      const month = monthMap[Number(monthRaw) - 1] || ''
      const matchSearch = item.licensePlate.includes(search) || item.customerName.includes(search)
      const matchDay = !filterDay || day === filterDay.padStart(2, '0')
      const matchMonth = !filterMonth || month === filterMonth
      const matchYear = !filterYear || year === filterYear
      return matchSearch && matchDay && matchMonth && matchYear
    })

  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const years = ['2024', '2025', '2026']

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gray-100 dark:bg-neutral-900 text-black dark:text-white transition-colors">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <CustomerIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
          <h1 className="text-2xl font-bold">ข้อมูลลูกค้า</h1>
        </div>
        <hr className="border-gray-300 dark:border-gray-700 mb-6" />

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                placeholder="ค้นหาทะเบียนรถ / ชื่อลูกค้า"
                className="w-full pl-10 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <SelectFilter value={filterDay} onChange={setFilterDay} icon={faCalendarDay} placeholder="วัน" options={days} />
            <SelectFilter value={filterMonth} onChange={setFilterMonth} icon={faCalendarAlt} placeholder="เดือน" options={months} />
            <SelectFilter value={filterYear} onChange={setFilterYear} icon={faCalendar} placeholder="ปี" options={years} />
            <div>
              <select
                className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-neutral-700 text-black dark:text-white focus:outline-none"
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[10,20,30,40,50].map(n => <option key={n} value={n}>{n} รายการ</option>)}
              </select>
            </div>
            <button onClick={resetFilters} className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition">ล้างตัวกรอง</button>
          </div>

          {/* Table or Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-700 dark:text-gray-200">
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4 text-blue-500 dark:text-blue-400" />
              <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      {['ทะเบียนรถ','วันที่','ลูกค้า','เบอร์โทร','สถานะ'].map((label, i) => (
                        <th key={i} className="py-2 font-medium">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-neutral-700">
                        <td className="py-2">{item.licensePlate}</td>
                        <td className="py-2">{item.registerDate}</td>
                        <td className="py-2">{item.customerName}</td>
                        <td className="py-2">{item.phone}</td>
                        <td className="py-2">
                          <span className={`${statusColor[item.status]} px-3 py-1 rounded-full text-xs font-semibold`}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6 gap-2">
                <PageButton onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} icon={faChevronLeft} />
                <span className="text-gray-700 dark:text-gray-200">{currentPage} / {totalPages||1}</span>
                <PageButton onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages} icon={faChevronRight} />
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
          <Link href="/" className="inline-flex items-center gap-2 hover:underline">
            <FontAwesomeIcon icon={faChevronLeft} /> กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}

function SelectFilter({ value, onChange, icon, placeholder, options }) {
  return (
    <div className="relative">
      <FontAwesomeIcon icon={icon} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-8 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-black dark:text-white focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

function PageButton({ onClick, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition"
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  )
}
