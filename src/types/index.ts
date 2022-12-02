export interface Goal {
  id?: string;
  title: string;
  everyday?: boolean;
  weekly: string[];
  months: number;
  createdAt: string;
  completed: string[];
}

export interface Expense {
  id?: string;
  title: string;
  spent: string;
  months: number;
  category: number;
  other?: string;
  createdAt: string;
}

export interface Feedback {
  title: string;
  description: string;
}
