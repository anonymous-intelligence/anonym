import { createLazyFileRoute } from '@tanstack/react-router'
import Apps from '@/modules/apps'

export const Route = createLazyFileRoute('/_authenticated/apps/')({
  component: Apps,
})
