import{j as a}from"./iframe-Bo-WdEom.js";import{useMDXComponents as o}from"./index-DbUQGWjt.js";import{M as r,C as s}from"./blocks-DGVFI1Wd.js";import{Default as c,WithToolbarAndFooter as u,Custom as l}from"./DataTable.stories-CD3v3IJt.js";import"./dropdown-menu-D1MXJlLR.js";import"./utils-E_WBCbAh.js";import"./useBaseQuery-Dgp7-YvS.js";function t(n){const e={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...o(),...n.components};return a.jsxs(a.Fragment,{children:[a.jsx(r,{title:"DataTable"}),`
`,a.jsx(e.h1,{id:"datatable",children:"DataTable"}),`
`,a.jsx(e.h2,{id:"installation",children:"Installation"}),`
`,a.jsx(e.pre,{children:a.jsx(e.code,{className:"language-bash",children:`npx shadcn add https://raw.githubusercontent.com/Shadcn-Blocks/shadcn-admin-blocks/refs/heads/main/public/r/DataTable.json
`})}),`
`,a.jsx(e.h2,{id:"usage",children:"Usage"}),`
`,a.jsx(e.p,{children:"Using static data source You can create table in following way:"}),`
`,a.jsx(e.pre,{children:a.jsx(e.code,{className:"language-jsx",children:`const datasource = new StaticDataSource({ users: usersDataMock })
const query = Q.select().from('users')

<DataTable
    datasource={datasource}
    query={query}
    columns={[
        {accessorKey:'status'},
        {accessorKey:'email'},
        {accessorKey:'amount',type:'number'}
    ]}
/>
`})}),`
`,a.jsx(s,{of:c}),`
`,a.jsx(e.p,{children:"Or You can specify the composition of the table:"}),`
`,a.jsx(e.pre,{children:a.jsx(e.code,{className:"language-jsx",children:`const datasource = new StaticDataSource({ users: usersDataMock })
const query = Q.select().from('users')

<DataTable
    datasource={datasource}
    query={query}
    columns={[
        {accessorKey:'status'},
        {accessorKey:'email'},
        {accessorKey:'amount',type:'number'}
    ]}
>
    <DataTableToolbar />
    <DataTableContent />
    <DataTableFooter />
</DataTable>
`})}),`
`,a.jsx(s,{of:u}),`
`,a.jsx(e.p,{children:"Or You can build Your custom layout:"}),`
`,a.jsx(e.pre,{children:a.jsx(e.code,{className:"language-jsx",children:`const datasource = new StaticDataSource({ users: usersDataMock })
const query = Q.select().from('users')

<DataTable
    datasource={datasource}
    query={query}
    columns={[
        {accessorKey:'status'},
        {accessorKey:'email'},
        {accessorKey:'amount',type:'number'}
    ]}
>
    <hr />
    Page Switcher:
    <DataTablePageSwitcher />
    <hr />
    Content:
    <br />
    <DataTableContent />
    <hr />
    Pagination:
    <DataTablePagination />
    <hr />
</DataTable>
`})}),`
`,a.jsx(s,{of:l})]})}function j(n={}){const{wrapper:e}={...o(),...n.components};return e?a.jsx(e,{...n,children:a.jsx(t,{...n})}):t(n)}export{j as default};
