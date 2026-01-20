"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, User, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  currentImage?: string
  onImageChange?: (imageUrl: string) => void
  size?: "sm" | "md" | "lg"
}

export function ImageUpload({ currentImage, onImageChange, size = "md" }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
    }
    reader.readAsDataURL(file)

    // Simulate upload
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      // Simulate API call to upload service (Cloudinary, AWS S3, etc.)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would upload to your storage service
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const { url } = await response.json()

      // For demo purposes, we'll use the preview URL
      const mockUploadedUrl = previewImage || ""

      onImageChange?.(mockUploadedUrl)

      toast({
        title: "Image uploaded successfully",
        description: "Your profile image has been updated",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    onImageChange?.("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className={sizeClasses[size]}>
              <AvatarImage src={previewImage || undefined} alt="Profile" />
              <AvatarFallback>
                <User className="w-1/2 h-1/2" />
              </AvatarFallback>
            </Avatar>

            {previewImage && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="w-3 h-3" />
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              onClick={triggerFileSelect}
              disabled={isUploading}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="space-y-1">
              <Button
                variant="outline"
                onClick={triggerFileSelect}
                disabled={isUploading}
                className="w-full bg-transparent"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Supported formats: JPG, PNG, GIF</p>
              <p>Maximum size: 5MB</p>
              <p>Recommended: Square image, at least 200x200px</p>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </CardContent>
    </Card>
  )
}
