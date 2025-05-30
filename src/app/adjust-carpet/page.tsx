"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CarpetIcon } from "@/components/icons/carpet-icon";
import Calendar from "@/components/Calendar";
import AnimatedNumber from "@/components/AnimatedNumber";
import { motion, AnimatePresence } from "framer-motion";

export default function AdjustCarpetPageV2() {
  const [activeTab, setActiveTab] = useState<"byDate" | "byDays">("byDate");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customDays, setCustomDays] = useState<string>("");
  const [daysDiff, setDaysDiff] = useState<number>(0);
  const [resultDate, setResultDate] = useState<string>("");
  const [resultRates, setResultRates] = useState<Record<string, string>>({});

  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  useEffect(() => {
    const upd = () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, "0");
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      const h = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setDateTime({
        date: `วันที่ ${d}/${m}/${y}`,
        time: `เวลา ${h}:${mi}:${s}`,
      });
    };
    upd();
    const tid = setInterval(upd, 1000);
    return () => clearInterval(tid);
  }, []);

  const rateFactors: Record<string, number> = {
    A: 645.21,
    B: 1182.35,
    C: 2493.10,
    D: 967.28,
    E: 1310.75,
    F: 1408.12,
    G: 1826.49,
    H: 161.57,
    I: 323.14,
    J: 430.14,
    K: 645.21,
  };

  useEffect(() => {
    if (activeTab === "byDate" && startDate) {
      const sd = new Date(startDate);
      sd.setFullYear(sd.getFullYear() + 1);
      const y = sd.getFullYear();
      const mm = String(sd.getMonth() + 1).padStart(2, "0");
      const dd = String(sd.getDate()).padStart(2, "0");
      setEndDate(`${y}-${mm}-${dd}`);
    }
  }, [startDate, activeTab]);

  useEffect(() => {
    if (activeTab === "byDate" && startDate && endDate) {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      if (ed > sd) {
        const diff = Math.ceil((ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24));
        setDaysDiff(diff);
        const rates: Record<string, string> = {};
        for (const [k, base] of Object.entries(rateFactors)) {
          rates[k] = ((base / 365) * diff + 0.2).toFixed(2);
        }
        setResultRates(rates);
      } else {
        setDaysDiff(0);
        setResultRates({});
      }
    }
  }, [startDate, endDate, activeTab]);

  useEffect(() => {
    if (activeTab === "byDays") {
      const n = parseInt(customDays, 10);
      if (!isNaN(n) && n > 0) {
        const rates: Record<string, string> = {};
        for (const [k, base] of Object.entries(rateFactors)) {
          rates[k] = ((base / 365) * n + 0.2).toFixed(2);
        }
        setResultRates(rates);
        const due = new Date();
        due.setDate(due.getDate() + n);
        const dd = String(due.getDate()).padStart(2, "0");
        const mm = String(due.getMonth() + 1).padStart(2, "0");
        const yy = due.getFullYear();
        setResultDate(`${dd}/${mm}/${yy}`);
        setDaysDiff(n);
      } else {
        setResultRates({});
        setResultDate("");
        setDaysDiff(0);
      }
    }
  }, [customDays, activeTab]);

  const labelMap: Record<string, string> = {
    A: "รย.1",
    B: "รย.2",
    C: "รย.2 เชิงพานิชย์",
    D: "รย.3",
    E: "รย.3 นน.เกิน 3-6 ตัน",
    F: "รย.3 นน.เกิน 6-12 ตัน",
    G: "รย.3 นน.เกิน 12 ตัน",
    H: "รย.12 ไม่เกิน 75 ซีซี",
    I: "รย.12 เกิน 75-125 ซีซี",
    J: "รย.12 เกิน 125-150 ซีซี",
    K: "รย.12 เกิน 150 ซีซี",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <CarpetIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold ml-2">ปรับรอบพรบ (V2)</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {dateTime.date} &nbsp; {dateTime.time}
          </div>
        </motion.div>
        <div className="border-b border-border mb-6" />

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("byDate")}
            className={`form-button ${activeTab === "byDate" ? "" : "opacity-60"}`}
          >
            คำนวนตามวันที่
          </button>
          <button
            onClick={() => setActiveTab("byDays")}
            className={`form-button ${activeTab === "byDays" ? "" : "opacity-60"}`}
          >
            คำนวนตามจำนวนวัน
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "byDate" ? (
            <motion.div
              key="byDate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <p className="mb-6 text-base font-medium text-center">วันเริ่มต้น</p>
                <Calendar
                  selectedDate={startDate}
                  onSelectDate={setStartDate}
                  className="w-full max-w-xs mx-auto"
                />
              </div>
              <div>
                <p className="mb-6 text-base font-medium text-center">วันสิ้นสุด (+1 ปี อัตโนมัติ)</p>
                <Calendar
                  selectedDate={endDate}
                  onSelectDate={setEndDate}
                  className="w-full max-w-xs mx-auto"
                />

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="byDays"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-1">กรอกจำนวนวัน</p>
              <input
                type="number"
                placeholder="จำนวนวัน"
                className="form-input max-w-xs"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {(activeTab === "byDate" ? daysDiff > 0 : resultDate) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-4"
          >
            {activeTab === "byDate" ? (
              <p>จำนวนทั้งหมด: {daysDiff.toLocaleString("th-TH")} วัน</p>
            ) : (
              <p>ครบกำหนดวันที่: {resultDate}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(resultRates).map(([k, v]) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card p-4 text-center"
                >
                  <div className="font-semibold">{labelMap[k]}</div>
                  <div className="mt-1">
                    <AnimatedNumber value={parseFloat(v)} /> บาท
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link href="/" className="nav-button inline-block">
            กลับหน้าหลัก
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
