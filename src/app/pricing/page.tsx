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
  const [editRow, setEditRow] = useState<{ name: string; carPrice: string; motorcyclePrice: string } | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const addRowRefs = useRef<HTMLTableRowElement[]>([]);
  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
  
        const res = await fetch('/.netlify/functions/gs-proxy', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "get" })
        });
  
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
  
        const data = await res.json();
        const normalized = data.map((item: any) => ({
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
    if (addRowRefs.current.length > 0 && editIndex === null) {
      const last = addRowRefs.current[addRowRefs.current.length - 1];
      last?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [services, editIndex]);

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

  const handleDelete = async (index: number) => {
    setConfirmBox({
      message: "คุณต้องการลบรายการนี้หรือไม่?",
      onConfirm: async () => {
        try {
          const res = await fetch(SHEET_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "delete", index })
          });
          const result = await res.json();
          if (result.result === "success") {
            const updated = [...services];
            updated.splice(index, 1);
            setServices(updated);
            showToast("ลบรายการสำเร็จ");
          } else {
            showToast("เกิดข้อผิดพลาดขณะลบข้อมูล");
          }
        } catch (err) {
          showToast("ลบข้อมูลไม่สำเร็จ");
        }
        setConfirmBox(null);
      }
    });
  };

  const handleSave = async () => {
    if (!editRow) return;
    const updated = [...services];

    const payload = {
      method: editIndex === null ? "add" : "update",
      index: editIndex,
      name: editRow.name,
      carPrice: editRow.carPrice,
      motorcyclePrice: editRow.motorcyclePrice
    };

    try {
      const res = await fetch(SHEET_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.result === "success") {
        if (editIndex === null) {
          updated.push(editRow);
        } else {
          updated[editIndex] = editRow;
        }
        setServices(updated);
        showToast(editIndex === null ? "เพิ่มรายการใหม่สำเร็จ" : "แก้ไขข้อมูลเรียบร้อย");
      } else {
        showToast("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
      }
    } catch (err) {
      showToast("บันทึกข้อมูลไม่สำเร็จ");
    }

    setModalOpen(false);
    setEditIndex(null);
    setEditRow(null);
  };

  const filteredServices = searchOpen
    ? services.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services;

  // The rest of the UI remains unchanged
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[999] animate-fade-in">
          <FontAwesomeIcon icon={faCircleCheck} className="mr-2" /> {toast}
        </div>
      )}

      {/* Confirm */}
      {confirmBox && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center z-10">
            <p className="text-lg font-medium mb-4">{confirmBox.message}</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmBox.onConfirm} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                <FontAwesomeIcon icon={faCircleCheck} className="mr-2" /> ตกลง
              </button>
              <button onClick={() => setConfirmBox(null)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                <FontAwesomeIcon icon={faCircleXmark} className="mr-2" /> ยกเลิก
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา..."
              className="border px-3 py-2 rounded bg-white dark:bg-gray-700 text-sm"
            />
          )}
          <button onClick={() => setSearchOpen((o) => !o)} title="ค้นหา">
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button onClick={handleAdd} title="เพิ่มรายการ">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-auto max-h-[600px]">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">บริการ</th>
                  <th className="px-6 py-3 text-left">รถยนต์ (บาท)</th>
                  <th className="px-6 py-3 text-left">รถจักรยานยนต์ (บาท)</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, idx) => (
                  <tr key={idx} ref={(el) => (addRowRefs.current[idx] = el!)}>
                    <td className="px-6 py-4">{service.name}</td>
                    <td className="px-6 py-4">{service.carPrice}</td>
                    <td className="px-6 py-4">{service.motorcyclePrice}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(idx)} className="text-indigo-600">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(idx)} className="text-red-600">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full z-10">
              <button onClick={() => setModalOpen(false)} className="absolute top-2 right-2">
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="text-xl font-bold mb-4">{editIndex !== null ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อบริการ"
                  value={editRow?.name ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, name: e.target.value }))}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="ราคารถยนต์"
                  value={editRow?.carPrice ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, carPrice: e.target.value }))}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="ราคารถจักรยานยนต์"
                  value={editRow?.motorcyclePrice ?? ""}
                  onChange={(e) => setEditRow((r) => ({ ...r!, motorcyclePrice: e.target.value }))}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div className="mt-4 text-right">
                <button onClick={handleSave} className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded">
                  <FontAwesomeIcon icon={faSave} className="mr-2" /> บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* กลับหน้าหลัก */}
        <div className="text-center mt-6">
          <Link href="/" className="text-lime-600 hover:underline">← กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}
