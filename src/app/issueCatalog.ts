export interface PublishedIssue {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  volume: string;
  cover: string;
  category: string;
  theme: string;
  pages: number;
  editors: string;
}

export const publishedIssues: PublishedIssue[] = [
  {
    id: "spring-2024",
    title: "वसंत विशेषांक",
    subtitle: "Spring Special Edition",
    year: "2024",
    volume: "Vol. 12",
    cover: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&h=1080&fit=crop&auto=format",
    category: "Poetry",
    theme: "Nature & Poetry",
    pages: 48,
    editors: "Hindi Club Editorial Board",
  },
  {
    id: "diwali-2023",
    title: "दीपावली अंक",
    subtitle: "Diwali Edition",
    year: "2023",
    volume: "Vol. 11",
    cover: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&h=1080&fit=crop&auto=format",
    category: "Festivals",
    theme: "Festivals & Tradition",
    pages: 56,
    editors: "Hindi Club Editorial Board",
  },
  {
    id: "independence-2023",
    title: "स्वतंत्रता अंक",
    subtitle: "Independence Edition",
    year: "2023",
    volume: "Vol. 10",
    cover: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=1080&fit=crop&auto=format",
    category: "History & Heritage",
    theme: "History & Pride",
    pages: 64,
    editors: "Hindi Club Editorial Board",
  },
];
