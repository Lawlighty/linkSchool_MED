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
            redirect: '/dashboard/analyze',
          },
          // {
          //   path: '/welcome',
          //   name: 'welcome',
          //   icon: 'smile',
          //   component: './Welcome',
          // },
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
            path: '/tags',
            name: '标签',
            icon: 'tag',
            component: './tags/index',
          },
          {
            path: '/categorys',
            name: '分类',
            icon: 'paperClip',
            component: './category/index',
          },
          {
            path: '/courses',
            name: '课程',
            icon: 'desktop',
            // component: './course/index',
            routes: [
              {
                path: '/courses',
                name: '课程列表',
                component: './course/index',
                // authority: ['admin'],
                // hideInMenu: true,
              },
              {
                path: '/courses/create',
                name: '新建课程',
                component: './course/CreateCourse',
                // authority: ['admin'],
                hideInMenu: true,
              },
              {
                path: '/courses/:id',
                name: '编辑课程',
                component: './course/CreateCourse',
                // authority: ['admin'],
                hideInMenu: true,
              },
              {
                path: '/courses/course/:id',
                name: '课时',
                component: './episode/index',
                // authority: ['admin'],
                hideInMenu: true,
              },
            ],
          },
          // {
          //   path: '/documents',
          //   name: '文档',
          //   icon: 'read',
          //   component: './documents/index',
          // },
          {
            path: '/documents',
            name: '文档',
            icon: 'read',
            routes: [
              {
                path: '/documents',
                name: '文档列表',
                component: './documents/index',
                // authority: ['admin'],
                // hideInMenu: true,
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
            ],
          },
          {
            path: '/questions',
            name: '问答',
            icon: 'questionCircle',
            routes: [
              {
                path: '/questions',
                name: '问答列表',
                component: './questions/index',
                // authority: ['admin'],
                // hideInMenu: true,
              },
              // {
              //   path: '/questions/create',
              //   name: '新建问答',
              //   component: './questions/Article',
              //   // authority: ['admin'],
              //   hideInMenu: true,
              // },
              // {
              //   path: '/questions/:id',
              //   name: '编辑问答',
              //   component: './questions/Article',
              //   // authority: ['admin'],
              //   hideInMenu: true,
              // },
            ],
          },

          {
            path: '/accounts',
            name: '用户',
            icon: 'usergroupAdd',
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
            path: '/account',
            name: '我的',
            icon: 'user',
            // component: './accounts/accounts',
            // authority: ['admin'],
            routes: [
              {
                path: '/account/center',
                name: '个人中心',
                icon: 'user',
                component: './accounts/AccountDetail/Center',
                // authority: ['admin'],
              },
              {
                path: '/account/settings',
                name: '个人设置',
                icon: 'user',
                component: './accounts/AccountSeeting/index',
                // authority: ['admin'],
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
          // {
          //   name: 'list.table-list',
          //   icon: 'table',
          //   path: '/list',
          //   component: './ListTableList',
          // },
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
