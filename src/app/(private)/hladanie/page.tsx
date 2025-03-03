// jakub-aplikacia-prax/src/app/hladanie/page.tsx
import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: 'Hľadanie | ZoškaSnap'
};

export default function SearchPage() {
  return <SearchPageClient />;
}