import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('voucher.title'),
    },
    name: 'Sms',
    path: '/sms',
    children: [
      {
        meta: {
          title: $t('voucher.salary'),
        },
        name: 'Salary',
        path: '/sms/salary',
        component: () => import('#/views/sms/salary/salary/index.vue'),
      },
      {
        meta: {
          title: $t('voucher.salaryList'),
        },
        name: 'SalaryList',
        path: '/sms/salaryList',
        component: () => import('#/views/sms/salary/salarylist/index.vue'),
      },
      {
        meta: {
          title: $t('voucher.sendList'),
        },
        name: 'SendList',
        path: '/sms/sendList',
        component: () => import('#/views/sms/salary/sendlist/index.vue'),
      },
    ],
  },
];

export default routes;
