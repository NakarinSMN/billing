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
  'กำลังจะครบกำหนด': 'bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white',
  'ใกล้ครบกำหนด': 'bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white',
  'เกินกำหนด': 'bg-red-600 dark:bg-red-700 text-white',
  'รอดำเนินการ': 'bg-blue-600 dark:bg-blue-700 text-white',
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
          // ฟอร์แมตเบอร์โทรให้มี 0 นำหน้า
          const rawPhone = item['เบอร์ติดต่อ'] || ''
          const phone = rawPhone.startsWith('0') ? rawPhone : `0${rawPhone}`
          return {
            licensePlate: item['ทะเบียนรถ'] || '',
            customerName: item['ชื่อลูกค้า'] || '',
            phone,
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
                className="absolute left-2 top-1/2 transform -translate-y-
