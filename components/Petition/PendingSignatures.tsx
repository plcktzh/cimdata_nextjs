import prisma from '@/prisma/db';
import SignatureToCheck from './SignatureToCheck';

export default async function PendingSignatures() {
  const signatures = [];

  if (!signatures.length) {
    return <h2>Keine ungeprüften Unterschriften</h2>;
  }

  return (
    <ul>
      {signatures.map(() => (
        <SignatureToCheck />
      ))}
    </ul>
  );
}
