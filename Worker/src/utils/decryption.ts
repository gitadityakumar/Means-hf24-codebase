import * as crypto from 'crypto';

const algorithm: string = 'aes-256-cbc';
const secretKey: Buffer = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY as string).digest(); 
const iv: Buffer = crypto.randomBytes(16); 


export interface EncryptedData {
  iv: string;
  encryptedData: string;
}



export function decrypt(encryptedData: EncryptedData): string {
  const iv: Buffer = Buffer.from(encryptedData.iv, 'hex');
  const encryptedText: Buffer = Buffer.from(encryptedData.encryptedData, 'hex');
  const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted: Buffer = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}