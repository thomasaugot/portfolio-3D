"use client";

import { useAdminKeySequence } from "@/hooks/useAdminKeySequence";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function AdminKeySequenceListener() {
  const { language } = useTranslation();
  useAdminKeySequence(language);
  return null;
}
