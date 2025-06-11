// --- ไฟล์ 4: pages/pricing/index.tsx ---
// นี่คือโค้ดคอมโพเนนต์ React หลักสำหรับหน้า Pricing Page ของคุณ
// ควรอยู่ในโฟลเดอร์ 'pages/pricing/' ในโปรเจกต์ Next.js ของคุณ
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
  faCircleCheck, faCircleXmark, faSave, faSpinner
} from "@fortawesome/free-solid-svg-icons";

export default function PricingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmBox, setConfirmBox] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Service | null>(null); // ใช้ Service type
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const addRowRefs = useRef<HTMLTableRowElement[]>([]);
  
  // กำหนด Local Next.js API endpoint สำหรับ Proxy ของเรา
  const API_PROXY_URL = '/api/pricing-proxy';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // ใช้ API_PROXY_URL ใหม่สำหรับดึงข้อมูล (GET request)
        const res = await fetch(API_PROXY_URL, {
          method: "GET", 
          headers: { "Content-Type": "application/json" }
        });
  
        if (!res.ok) {
          throw new Error(`โหลดข้อมูลล้มเหลวด้วยสถานะ: ${res.status}`);
        }
  
        const data = await res.json();
        // แปลงข้อมูลให้อยู่ในรูปแบบ Service[] ที่คาดหวังจาก Google Apps Script
        // GAS คืนค่าเป็น Array ของ Object ที่มีคีย์เป็น "บริการ", "รถยนต์ (บาท)", "รถจักรยานยนต์ (บาท)"
        const normalized: Service[] = data.map((item: any) => ({
          name: item["บริการ"] ?? '',
          carPrice: item["รถยนต์ (บาท)"] ?? '',
          motorcyclePrice: item["รถจักรยานยนต์ (บาท)"] ?? ''
        }));
        setServices(normalized);
      } catch (err) {
        console.error("โหลดข้อมูลล้มเหลว", err);
        showToast("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, []); 
  

  useEffect(() => {
    // เลื่อนไปที่แถวที่เพิ่งเพิ่มเข้ามาใหม่ หรือแถวสุดท้ายเมื่อข้อมูลบริการมีการเปลี่ยนแปลง
    if (addRowRefs.current.length > 0 && editIndex === null) {
      const last = addRowRefs.current[addRowRefs.current.length - 1];
      last?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [services, editIndex]); 


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500); // Toast จะหายไปหลังจาก 2.5 วินาที
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditRow(services[index]); // กำหนดข้อมูลแถวที่จะแก้ไข
    setModalOpen(true); // เปิด Modal
  };

  const handleAdd = () => {
    setEditIndex(null); // ล้างค่า index การแก้ไขสำหรับการเพิ่มใหม่
    setEditRow({ name: "", carPrice: "", motorcyclePrice: "" }); // กำหนดแถวว่างสำหรับการเพิ่มใหม่
    setModalOpen(true); // เปิด Modal
  };

  const handleDelete = async (index: number) => {
    setConfirmBox({
      message: "คุณต้องการลบรายการนี้หรือไม่?",
      onConfirm: async () => {
        try {
          // ใช้ API_PROXY_URL ใหม่สำหรับการลบข้อมูล (POST request)
          const res = await fetch(API_PROXY_URL, {
            method: "POST", // ทุกการดำเนินการ (add, update, delete) ใช้ POST ไปยัง proxy
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "delete", index }) // ส่ง method และ index ไปยัง Google Apps Script
          });
          const result = await res.json();
          if (result.result === "success") {
            const updated = [...services];
            updated.splice(index, 1); // ลบรายการออกจาก state ในเครื่อง
            setServices(updated);
            showToast("ลบรายการสำเร็จ");
          } else {
            showToast("เกิดข้อผิดพลาดขณะลบข้อมูล");
          }
        } catch (err) {
          console.error("Error deleting data:", err);
          showToast("ลบข้อมูลไม่สำเร็จ");
        } finally {
          setConfirmBox(null); // ปิดกล่องยืนยัน
        }
      }
    });
  };

  const handleSave = async () => {
    if (!editRow) return; 

    // กำหนด payload ตามว่าเป็นคำขอเพิ่มข้อมูลหรืออัปเดตข้อมูล
    const payload = {
      method: editIndex === null ? "add" : "update",
      // สำหรับการอัปเดต ให้รวม index เพื่อระบุแถวใน Google Apps Script
      index: editIndex,
      name: editRow.name,
      carPrice: editRow.carPrice,
      motorcyclePrice: editRow.motorcyclePrice
    };

    try {
      // ใช้ API_PROXY_URL ใหม่สำหรับการบันทึกข้อมูล (POST request)
      const res = await fetch(API_PROXY_URL, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // ส่ง payload ไปยัง Google Apps Script
      });
      const result = await res.json();
      if (result.result === "success") {
        let updatedServices = [...services];
        if (editIndex === null) {
          // ถ้าเป็นการเพิ่มข้อมูล ให้เพิ่มแถวใหม่เข้าไปใน Array
          updatedServices.push(editRow);
        } else {
          // ถ้าเป็นการอัปเดต ให้แทนที่แถวที่มีอยู่
          updatedServices[editIndex] = editRow;
        }
        setServices(updatedServices); 
        showToast(editIndex === null ? "เพิ่มรายการใหม่สำเร็จ" : "แก้ไขข้อมูลเรียบร้อย");
      } else {
        showToast("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      showToast("บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setModalOpen(false); // ปิด Modal
      setEditIndex(null); // รีเซ็ต index การแก้ไข
      setEditRow(null); // ล้างข้อมูลแถวที่แก้ไข
    }
  };

  // กรองบริการตามคำค้นหาหากเปิดใช้งานการค้นหา
  const filteredServices = searchOpen
    ? services.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors font-sans antialiased text-gray-800 dark:text-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[999] animate-fade-in flex items-center">
          <FontAwesomeIcon icon={faCircleCheck} className="mr-2" /> {toast}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmBox && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmBox(null)} />
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center z-10 w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-medium mb-6">{confirmBox.message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmBox.onConfirm}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <FontAwesomeIcon icon={faCircleCheck} className="mr-2" /> ตกลง
              </button>
              <button
                onClick={() => setConfirmBox(null)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <FontAwesomeIcon icon={faCircleXmark} className="mr-2" /> ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 md:mb-8 text-gray-800 dark:text-white">
          <PricingIcon className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-center">ราคางาน</h1>
        </div>

        {/* Search & Add Section */}
        <div className="flex flex-col sm:flex-row justify-end items-center mb-6 space-y-3 sm:space-y-0 sm:space-x-3">
          {searchOpen && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาบริการ..."
              className="w-full sm:w-auto flex-grow border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              title="ค้นหา"
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
            <button
              onClick={handleAdd}
              title="เพิ่มรายการใหม่"
              className="bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-250px)] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-3 text-indigo-500" />
              <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">บริการ</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">รถยนต์ (บาท)</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">รถจักรยานยนต์ (บาท)</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-center text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      ไม่พบข้อมูลบริการ
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, idx) => (
                    <tr
                      key={idx}
                      ref={(el) => (addRowRefs.current[idx] = el!)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 md:px-6 md:py-4 text-gray-900 dark:text-gray-100">{service.name}</td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 dark:text-gray-300">{service.carPrice}</td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 dark:text-gray-300">{service.motorcyclePrice}</td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-center space-x-2">
                        {/* ใช้อินเด็กซ์เดิม (original index) เพื่อแก้ไขและลบข้อมูลได้ถูกต้อง */}
                        <button
                          onClick={() => handleEdit(services.indexOf(service))} 
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors transform hover:scale-110"
                          title="แก้ไข"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(services.indexOf(service))} 
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors transform hover:scale-110"
                          title="ลบ"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full z-10 border border-gray-200 dark:border-gray-700 transform scale-95 opacity-0 animate-scale-in">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                title="ปิด"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
                {editIndex !== null ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}
              </h2>
              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="ชื่อบริการ"
                  value={editRow?.name ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, name: e.target.value }))}
                  className="w-full p-3.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                />
                <input
                  type="text"
                  placeholder="ราคารถยนต์ (บาท)"
                  value={editRow?.carPrice ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, carPrice: e.target.value }))}
                  className="w-full p-3.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                />
                <input
                  type="text"
                  placeholder="ราคารถจักรยานยนต์ (บาท)"
                  value={editRow?.motorcyclePrice ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, motorcyclePrice: e.target.value }))}
                  className="w-full p-3.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                />
              </div>
              <div className="mt-7 text-right">
                <button
                  onClick={handleSave}
                  className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 flex items-center justify-center ml-auto"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" /> บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-lime-600 hover:text-lime-700 dark:text-lime-400 dark:hover:text-lime-300 font-medium text-lg transition-colors flex items-center justify-center group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}