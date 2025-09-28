"use client";

import { useEffect, useState } from "react";

export function useAppReady(tasks: (() => Promise<void>)[]) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        console.log('🚀 Starting app initialization...');
        
        // Always start timing from now
        const startTime = Date.now();
        const minimumLoadTime = 2000; // 2 seconds minimum
        
        // Check if we're in a theme change state
        const isThemeChanging = localStorage.getItem('theme-changing') === 'true';
        
        console.log('⏱️ Running initialization tasks...');
        
        // Run all tasks in parallel
        await Promise.all(tasks.map(async (task, index) => {
          try {
            await task();
            console.log(`✅ Task ${index + 1} completed`);
          } catch (error) {
            console.error(`❌ Task ${index + 1} failed:`, error);
          }
        }));
        
        console.log('📋 All tasks completed');
        
        // Calculate how much time has passed
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsed);
        
        console.log(`⏰ Elapsed: ${elapsed}ms, Remaining: ${remainingTime}ms`);
        
        // Always wait for the minimum time, even if tasks completed quickly
        if (remainingTime > 0) {
          console.log(`⏳ Waiting additional ${remainingTime}ms to meet minimum load time`);
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Clear theme changing flag if it was set
        if (isThemeChanging) {
          localStorage.removeItem('theme-changing');
          console.log('🎨 Theme changing flag cleared');
        }
        
        console.log('✨ App ready!');
        
        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        
        // Even on failure, wait minimum time before showing app
        const elapsed = Date.now() - (Date.now() - 2000);
        if (elapsed < 2000) {
          await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
        }
        
        if (mounted) {
          setIsReady(true); // fail gracefully
        }
      }
    }

    loadAll();
    
    return () => {
      mounted = false;
    };
  }, [tasks]);

  return isReady;
}