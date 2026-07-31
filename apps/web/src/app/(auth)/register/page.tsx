import LoginContainer from "@/features/auth/login/containers/LoginContainer";
import AuthPageGuard from "@/shared/components/auth/AuthPageGuard";

export default function RegisterPage() {
  return (
    <AuthPageGuard>
      <LoginContainer initialShowRegistrationUnavailable />
    </AuthPageGuard>
  );
}
