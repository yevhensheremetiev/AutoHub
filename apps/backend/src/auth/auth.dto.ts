export class MeResponseDto {
  id!: string;
  email!: string | null;
  name!: string | null;
  passwordSignInEnabled!: boolean;
  accountType!: 'DRIVER' | 'SERVICE';
  serviceId!: string | null;
}
