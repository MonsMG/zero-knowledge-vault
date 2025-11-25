import CryptoJS from "crypto-js";

// 1. สร้างกุญแจลับ (Random Key) - สร้างที่เครื่องคนใช้ Server ไม่รู้เรื่องด้วย
export const generateKey = () => {
  // สร้าง random string 16 ตัวอักษร
  return (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
};

// 2. เข้ารหัส (Encrypt) - แปลงข้อความให้อ่านไม่รู้เรื่อง
export const encryptMessage = (message, key) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

// 3. ถอดรหัส (Decrypt) - แปลงกลับ
export const decryptMessage = (cipherText, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (e) {
    return null; // ถอดไม่ได้ (Key ผิด หรือ Data เสีย)
  }
};
