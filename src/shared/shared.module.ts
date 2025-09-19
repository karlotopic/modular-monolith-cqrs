import { Global, Module } from '@nestjs/common';
import { UUIDProvider } from './uuid.provider';
import { JWtProvider } from './jwt.provider';
import { CryptoProvider } from './crypto.provider';

@Global()
@Module({
  providers: [
    {
      provide: 'IUUIDProvider',
      useClass: UUIDProvider,
    },
    {
      provide: 'IJwtProvider',
      useClass: JWtProvider,
    },
    {
      provide: 'ICryptoProvider',
      useClass: CryptoProvider,
    },
  ],
  exports: ['IUUIDProvider', 'IJwtProvider', 'ICryptoProvider'],
})
export class SharedModule {}
