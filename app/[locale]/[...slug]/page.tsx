import { redirect } from "next/navigation";

export default async function LocaleCatchAll({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
