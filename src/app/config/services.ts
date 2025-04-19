// config/services.ts

export interface Service {
    name: string;
    carPrice: string;
    motorcyclePrice: string;
  }
  
  export const services: Service[] = [
    { name: "ล้างรถ",              carPrice: "150",   motorcyclePrice: "80"  },
    { name: "ดูดฝุ่น",            carPrice: "200",   motorcyclePrice: "100" },
    { name: "เคลือบสี",            carPrice: "1,500", motorcyclePrice: "800" },
    { name: "ขัดสี",              carPrice: "2,500", motorcyclePrice: "1,200" },
    { name: "ล้างห้องเครื่อง",    carPrice: "500",   motorcyclePrice: "300" },
    { name: "ล้างรถ+ดูดฝุ่น",     carPrice: "300",   motorcyclePrice: "150" },
    { name: "ขัดสี+เคลือบสี",     carPrice: "2,800", motorcyclePrice: "1,400" },
    { name: "เคลือบแก้ว",          carPrice: "4,000", motorcyclePrice: "2,000" },
    { name: "ดูดฝุ่นภายใน",       carPrice: "250",   motorcyclePrice: "120" },
    { name: "ล้างรถแบบละเอียด",   carPrice: "600",   motorcyclePrice: "350" },
    { name: "ขัดโคมไฟหน้า",       carPrice: "800",   motorcyclePrice: "400" },
    { name: "เคลือบสีเงา",         carPrice: "2,200", motorcyclePrice: "1,100" },
  ];
  