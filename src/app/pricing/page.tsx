"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PricingIcon } from "@/components/icons/pricing-icon";
import { Service } from "@/app/config/services";
import dynamic from 'next/dynamic';

const FontAwesomeIcon = dynamic(
  () => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon),
  { ssr: false }
);

import {
  faPlus, faSearch, faEdit, faTrash, faTimes,
  faCircleCheck, faCircleXmark, faSave
} from "@fortawesome/free-solid-svg-icons";

export default function PricingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmBox, setConfirmBox] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<{ name: string; carPrice: string; motorcyclePrice: string } | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const addRowRefs = useRef<HTMLTableRowElement[]>([]);

  useEffect(() => {
    // ✅ ดึงข้อมูลจาก Google Sheets ผ่าน Apps Script
    const fetchServices = async () => {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec");
        const data = await res.json();
        const normalized = data.map((item: any) => ({
          name: item.name ?? '',
          carPrice: item.carPrice ?? '',
          motorcyclePrice: item.motorcyclePrice ?? ''
        }));
        setServices(normalized);
      } catch (error) {
        showToast("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (addRowRefs.current.length > 0 && editIndex === null) {
      const last = addRowRefs.current[addRowRefs.current.length - 1];
      last?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [services, editIndex]);

  const filteredServices = searchOpen
    ? services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditRow(services[index]);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditIndex(null);
    setEditRow({ name: "", carPrice: "", motorcyclePrice: "" });
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setConfirmBox({
      message: "คุณต้องการลบรายการนี้หรือไม่?",
      onConfirm: () => {
        const updated = [...services];
        updated.splice(index, 1);
        setServices(updated);
        showToast("ลบรายการแล้ว");
        setConfirmBox(null);
      }
    });
  };

  const handleSave = () => {
    if (!editRow) return;
    setConfirmBox({
      message: "คุณต้องการบันทึกรายการนี้หรือไม่?",
      onConfirm: () => {
        const updated = [...services];
        if (editIndex !== null) {
          updated[editIndex] = editRow;
        } else {
          updated.push(editRow as Service);
        }
        setServices(updated);
        setModalOpen(false);
        setEditIndex(null);
        setEditRow(null);
        showToast("บันทึกข้อมูลเรียบร้อยแล้ว");
        setConfirmBox(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[999] animate-fade-in">
          <FontAwesomeIcon icon={faCircleCheck} className="mr-2" title="แจ้งเตือน" /> {toast}
        </div>
      )}

      {/* Confirm Box */}
      {confirmBox && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl z-10 w-80 text-center animate-scale-in">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{confirmBox.message}</p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmBox.onConfirm} className="flex items-center bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                <FontAwesomeIcon icon={faCircleCheck} className="mr-2" title="ยืนยัน" /> ตกลง
              </button>
              <button onClick={() => setConfirmBox(null)} className="flex items-center bg-red-500 dark:bg-red-400 hover:bg-red-600 dark:hover:bg-red-500 text-white px-4 py-2 rounded-lg transition">
                <FontAwesomeIcon icon={faCircleXmark} className="mr-2" title="ยกเลิก" /> ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <PricingIcon className="w-6 h-6 mr-2" />
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">ราคางาน</h1>
        </div>

        {/* Search & Add */}
        <div className="flex justify-end mb-4 space-x-2">
          {searchOpen && (
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหา..."
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm rounded px-3 py-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          )}
          <button onClick={() => setSearchOpen(o => !o)} className="relative group p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-700 dark:text-white" title="ค้นหา">
            <FontAwesomeIcon icon={faSearch} />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 pointer-events-none transition">ค้นหา</span>
          </button>
          <button onClick={handleAdd} className="relative group p-2 rounded bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition" title="เพิ่มรายการ">
            <FontAwesomeIcon icon={faPlus} />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 pointer-events-none transition">เพิ่มรายการ</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-auto max-h-[650px]">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-300 mt-10 animate-pulse">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              กำลังโหลดข้อมูล...
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">บริการ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รถยนต์ (บาท)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รถจักรยานยนต์ (บาท)</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.map((service, idx) => (
                <tr key={idx} ref={el => addRowRefs.current[idx] = el!} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{service.carPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{service.motorcyclePrice}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(idx)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300" title="แก้ไข">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(idx)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300" title="ลบ">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Modal Add/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md z-10 animate-scale-in">
              <button onClick={() => { setModalOpen(false); setEditIndex(null); }} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition" title="ปิด">
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{editIndex !== null ? 'แก้ไขบริการ' : 'เพิ่มรายการใหม่'}</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อบริการ"
                  value={editRow?.name ?? ''}
                  onChange={e => setEditRow(r => ({ ...r!, name: e.target.value }))}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="ราคารถยนต์"
                  value={editRow?.carPrice ?? ''}
                  onChange={e => setEditRow(r => ({ ...r!, carPrice: e.target.value }))}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="ราคารถจักรยานยนต์"
                  value={editRow?.motorcyclePrice ?? ''}
                  onChange={e => setEditRow(r => ({ ...r!, motorcyclePrice: e.target.value }))}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mt-4 text-right">
                <button onClick={handleSave} className="flex items-center bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded">
                  <FontAwesomeIcon icon={faSave} className="mr-2" title="บันทึก" /> บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

// Animation utilities (global CSS or Tailwind plugin):
// .animate-fade-in { animation: fadeIn 0.3s ease-out both; }
// .animate-scale-in { animation: scaleIn 0.25s ease-out both; }
// @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
// @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
