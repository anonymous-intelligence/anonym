import { createLazyFileRoute } from '@tanstack/react-router'
import SignUp from '@/modules/auth/sign-up'

export const Route = createLazyFileRoute('/(auth)/sign-up')({
  component: SignUp,
})
