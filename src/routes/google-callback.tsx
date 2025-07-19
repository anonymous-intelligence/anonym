import { createFileRoute } from '@tanstack/react-router'
import GoogleCallback from '@/modules/auth/google-callback'

export const Route = createFileRoute('/google-callback')({
  component: GoogleCallback,
}) 