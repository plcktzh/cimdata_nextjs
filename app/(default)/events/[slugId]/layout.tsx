import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function EventLayout({ children }: Props) {
  return (
    <>
      <Link href='/events'>Zurück zu Events-Übersicht</Link>
      {children}
    </>
  );
}
