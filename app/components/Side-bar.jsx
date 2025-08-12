import * as React from "react";
import Link from "next/link";
import {
  BoxIcon,
  LayoutDashboard,
  Bolt,
  Package,
  ShoppingBag,
  NotepadText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: "dashboard",
        },
        {
          title: "Website Metadata's",
          icon: Bolt,
          url: "metadata",
        },
        {
          title: "Categories",
          icon: Package,
          url: "categories",
        },
        {
          title: "Products",
          icon: ShoppingBag,
          url: "products",
        },
        {
          title: "Blogs",
          icon: NotepadText,
          url: "blogs",
          isActive: true,
        },
      ],
    },
  ],
};

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className={"py-6 px-3 bg-gray-50 border-b"}>
        <div className="flex items-center gap-2 ">
          <BoxIcon className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className={"bg-gray-100"}>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent className={"!p-0"}>
              <SidebarMenu>
                {item.items.map((item, index) => {
                  let Icon = item.icon;
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        {/* <div className="flex items-center justify-start gap-2"> */}

                        <Link
                          href={item.url}
                          passHref
                          className="w-full flex items-center gap-2"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                        {/* </div> */}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
