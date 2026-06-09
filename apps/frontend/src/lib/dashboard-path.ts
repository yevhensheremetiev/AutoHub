import type { UserDto } from '@autohub/shared';

export function getDashboardPath(
  accountType: UserDto['accountType'] = 'DRIVER',
): string {
  return accountType === 'SERVICE' ? '/service-dashboard' : '/dashboard';
}
