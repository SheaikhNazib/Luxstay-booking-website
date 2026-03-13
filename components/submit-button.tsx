'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
}

export function SubmitButton({
  idleLabel,
  pendingLabel,
  className,
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending || disabled}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}