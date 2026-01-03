import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SECRET_SEQUENCE = 'admin';
const SEQUENCE_TIMEOUT = 2000; // Reset after 2 seconds of inactivity

export function useAdminKeySequence(locale: string = 'en') {
  const router = useRouter();
  const sequenceRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add the pressed key to the sequence
      sequenceRef.current += event.key.toLowerCase();

      // Check if the sequence matches
      if (sequenceRef.current === SECRET_SEQUENCE) {
        console.log('🔓 Admin sequence activated!');
        sequenceRef.current = '';
        router.push(`/${locale}/admin`);
        return;
      }

      // Check if current sequence is still a valid prefix
      if (!SECRET_SEQUENCE.startsWith(sequenceRef.current)) {
        sequenceRef.current = '';
      }

      // Set timeout to reset sequence
      timeoutRef.current = setTimeout(() => {
        sequenceRef.current = '';
      }, SEQUENCE_TIMEOUT);
    };

    // Add event listener
    window.addEventListener('keypress', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router, locale]);
}
