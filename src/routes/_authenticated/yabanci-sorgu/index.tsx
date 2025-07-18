import { createFileRoute } from '@tanstack/react-router'
import YabanciSorgu from '@/modules/yabanci-sorgu'
export const Route = createFileRoute('/_authenticated/yabanci-sorgu/')({
  component: YabanciSorgu,
})