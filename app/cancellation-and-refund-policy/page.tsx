import { redirect } from 'next/navigation';

export default function CancellationAndRefundRedirect() {
  redirect('/legal/refund-policy');
}
