export const APPLICATION_STATUSES = [
  'wishlist',
  'applied',
  'interview',
  'offer',
  'rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ApplicationStatusMeta {
  label: string;
  color: string;
}

export const APPLICATION_STATUS_META: Record<
  ApplicationStatus,
  ApplicationStatusMeta
> = {
  wishlist: { label: 'Wishlist', color: 'slate' },
  applied: { label: 'Applied', color: 'blue' },
  interview: { label: 'Interview', color: 'amber' },
  offer: { label: 'Offer', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}
