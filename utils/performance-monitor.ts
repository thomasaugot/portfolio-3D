export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, { count: number; totalTime: number; lastTime: number }> = new Map();
  private frameCount = 0;
  private lastFPSUpdate = performance.now();
  private fps = 0;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  startMeasure(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric = this.metrics.get(label) || { count: 0, totalTime: 0, lastTime: 0 };
      metric.count++;
      metric.totalTime += duration;
      metric.lastTime = duration;
      this.metrics.set(label, metric);

      if (duration > 16.67 && metric.count > 2) {
        console.warn(`⚠️ SLOW: ${label} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  updateFPS() {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastFPSUpdate;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      
      if (this.fps < 30) {
        console.warn(`❌ LOW FPS: ${this.fps} fps`);
      } else if (this.fps < 50) {
        console.warn(`⚠️ MEDIUM FPS: ${this.fps} fps`);
      }
      
      this.frameCount = 0;
      this.lastFPSUpdate = now;
    }
  }

  getFPS() {
    return this.fps;
  }

  logMetrics() {
    console.group('📊 Performance Metrics');
    console.log(`FPS: ${this.fps}`);
    
    const sortedMetrics = Array.from(this.metrics.entries())
      .filter(([_, metric]) => metric.count > 2)
      .sort((a, b) => b[1].totalTime - a[1].totalTime)
      .slice(0, 20);
    
    sortedMetrics.forEach(([label, metric]) => {
      const avgTime = metric.totalTime / metric.count;
      console.log(`${label}:`, {
        calls: metric.count,
        avgTime: `${avgTime.toFixed(2)}ms`,
        totalTime: `${metric.totalTime.toFixed(2)}ms`,
        lastTime: `${metric.lastTime.toFixed(2)}ms`
      });
    });
    console.groupEnd();
  }

  reset() {
    this.metrics.clear();
    this.frameCount = 0;
    this.fps = 0;
  }
}

export const perfMonitor = PerformanceMonitor.getInstance();

if (typeof window !== 'undefined') {
  setInterval(() => {
    perfMonitor.logMetrics();
  }, 10000);
}