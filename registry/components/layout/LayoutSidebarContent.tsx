import { Link, useLocation, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { TooltipContent } from "@/components/ui/tooltip";
import { SidebarItem, useDynamicSidebar } from "@/hooks/useDynamicSidebar";
import { PropsWithChildren, useMemo } from "react";

/** Universal sidebar content component without params plumbing. */
export const LayoutSidebarContent = ({ children }: PropsWithChildren) => {
  const sidebarItems = useDynamicSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarItemComponent key={item.key} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {children && (
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
};

// --- utils ---
function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const withParams = escaped.replace(
    /\\\$[A-Za-z_][A-Za-z0-9_]*/g,
    "[^/]+"
  );
  return new RegExp(`^${withParams}$`);
}

function matchesPattern(pattern: string, pathname: string): boolean {
  return patternToRegex(pattern).test(pathname);
}

// --- components ---
const CollapsibleSidebarItem = ({ item }: { item: SidebarItem }) => {
  const { pathname } = useLocation();

  const defaultOpen = useMemo(() => {
    if (matchesPattern(item.url, pathname)) return true;
    return item.children.some((c) => matchesPattern(c.url, pathname));
  }, [item.url, item.children, pathname]);

  return (
    <Collapsible
      asChild
      className="group/collapsible"
      defaultOpen={defaultOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={
              item.title ? (
                <TooltipContent>{item.title}</TooltipContent>
              ) : undefined
            }
          >
            {item.icon}
            <span className="text-sm">{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.url}>
                <Link to={child.url}>
                  {({ isActive }) => (
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <span className="font-inherit">{child.title}</span>
                    </SidebarMenuSubButton>
                  )}
                </Link>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
  const params = useParams({ strict: false });
  if (item.children.length > 0) {
    return <CollapsibleSidebarItem item={item} />;
  }

  return (
    <SidebarMenuItem key={item.key}>
      <Link to={item.url} params={params}>
        {({ isActive }) => (
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          >
            <span>
              {item.icon}
              <span>{item.title}</span>
            </span>
          </SidebarMenuButton>
        )}
      </Link>
    </SidebarMenuItem>
  );
};