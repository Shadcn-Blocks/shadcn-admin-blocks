import{j as e}from"./iframe-Bo-WdEom.js";import{useMDXComponents as r}from"./index-DbUQGWjt.js";import{M as s,C as a}from"./blocks-DGVFI1Wd.js";import{Default as i,Customized as c}from"./Layout.stories-B4LftZcX.js";import"./dropdown-menu-D1MXJlLR.js";import"./utils-E_WBCbAh.js";import"./WorkspaceSwitch-DJJK1YXh.js";import"./Breadcrumbs-D1GHny47.js";function t(o){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",strong:"strong",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Layout"}),`
`,e.jsx(n.h1,{id:"layout",children:"Layout"}),`
`,e.jsxs(n.p,{children:["A composable and flexible layout system for admin panels and dashboards. Use ",e.jsx(n.code,{children:"LayoutBase"})," and individual building blocks for full control, or wrap ",e.jsx(n.code,{children:"WorkspacesProvider"})," and include ",e.jsx(n.code,{children:"WorkspaceSwitch"})," to enable workspace switching."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/Layout.json
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n.h3,{id:"-default-layout-without-workspace-switcher",children:"🧱 Default Layout Without Workspace Switcher"}),`
`,e.jsxs(n.p,{children:["By default, the ",e.jsx(n.code,{children:"Layout"})," component does ",e.jsx(n.strong,{children:"not"})," include an organization or workspace switcher on its own. It renders the sidebar header and footer based solely on the provided ",e.jsx(n.code,{children:"sidebar"})," configuration:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Layout
  sidebar={{
    header: {
      title: 'Dashboard',
      subtitle: 'Welcome back!',
      icon: <HouseIcon />,
    },
    footer: {
      signOut: () => alert('logging out'),
      user: {
        avatar: 'https://cat-avatars.vercel.app/api/cat?name=John%20Doe',
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    },
  }}
>
  I am content
</Layout>
`})}),`
`,e.jsx(a,{of:i}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"-layout-with-workspace-switcher",children:"🔧 Layout With Workspace Switcher"}),`
`,e.jsxs(n.p,{children:["To add workspace switching into your sidebar, simply include ",e.jsx(n.code,{children:"<WorkspaceSwitch />"})," inside your sidebar header. Your provider will already have the data from ",e.jsx(n.code,{children:"initialWorkspaces"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`
const workspacesData: Workspace[] = [
  { name: 'Acme Inc', logo: LifeBuoy, plan: 'Enterprise' },
  { name: 'Beta Co', logo: Send, plan: 'Pro' },
]

<WorkspacesProvider workspaces={workspacesData}>
  <LayoutBase>
    <LayoutSidebar>
      <LayoutSidebarHeader>
        <WorkspaceSwitch />
      </LayoutSidebarHeader>
      <LayoutSidebarContent>{/* bottom menu items */}</LayoutSidebarContent>
      <LayoutSidebarFooter user={user}>/* footer controls */</LayoutSidebarFooter>
    </LayoutSidebar>

    <SidebarInset>
      <LayoutHeader />
      <LayoutContent>I am content</LayoutContent>
    </SidebarInset>
  </LayoutBase>
</WorkspacesProvider>
`})}),`
`,e.jsx(a,{of:c})]})}function y(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(t,{...o})}):t(o)}export{y as default};
