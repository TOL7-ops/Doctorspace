import React from 'react';
import Image from 'next/image';

interface PromotionalBannerProps {
  title: string;
  discount: string;
  imageUrl?: string;
}

export function PromotionalBanner({ title, discount, imageUrl }: PromotionalBannerProps) {
  return (
    <div className="mx-4 mb-6 bg-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center">
        <div className="p-4 flex-1">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-gray-600 mb-3">{discount} off</p>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
            Buy now
          </button>
        </div>
        <div className="w-1/2 h-32 relative bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 