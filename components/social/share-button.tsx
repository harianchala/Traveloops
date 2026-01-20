"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Facebook, Twitter, Mail, Link, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  title: string
  description?: string
  url?: string
  hashtags?: string[]
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function ShareButton({
  title,
  description = "",
  url,
  hashtags = [],
  size = "default",
  variant = "outline",
}: ShareButtonProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareText = `${title}${description ? ` - ${description}` : ""}`
  const hashtagString = hashtags.length > 0 ? ` ${hashtags.map((tag) => `#${tag}`).join(" ")}` : ""

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText + hashtagString)}`
        window.open(facebookUrl, "_blank", "width=600,height=400")
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags.join(",")}`
        window.open(twitterUrl, "_blank", "width=600,height=400")
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}${hashtagString}`)}`
        window.open(whatsappUrl, "_blank")
      },
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}${hashtagString}`)}`
        window.location.href = emailUrl
      },
    },
    {
      name: "Copy Link",
      icon: Link,
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          })
          setIsOpen(false)
        } catch (error) {
          toast({
            title: "Failed to copy",
            description: "Could not copy the link to clipboard.",
            variant: "destructive",
          })
        }
      },
    },
  ]

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== "undefined" && "share" in navigator

  const handleWebShare = async () => {
    if (!canUseWebShare) return

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      })
    } catch (error) {
      // User cancelled or error occurred
      console.log("Web share cancelled or failed:", error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canUseWebShare && (
          <DropdownMenuItem onClick={handleWebShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}
        {shareOptions.map((option) => (
          <DropdownMenuItem key={option.name} onClick={option.action}>
            <option.icon className="w-4 h-4 mr-2" />
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
