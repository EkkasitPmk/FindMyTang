export const translations = {
  th: {
    // Navigation / Layout
    navHome: "หน้าแรก",
    navJournal: "ประวัติ",
    navTransactions: "บันทึก",
    navAnalytics: "วิเคราะห์",
    navMore: "อื่นๆ",

    // More page
    preferences: "การตั้งค่า",
    language: "ภาษา",
    management: "การจัดการ",
    manageCategories: "จัดการหมวดหมู่",
    manageAssets: "จัดการสินทรัพย์",
    dataManagement: "จัดการข้อมูล",
    exportData: "ส่งออกข้อมูล (JSON)",
    resetData: "ล้างข้อมูลทั้งหมด",
    syncTitle: "สำรองข้อมูล & ซิงค์คลาวด์",
    syncDesc:
      "เชื่อมต่อบัญชีเพื่อสำรองข้อมูลธุรกรรมและซิงค์ข้อมูลในหลายอุปกรณ์",
    connectBtn: "เชื่อมต่อ & ซิงค์บัญชี",
    guestUser: "โหมดผู้ใช้ชั่วคราว",
    exportAlert: "กำลังส่งออกข้อมูลธุรกรรมไปยังไฟล์ pocketnote_backup.json...",
    resetConfirm:
      "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมดในเครื่อง? การกระทำนี้ไม่สามารถย้อนคืนได้",
    resetAlert: "ล้างข้อมูลในเครื่องเรียบร้อยแล้ว",

    // Home Dashboard & Common
    totalAssets: "สินทรัพย์ทั้งหมด",
    netCashFlow: "กระแสเงินสดสุทธิ",
    income: "รายรับ",
    expense: "รายจ่าย",
    recentActivity: "กิจกรรมล่าสุด",
    goodMorning: "สวัสดีตอนเช้า ☀️",
    goodAfternoon: "สวัสดีตอนบ่าย 🌤️",
    goodEvening: "สวัสดีตอนเย็น 🌙",
    goodNight: "สวัสดีตอนกลางคืน ⭐️",

    // Account page
    profileSettings: "ตั้งค่าบัญชีผู้ใช้",
    displayName: "ชื่อที่แสดง",
    email: "อีเมล",
    dataSynced: "ซิงค์ข้อมูลกับคลาวด์แล้ว",
    localOnly: "เก็บข้อมูลในเครื่องเท่านั้น",
    placeholderDisplayName: "ใส่ชื่อสำหรับแสดงผล",
    changePassword: "เปลี่ยนรหัสผ่าน",
    saveSuccess: "บันทึกการตั้งค่าเรียบร้อยแล้ว",
    saveError: "ไม่สามารถบันทึกการตั้งค่าได้",
    save: "บันทึก",
    saving: "กำลังบันทึก...",
  },
  en: {
    // Navigation / Layout
    navHome: "Home",
    navJournal: "Journal",
    navTransactions: "Transactions",
    navAnalytics: "Analytics",
    navMore: "More",

    // More page
    preferences: "Preferences",
    language: "Language",
    management: "Management",
    manageCategories: "Manage Categories",
    manageAssets: "Manage Assets",
    dataManagement: "Data Management",
    exportData: "Export Data (JSON)",
    resetData: "Reset Local Data",
    syncTitle: "Cloud Backup & Sync",
    syncDesc:
      "Connect an account to backup your transactions and sync across multiple devices.",
    connectBtn: "Connect & Sync Account",
    guestUser: "Guest Mode",
    exportAlert:
      "Exporting your local financial records to pocketnote_backup.json...",
    resetConfirm:
      "Are you sure you want to reset all local data? This action cannot be undone.",
    resetAlert: "Local data cleared.",

    // Home Dashboard & Common
    totalAssets: "Total Assets",
    netCashFlow: "Net Cash Flow",
    income: "Income",
    expense: "Expense",
    recentActivity: "Recent Activity",
    goodMorning: "Good Morning ☀️",
    goodAfternoon: "Good Afternoon 🌤️",
    goodEvening: "Good Evening 🌙",
    goodNight: "Good Night ⭐️",

    // Account page
    profileSettings: "Account Settings",
    displayName: "Display Name",
    email: "Email",
    dataSynced: "Data synced",
    localOnly: "Data stored locally",
    placeholderDisplayName: "Enter display name",
    changePassword: "Change Password",
    saveSuccess: "Settings saved successfully",
    saveError: "Failed to save settings",
    save: "Save",
    saving: "Saving...",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export type Language = "th" | "en";
