import{r as i,j as e}from"./iframe-Bo-WdEom.js";import{L as o,a as c,W as d,b as l,c as p,d as u,e as m}from"./WorkspaceSwitch-DJJK1YXh.js";import"./utils-E_WBCbAh.js";import"./Breadcrumbs-D1GHny47.js";import"./dropdown-menu-D1MXJlLR.js";const S={component:i.Fragment,title:"Example/LayoutSidebarHeader"},r={args:{children:e.jsx(o,{sidebar:{header:{title:"Acme Inc",subtitle:"Enterprise",icon:e.jsx(c,{})}}})}},a={args:{children:e.jsx(o,{sidebar:{header:{title:"Acme Inc"}}})}},s={args:{children:e.jsx(o,{sidebar:{header:{subtitle:"Enterprise"}}})}},n={args:{children:e.jsx(o,{sidebar:{header:{title:"Acme Inc",subtitle:"Free plan"}}})}},t={args:{children:e.jsx(d,{workspaces:[{name:"Acme Inc",logo:c,plan:"Enterprise"}],children:e.jsx(l,{children:e.jsx(p,{children:e.jsx(u,{children:e.jsx(m,{})})})})})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Layout sidebar={{
      header: {
        title: 'Acme Inc',
        subtitle: 'Enterprise',
        icon: <LifeBuoy />
      }
    }} />
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Layout sidebar={{
      header: {
        title: 'Acme Inc'
      }
    }} />
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Layout sidebar={{
      header: {
        subtitle: 'Enterprise'
      }
    }} />
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Layout sidebar={{
      header: {
        title: 'Acme Inc',
        subtitle: 'Free plan'
      }
    }} />
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <WorkspacesProvider workspaces={[{
      name: 'Acme Inc',
      logo: LifeBuoy,
      plan: 'Enterprise'
    }]}>
        <LayoutBase>
          <LayoutSidebar>
            <LayoutSidebarHeader>
              <WorkspaceSwitch />
            </LayoutSidebarHeader>
          </LayoutSidebar>
        </LayoutBase>
      </WorkspacesProvider>
  }
}`,...t.parameters?.docs?.source}}};const x=["TitleAndSubtitleAndIcon","TitleOnly","SubTitleOnly","NoIcon","CustomContent"];export{t as CustomContent,n as NoIcon,s as SubTitleOnly,r as TitleAndSubtitleAndIcon,a as TitleOnly,x as __namedExportsOrder,S as default};
