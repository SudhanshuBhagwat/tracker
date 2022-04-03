export interface Goal {
  id?: string;
  title: string;
  everyday?: boolean;
  weekly: string[];
  months?: number;
  isDone: boolean;
  createdAt: string;
  completed: string[];
}
