export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/dashboard',
            name: '仪表盘',
            icon: 'dashboard',
            component: './dashboard/Analyze',
            // authority: ['admin'],
            routes: [
              {
                path: '/dashboard/analyze',
                name: '分析页面',
                icon: 'smile',
                component: './dashboard/Analyze',
                // authority: ['admin'],
              },
            ],
          },
          {
            path: '/banners',
            name: '轮播图',
            icon: 'picture',
            component: './banner/index',
          },
          {
            path: '/documents',
            name: '文档',
            icon: 'read',
            component: './documents/index',
          },
          {
            path: '/documents/create',
            name: '新建文档',
            component: './documents/Article',
            // authority: ['admin'],
            hideInMenu: true,
          },
          {
            path: '/documents/:id',
            name: '编辑文档',
            component: './documents/Article',
            // authority: ['admin'],
            hideInMenu: true,
          },
          {
            path: '/tags',
            name: '标签',
            icon: 'tag',
            component: './tags/index',
          },
          {
            path: '/accounts',
            name: '用户',
            icon: 'user',
            // component: './accounts/accounts',
            // authority: ['admin'],
            routes: [
              {
                path: '/accounts/account-list',
                name: '学院用户',
                icon: 'user',
                component: './accounts/AccountsList',
                // authority: ['admin'],
              },
              {
                path: '/accounts/account-list/:id',
                name: '个人中心',
                icon: 'user',
                component: './accounts/AccountDetail/Center',
                // authority: ['admin'],
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            authority: ['admin'],
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin'],
              },
            ],
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: '/list',
            component: './ListTableList',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
