import { AuthenticationPage, type AuthPageProps } from "@/components/auth-page";

export const instant = false;
export default async function LoginPage(props: AuthPageProps) {
  return AuthenticationPage({ ...props, mode: "login" });
}
