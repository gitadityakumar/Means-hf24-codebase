import * as crypto from 'crypto';

const algorithm: string = 'aes-256-cbc';
const secretKey: Buffer = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY as string).digest(); 
const iv: Buffer = crypto.randomBytes(16); 

export interface EncryptedData {
  iv: string;
  encryptedData: string;
}

export function encrypt(text: string): EncryptedData {
  const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted: Buffer = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
}

export function decrypt(encryptedData: EncryptedData): string {
  const iv: Buffer = Buffer.from(encryptedData.iv, 'hex');
  const encryptedText: Buffer = Buffer.from(encryptedData.encryptedData, 'hex');
  const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted: Buffer = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function isEncryptedData(obj: any): obj is EncryptedData {
  return typeof obj === 'object' &&
         obj !== null &&
         'iv' in obj &&
         'encryptedData' in obj &&
         typeof obj.iv === 'string' &&
         typeof obj.encryptedData === 'string';
}
