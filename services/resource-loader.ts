interface LoadingTask {
  name: string;
  load: () => Promise<void>;
  weight?: number;
}

export class ResourceLoader {
  private tasks: LoadingTask[] = [];
  private progress = 0;
  private onProgressCallback?: (progress: number) => void;

  addTask(name: string, load: () => Promise<void>, weight = 1) {
    this.tasks.push({ name, load, weight });
  }

  onProgress(callback: (progress: number) => void) {
    this.onProgressCallback = callback;
  }

  private updateProgress(completedWeight: number, totalWeight: number) {
    this.progress = Math.round((completedWeight / totalWeight) * 100);
    this.onProgressCallback?.(this.progress);
  }

  async loadAll(): Promise<void> {
    const totalWeight = this.tasks.reduce(
      (sum, task) => sum + (task.weight || 1),
      0
    );
    let completedWeight = 0;

    for (const task of this.tasks) {
      try {
        console.log(`🔄 Loading: ${task.name}`);
        await task.load();
        completedWeight += task.weight || 1;
        this.updateProgress(completedWeight, totalWeight);
        console.log(`✅ Loaded: ${task.name}`);
      } catch (error) {
        console.error(`❌ Failed to load: ${task.name}`, error);
        completedWeight += task.weight || 1;
        this.updateProgress(completedWeight, totalWeight);
      }
    }
  }

  reset() {
    this.tasks = [];
    this.progress = 0;
  }
}