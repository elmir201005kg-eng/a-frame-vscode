import { AuthenticationPage, type AuthPageProps } from "@/components/auth-page";

export const instant = false;
export default function RegisterPage(props: AuthPageProps) {
  return <AuthenticationPage {...props} mode="register" />;
}
