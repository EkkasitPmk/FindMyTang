import { Shield, Check } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/animate-ui/components/radix/dialog";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: Readonly<PrivacyPolicyModalProps>) {
  const { currentLanguage, t } = useTranslation();
  const isTh = currentLanguage === "th";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] rounded-2xl p-6 gap-2 bg-surface border-border flex flex-col overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Shield className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="text-left">
            <DialogTitle className="text-lg font-bold text-primary-text">
              {isTh
                ? "นโยบายความเป็นส่วนตัว (Privacy Policy)"
                : "Privacy Policy"}
            </DialogTitle>
            <p className="text-xs text-secondary-text mt-0.5">
              {isTh
                ? "อัปเดตล่าสุด: 26 กรกฎาคม 2026"
                : "Last updated: July 26, 2026"}
            </p>
          </div>
        </DialogHeader>

        <div className="grow overflow-y-auto space-y-4 text-xs text-secondary-text pr-2 leading-relaxed">
          {isTh ? (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  1. การจัดเก็บข้อมูล (Information We Collect)
                </h4>
                <p>
                  เราจัดเก็บข้อมูลบัญชีพื้นฐาน (อีเมล, ชื่อที่แสดง)
                  และบันทึกข้อมูลธุรกรรมที่ท่านสร้างขึ้นในแอปพลิเคชัน
                  ในโหมดผู้เยี่ยมชม
                  ข้อมูลทั้งหมดจะถูกจัดเก็บไว้เฉพาะในเบราว์เซอร์ของท่านเท่านั้น
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  2. วัตถุประสงค์ในการใช้ข้อมูล (How We Use Information)
                </h4>
                <p>
                  ข้อมูลของท่านใช้เพื่อวัตถุประสงค์ในการคำนวณยอดเงิน
                  แสดงผลกราฟวิเคราะห์กระแสเงินสด
                  และซิงค์ข้อมูลข้ามอุปกรณ์สำหรับบัญชีผู้ใช้ระบบ
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  3. ความคุ้มครองและความปลอดภัยข้อมูล (Data Protection)
                </h4>
                <p>
                  ข้อมูลธุรกรรมและรหัสผ่านทั้งหมดได้รับการเข้ารหัสด้วยมาตรฐานความปลอดภัยระดับสูง
                  (HTTPS / TLS & Password Hashing)
                  เพื่อป้องกันการเข้าถึงโดยมิชอบ
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  4. สิทธิของเจ้าของข้อมูล (User Rights)
                </h4>
                <p>
                  ท่านมีสิทธิเข้าถึง แก้ไข ลบข้อมูลธุรกรรม
                  หรือส่งคำขอลบบัญชีผู้ใช้พร้อมข้อมูลทั้งหมดออกจากระบบได้ตลอดเวลาผ่านหน้าการตั้งค่าบัญชี
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  5. ติดต่อเรา (Contact Us)
                </h4>
                <p>
                  หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว
                  สามารถติดต่อทีมงาน FindMyTang ได้ผ่านช่องทางสนับสนุนผู้ใช้งาน
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  1. Information We Collect
                </h4>
                <p>
                  We collect essential profile info (email, display name) and
                  transaction data you explicitly create. In Guest Mode, all
                  data stays strictly within your browser local storage.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  2. How We Use Information
                </h4>
                <p>
                  Your information is processed solely to aggregate asset
                  values, compute financial metrics, render visual charts, and
                  sync account state across devices.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  3. Data Security & Encryption
                </h4>
                <p>
                  All network communication and sensitive fields are protected
                  using industry-standard TLS encryption protocols and salted
                  cryptographic password hashes.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  4. User Rights & Data Erasure
                </h4>
                <p>
                  You retain full ownership of your data. You may edit, clear
                  local logs, or permanently delete your account and associated
                  records at any time from Settings.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  5. Contact Us
                </h4>
                <p>
                  For any privacy inquiries or data requests, please reach out
                  to the FindMyTang support team via official channels.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 font-medium"
          >
            <Check className="w-4 h-4 mr-1.5" />
            {t("legalAgree")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
