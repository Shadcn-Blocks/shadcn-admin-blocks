import{j as e}from"./iframe-Bo-WdEom.js";import{u as c,Q as i,d as b}from"./useBaseQuery-Dgp7-YvS.js";import{B as t}from"./Breadcrumbs-D1GHny47.js";import"./utils-E_WBCbAh.js";function o(l,n){return c({...l,enabled:!0,suspense:!0,throwOnError:b,placeholderData:void 0},i)}const y={component:e.Fragment,title:"Example/Breadcrumbs"},r={args:{children:e.jsx(t,{items:[{href:"/",label:"Home",isClickable:!0},{href:"/about",label:"About",isClickable:!0},{href:"/contact",label:"Contact",isClickable:!1}]})}},a=({delay:l})=>(o({queryKey:["delayed-crumb",l],queryFn:async()=>(await new Promise(n=>setTimeout(n,l)),"Tada!")}),e.jsxs(e.Fragment,{children:[l,"ms"]})),s={args:{children:e.jsx(t,{items:[{href:"/",label:e.jsx(a,{delay:1e3}),isClickable:!0},{href:"/about",label:e.jsx(a,{delay:2e3}),isClickable:!0},{href:"/contact",label:e.jsx(a,{delay:3e3}),isClickable:!1},{href:"/contact",label:e.jsx(a,{delay:4e3}),isClickable:!1},{href:"/contact",label:e.jsx(a,{delay:5e3}),isClickable:!1},{href:"/contact",label:e.jsx(a,{delay:6e3}),isClickable:!1},{href:"/contact",label:e.jsx(a,{delay:12e3}),isClickable:!1},{href:"/contact",label:e.jsx(a,{delay:3e4}),isClickable:!1}]})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: <BreadcrumbsBase items={[{
      href: '/',
      label: 'Home',
      isClickable: true
    }, {
      href: '/about',
      label: 'About',
      isClickable: true
    }, {
      href: '/contact',
      label: 'Contact',
      isClickable: false
    }]} />
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <BreadcrumbsBase items={[{
      href: '/',
      label: <DelayedCrumb delay={1000} />,
      isClickable: true
    }, {
      href: '/about',
      label: <DelayedCrumb delay={2000} />,
      isClickable: true
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={3000} />,
      isClickable: false
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={4000} />,
      isClickable: false
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={5000} />,
      isClickable: false
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={6000} />,
      isClickable: false
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={12000} />,
      isClickable: false
    }, {
      href: '/contact',
      label: <DelayedCrumb delay={30000} />,
      isClickable: false
    }]} />
  }
}`,...s.parameters?.docs?.source}}};const C=["Static","DynamicWithSuspense"];export{s as DynamicWithSuspense,r as Static,C as __namedExportsOrder,y as default};
