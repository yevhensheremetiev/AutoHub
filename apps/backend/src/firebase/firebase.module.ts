import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

export const FIREBASE_ADMIN = Symbol('FIREBASE_ADMIN');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FIREBASE_ADMIN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const serviceAccountJson = config.get<string>(
          'FIREBASE_SERVICE_ACCOUNT_JSON',
        );

        if (serviceAccountJson) {
          const credential = admin.credential.cert(
            JSON.parse(serviceAccountJson),
          );
          return admin.initializeApp({ credential });
        }

        const serviceAccountPath = config.get<string>(
          'GOOGLE_APPLICATION_CREDENTIALS',
        );
        if (serviceAccountPath) {
          const raw = readFileSync(serviceAccountPath, 'utf8');
          const credential = admin.credential.cert(JSON.parse(raw));
          return admin.initializeApp({ credential });
        }

        return admin.initializeApp();
      },
    },
  ],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseModule {}
