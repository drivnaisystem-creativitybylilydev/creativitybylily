export type MockProduct = {
  id: string;
  title: string;
  price: number;
  image: string; // path under /public
  description: string;
  tags?: string[];
};

export const mockProducts: MockProduct[] = [
  {
    id: "sample-1",
    title: "Sample Product One",
    price: 48,
    image: "/sample/1.jpg",
    description: "A beautifully crafted item to showcase layout and styling.",
    tags: ["new", "bestseller"],
  },
  {
    id: "sample-2",
    title: "Sample Product Two",
    price: 62,
    image: "/sample/2.jpg",
    description: "Clean, modern, and minimal—perfect for hero and grid demos.",
    tags: ["featured"],
  },
  {
    id: "sample-3",
    title: "Sample Product Three",
    price: 39,
    image: "/sample/3.jpg",
    description: "Showcases responsive cards, hover states, and typography.",
  },
  {
    id: "sample-4",
    title: "Sample Product Four",
    price: 80,
    image: "/sample/4.jpg",
    description: "Demonstrates object-fit imagery and consistent spacing scale.",
  },
];


