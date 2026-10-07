'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Star, ArrowLeft, ArrowRight, Loader2, ImagePlus } from 'lucide-react';
import { ListingImageDTO } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface ImageUploaderProps {
  images: ListingImageDTO[];
  onChange: (images: ListingImageDTO[]) => void;
  maxImages?: number;
}

// Client-side canvas compression for high-resolution mobile camera photos
async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error, success } = useToast();

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    if (images.length + fileArray.length > maxImages) {
      error(`En fazla ${maxImages} fotoğraf ekleyebilirsiniz!`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImages: ListingImageDTO[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        // Validate type
        if (!file.type.startsWith('image/')) {
          error(`${file.name} geçerli bir resim dosyası değil.`);
          continue;
        }

        // Compress image client side
        const compressedBlob = await compressImage(file);
        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, '') + '.webp',
          { type: 'image/webp' }
        );

        // Upload to API
        const formData = new FormData();
        formData.append('file', compressedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Yükleme başarısız');
        }

        const data = await res.json();
        const currentTotal = images.length + uploadedImages.length;
        uploadedImages.push({
          url: data.url,
          sortOrder: currentTotal,
          isCover: currentTotal === 0, // first photo becomes cover by default
        });
      }

      if (uploadedImages.length > 0) {
        const newImages = [...images, ...uploadedImages];
        // Ensure at least one cover exists
        if (!newImages.some((img) => img.isCover) && newImages.length > 0) {
          newImages[0].isCover = true;
        }
        onChange(newImages);
        success(`${uploadedImages.length} adet görsel başarıyla yüklendi.`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Fotoğraf yüklenirken bir hata oluştu.';
      error(errorMsg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    const wasCover = newImages[index].isCover;
    newImages.splice(index, 1);

    // If removed image was cover, set the first remaining image as cover
    if (wasCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }

    // Re-index sortOrder
    const reindexed = newImages.map((img, idx) => ({ ...img, sortOrder: idx }));
    onChange(reindexed);
  };

  const handleSetCover = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isCover: idx === index,
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    // Re-index sortOrder
    const reindexed = newImages.map((img, idx) => ({ ...img, sortOrder: idx }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
        <span>Görseller ({images.length} / {maxImages})</span>
        <span className="text-[11px] text-gray-400">İlk görsel veya yıldızlı olan kapak fotoğrafıdır</span>
      </div>

      {/* Hidden File Input (supports mobile camera or gallery) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {/* Drag & Drop Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-dark-750 hover:border-brand-500/50 bg-dark-900/60 hover:bg-dark-900'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 text-brand-400">
              <Loader2 className="w-7 h-7 animate-spin mb-1.5" />
              <span className="text-xs font-semibold">Görseller optimize ediliyor ve yükleniyor...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-gray-400">
              <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center mb-2 text-brand-400 border border-dark-700">
                <ImagePlus className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-200">
                Fotoğraf seçin veya buraya sürükleyin
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Kamera, galeri veya dosyalardan 1-6 fotoğraf ekleyin (Maks. 1600px optimize edilir)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Images Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
          {images.map((img, idx) => (
            <div
              key={img.id || `${img.url}-${idx}`}
              className={`group relative aspect-[3/4] rounded-lg overflow-hidden border-2 bg-dark-950 shadow-md ${
                img.isCover ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-dark-750'
              }`}
            >
              <Image src={img.url} alt="Önizleme" fill className="object-cover" />

              {/* Cover Badge */}
              {img.isCover && (
                <div className="absolute top-1.5 left-1.5 z-10 bg-brand-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                  KAPAK
                </div>
              )}

              {/* Overlay Action Buttons */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                {/* Top Row: Make Cover & Delete */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCover(idx);
                    }}
                    title="Kapak Görseli Yap"
                    className={`p-1 rounded-md text-xs ${
                      img.isCover
                        ? 'bg-brand-500 text-white'
                        : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${img.isCover ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    title="Sil"
                    className="p-1 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Row: Move Left / Move Right */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'left');
                    }}
                    className="p-1 rounded-md bg-black/70 hover:bg-black text-white disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] font-bold text-white bg-black/60 px-1 rounded">
                    #{idx + 1}
                  </span>

                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'right');
                    }}
                    className="p-1 rounded-md bg-black/70 hover:bg-black text-white disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
