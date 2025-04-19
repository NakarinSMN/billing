"use client";

import Link from "next/link";
import { useState } from "react";
import { CarIcon } from "@/components/icons/car-icon";
import jsPDF from "jspdf";
import { sarabunFontBase64 } from "@/app/fonts/Sarabun-font";

type FormData = {
  customerName: string;
  licenseNumber: string;
  phoneNumber: string;
  carModel: string;
  serviceType: string;
  serviceDate: string;
  price: string;
  notes: string;
  prefix: string;
  address: {
    houseNumber: string;
    street: string;
    alley: string;
    subdistrict: string;
    district: string;
    province: string;
    zip: string;
  };
  taxId: string;
  expenses: {
    tax: string;
    compulsory: string;
    inspection: string;
    service: string;
    insurance: string;
    gasCheck: string;
    others: string;
    discount: string;
  };
};

export default function CarBillingPage() {
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    licenseNumber: "",
    phoneNumber: "",
    carModel: "",
    serviceType: "",
    serviceDate: "",
    price: "",
    notes: "",
    prefix: "",
    taxId: "",
    address: {
      houseNumber: "",
      street: "",
      alley: "",
      subdistrict: "",
      district: "",
      province: "",
      zip: "",
    },
    expenses: {
      tax: "",
      compulsory: "",
      inspection: "",
      service: "",
      insurance: "",
      gasCheck: "",
      others: "",
      discount: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // จัดการฟิลด์ address และ expenses แยก
    if (name.startsWith("address.")) {
      const key = name.replace("address.", "") as keyof FormData["address"];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("expenses.")) {
      const key = name.replace("expenses.", "") as keyof FormData["expenses"];
      setFormData((prev) => ({
        ...prev,
        expenses: { ...prev.expenses, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateTotal = (): string => {
    const { expenses } = formData;
    const total =
      (parseFloat(expenses.tax) || 0) +
      (parseFloat(expenses.compulsory) || 0) +
      (parseFloat(expenses.inspection) || 0) +
      (parseFloat(expenses.service) || 0) +
      (parseFloat(expenses.insurance) || 0) +
      (parseFloat(expenses.gasCheck) || 0) +
      (parseFloat(expenses.others) || 0) -
      (parseFloat(expenses.discount) || 0);

    return total.toFixed(2);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Sarabun-Regular.ttf", sarabunFontBase64);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
    doc.setFont("Sarabun");
    doc.setFontSize(16);

    doc.text("ใบออกบิลบริการรถยนต์", 20, 20);
    doc.text(`ชื่อ: ${formData.prefix} ${formData.customerName}`, 20, 30);
    doc.text(`ทะเบียนรถ: ${formData.licenseNumber}`, 20, 40);
    doc.text(`เบอร์โทร: ${formData.phoneNumber}`, 20, 50);
    doc.text(`รุ่นรถ: ${formData.carModel}`, 20, 60);
    doc.text(`บริการ: ${formData.serviceType}`, 20, 70);
    doc.text(`วันที่ให้บริการ: ${formData.serviceDate}`, 20, 80);
    doc.text(`หมายเหตุ: ${formData.notes}`, 20, 90);
    doc.text(`รหัสผู้เสียภาษี: ${formData.taxId}`, 20, 100);
    doc.text(`ที่อยู่: ${formData.address.houseNumber} ${formData.address.street} ${formData.address.alley}`, 20, 110);
    doc.text(`แขวง/ตำบล: ${formData.address.subdistrict} เขต/อำเภอ: ${formData.address.district}`, 20, 120);
    doc.text(`จังหวัด: ${formData.address.province} ${formData.address.zip}`, 20, 130);
    doc.text(`รวมเงินสุทธิ: ${calculateTotal()} บาท`, 20, 150);

    doc.save("billing.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CarIcon className="w-6 h-6" />
        ออกบิลรถยนต์
      </h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="prefix" onChange={handleChange} className="form-input" placeholder="คำนำหน้า" />
          <input name="customerName" onChange={handleChange} className="form-input" placeholder="ชื่อลูกค้า" />
          <input name="taxId" onChange={handleChange} className="form-input" placeholder="เลขผู้เสียภาษี" />
          <input name="phoneNumber" onChange={handleChange} className="form-input" placeholder="เบอร์โทร" />
          <input name="carModel" onChange={handleChange} className="form-input" placeholder="ยี่ห้อ / รุ่น" />
          <input name="licenseNumber" onChange={handleChange} className="form-input" placeholder="ทะเบียนรถ" />
          <input name="serviceType" onChange={handleChange} className="form-input" placeholder="ประเภทบริการ" />
          <input name="serviceDate" type="date" onChange={handleChange} className="form-input" />
        </div>

        {/* ที่อยู่ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="address.houseNumber" onChange={handleChange} className="form-input" placeholder="บ้านเลขที่" />
          <input name="address.street" onChange={handleChange} className="form-input" placeholder="ถนน" />
          <input name="address.alley" onChange={handleChange} className="form-input" placeholder="ตรอก/ซอย" />
          <input name="address.subdistrict" onChange={handleChange} className="form-input" placeholder="แขวง/ตำบล" />
          <input name="address.district" onChange={handleChange} className="form-input" placeholder="เขต/อำเภอ" />
          <input name="address.province" onChange={handleChange} className="form-input" placeholder="จังหวัด" />
          <input name="address.zip" onChange={handleChange} className="form-input" placeholder="รหัสไปรษณีย์" />
        </div>

        {/* รายการค่าใช้จ่าย */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input name="expenses.tax" onChange={handleChange} className="form-input" placeholder="ค่าภาษี" />
          <input name="expenses.compulsory" onChange={handleChange} className="form-input" placeholder="ค่าพรบ." />
          <input name="expenses.inspection" onChange={handleChange} className="form-input" placeholder="ค่าตรวจสภาพ" />
          <input name="expenses.service" onChange={handleChange} className="form-input" placeholder="ค่าบริการ" />
          <input name="expenses.insurance" onChange={handleChange} className="form-input" placeholder="ค่าประกัน" />
          <input name="expenses.gasCheck" onChange={handleChange} className="form-input" placeholder="ค่าตรวจแก๊ส" />
          <input name="expenses.others" onChange={handleChange} className="form-input" placeholder="อื่นๆ" />
          <input name="expenses.discount" onChange={handleChange} className="form-input" placeholder="ส่วนลด (ห้ามใส่จำนวนติดลบเช่น -500)" />
        </div>

        <textarea name="notes" onChange={handleChange} className="form-input w-full" rows={3} placeholder="หมายเหตุเพิ่มเติม"></textarea>

        <div className="text-right font-bold text-lg">รวมเงินสุทธิ: {calculateTotal()} บาท</div>

        {/* ปุ่ม */}
        <div className="flex flex-col md:flex-row justify-end gap-4 mt-4">
          <button type="button" onClick={handleExportPDF} className="form-button bg-pink-500 text-white hover:bg-pink-600">
            ส่งออก PDF
          </button>
          <Link href="/" className="form-button bg-gray-300 hover:bg-gray-400 text-black text-center">
            กลับหน้าหลัก
          </Link>
        </div>
      </form>
    </div>
  );
}
