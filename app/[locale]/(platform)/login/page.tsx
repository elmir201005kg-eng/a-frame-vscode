import { AuthenticationPage, type AuthPageProps } from "@/components/auth-page";

export const instant = false;
export default function LoginPage(props: AuthPageProps) {
  return <AuthenticationPage {...props} mode="login" />;
}
