import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
}

// Local Disk Storage Provider
class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  private async ensureDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    await this.ensureDir();

    const ext = path.extname(filename) || '.webp';
    const randomHex = crypto.randomBytes(8).toString('hex');
    const sanitizedBase = path
      .basename(filename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}-${sanitizedBase || 'img'}-${randomHex}${ext}`;
    const destinationPath = path.join(this.uploadDir, uniqueFilename);

    await fs.writeFile(destinationPath, file);

    return {
      url: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
      size: file.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith('/uploads/')) return false;
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Cloudinary Storage Provider (if env keys provided)
class CloudinaryStorageProvider implements StorageProvider {
  private cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  private apiKey = process.env.CLOUDINARY_API_KEY || '';
  private apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  async upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      // Fallback to local if credentials missing
      const fallback = new LocalStorageProvider();
      return fallback.upload(file, filename, mimeType);
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureString = `timestamp=${timestamp}${this.apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file)], { type: mimeType });
    formData.append('file', blob, filename);
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', 'ilan_vitrini');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url || data.url,
      filename: data.public_id,
      size: data.bytes || file.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    // Cloudinary delete can be implemented using admin API / signature
    return true;
  }
}

// Factory to select active storage provider
export function getStorageProvider(): StorageProvider {
  const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  if (provider === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
    return new CloudinaryStorageProvider();
  }

  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
