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
              {
                path: '/accounts/article',
                name: '文章',
                icon: 'user',
                component: './accounts/Article',
                // authority: ['admin'],
                // hideInMenu: true,
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
