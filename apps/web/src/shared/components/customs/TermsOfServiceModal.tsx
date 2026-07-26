import { FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/animate-ui/components/radix/dialog";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({
  isOpen,
  onClose,
}: Readonly<TermsOfServiceModalProps>) {
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
            <FileText className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="text-left">
            <DialogTitle className="text-lg font-bold text-primary-text">
              {isTh
                ? "ข้อตกลงและเงื่อนไขการใช้งาน (Terms of Service)"
                : "Terms of Service"}
            </DialogTitle>
            <p className="text-xs text-secondary-text mt-0.5">
              {isTh
                ? "มีผลบังคับใช้ ณ วันที่ 26 กรกฎาคม 2026"
                : "Effective date: July 26, 2026"}
            </p>
          </div>
        </DialogHeader>

        <div className="grow overflow-y-auto space-y-4 text-xs text-secondary-text pr-2 leading-relaxed">
          {isTh ? (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  1. การยอมรับข้อตกลง (Acceptance of Terms)
                </h4>
                <p>
                  ยินดีต้อนรับสู่ FindMyTang
                  ในการเข้าถึงหรือใช้งานแอปพลิเคชันของเรา
                  ท่านตกลงที่จะผูกพันตามข้อตกลงและเงื่อนไขเหล่านี้
                  หากท่านไม่เห็นด้วยกับข้อตกลงใดๆ กรุณายุติการใช้งานแอปพลิเคชัน
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  2. บัญชีผู้ใช้และการซิงค์ข้อมูล (Account & Data Syncing)
                </h4>
                <p>
                  ท่านสามารถเลือกใช้งานในโหมดผู้เยี่ยมชม (Guest Mode)
                  ซึ่งจะจัดเก็บข้อมูลไว้ในเครื่องของท่าน
                  หรือเลือกสมัครบัญชีเพื่อซิงค์ข้อมูลธุรกรรมและสินทรัพย์ผ่านระบบคลาวด์
                  ท่านมีหน้าที่รับผิดชอบในการรักษาความลับของรหัสผ่านบัญชีของท่าน
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  3. ความเป็นส่วนตัวและความปลอดภัย (Privacy & Security)
                </h4>
                <p>
                  เราให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของข้อมูลทางการเงินของท่าน
                  ข้อมูลของท่านจะไม่ถูกนำไปจำหน่ายหรือแชร์แก่บุคคลที่สามโดยปราศจากการยินยอมจากท่าน
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  4. ข้อจำกัดความรับผิดชอบ (Limitation of Liability)
                </h4>
                <p>
                  FindMyTang
                  เป็นเครื่องมือช่วยบันทึกและวิเคราะห์การเงินส่วนบุคคล
                  ไม่ได้ให้บริการคำแนะนำทางการเงินหรือการลงทุนอย่างเป็นทางการ
                  เราจะไม่รับผิดชอบต่อความสูญเสียใดๆ
                  ที่เกิดจากการตัดสินใจทางการเงินของท่าน
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  5. การปรับปรุงเงื่อนไข (Modifications)
                </h4>
                <p>
                  เราขอสงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อตกลงการใช้งานนี้ได้ตลอดเวลา
                  โดยการเปลี่ยนแปลงจะมีผลทันทีเมื่อมีการเผยแพร่บนแอปพลิเคชัน
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  1. Acceptance of Terms
                </h4>
                <p>
                  Welcome to FindMyTang. By accessing or using our application,
                  you agree to be bound by these Terms of Service. If you do not
                  agree with any part of these terms, please refrain from using
                  the application.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  2. User Account & Data Syncing
                </h4>
                <p>
                  You may choose to use FindMyTang in Guest Mode (storing data
                  locally on your device) or register an account to sync assets
                  and transaction logs via cloud services. You are responsible
                  for safeguarding your login credentials.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  3. Privacy & Data Security
                </h4>
                <p>
                  Your financial privacy is our highest priority. We do not sell
                  or share your personal financial records with third parties
                  without your explicit consent.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  4. Limitation of Liability
                </h4>
                <p>
                  FindMyTang is a personal asset tracker and budget organizer.
                  It does not offer official financial or investment advice. We
                  are not liable for any financial decisions made based on
                  application data.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-sm text-primary-text">
                  5. Modifications
                </h4>
                <p>
                  We reserve the right to revise or update these terms at any
                  time. Continued use of the service constitutes acceptance of
                  any modified terms.
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
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            {t("legalAgree")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
