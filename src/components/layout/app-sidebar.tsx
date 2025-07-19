import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
import { useAuthStore } from '@/stores/authStore'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.auth.user)
  const userRoles = user?.role || []
  // allowedRoles filtresi
  const filteredNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      !item.allowedRoles || item.allowedRoles.some((role) => userRoles.includes(role))
    ),
  })).filter((group) => group.items.length > 0)
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
