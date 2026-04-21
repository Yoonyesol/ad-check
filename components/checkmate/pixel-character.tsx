"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface PixelCharacterProps {
  className?: string
  mood?: 'neutral' | 'alert' | 'happy' | 'thinking'
  size?: 'sm' | 'md' | 'lg'
}

// 경찰서 이미지 컴포넌트
export function PixelCharacter({ className, mood = 'neutral', size = 'md' }: PixelCharacterProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LbIl8Jiw7S6reCybpr4lCTXwxEWSxc.png"
        alt="Checkmate 경찰서"
        fill
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}

// 경찰 캐릭터 이미지 컴포넌트
export function PixelOfficer({ className, mood = 'neutral', size = 'md' }: PixelCharacterProps) {
  const sizeClasses = {
    sm: 'w-10 h-14',
    md: 'w-16 h-24',
    lg: 'w-24 h-36'
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-idyppOT2NxMOgynxM3gxkAVsxPodie.png"
        alt="Checkmate 보안관"
        fill
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
