export class GoogleAuthDto {
  idToken!: string;
}

export class MeResponseDto {
  id!: string;
  email!: string | null;
  name!: string | null;
}
