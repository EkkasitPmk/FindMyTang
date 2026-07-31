import LoginContainer from "@/features/auth/login/containers/LoginContainer";
import AuthPageGuard from "@/shared/components/auth/AuthPageGuard";

export default function LoginPage() {
  return (
    <AuthPageGuard>
      <LoginContainer />
    </AuthPageGuard>
  );
}
