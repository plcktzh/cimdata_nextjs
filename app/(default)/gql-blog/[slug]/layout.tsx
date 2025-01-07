import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default function layout({ children }: Props) {
  return (
    <>
      {children}
      <Link href="/blog">Zurück zum Blog</Link>
    </>
  );
}
