import type { VxeGridProps } from '#/adapter/vxe-table';

/**
 * authScopeOptions user也会用到
 */
export const authScopeOptions = [
  { color: 'green', label: '全部数据权限', value: '1' },
  { color: 'default', label: '自定数据权限', value: '2' },
  { color: 'orange', label: '本部门数据权限', value: '3' },
  { color: 'cyan', label: '本部门及以下数据权限', value: '4' },
  { color: 'error', label: '仅本人数据权限', value: '5' },
];

export const querySchema: any = () => [
  {
    component: 'Input',
    fieldName: 'roleName',
    label: '发薪类型',
  },
  {
    component: 'Input',
    fieldName: 'roleKey',
    label: '发薪时间',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '发薪类型',
    field: 'sendType',
  },
  {
    title: '发薪时间',
    field: 'sendDate',
  },
  {
    title: '发薪方式',
    field: 'sendState',
  },
  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 180,
  },
];

export const drawerSchema: any = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'roleId',
    label: '角色ID',
  },
  {
    component: 'Input',
    fieldName: 'roleName',
    label: '角色名称',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'roleKey',
    help: '如: test simpleUser等',
    label: '权限标识',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'roleSort',
    label: '角色排序',
    rules: 'required',
  },
  {
    component: 'Select',
    defaultValue: '0',
    fieldName: 'status',
    help: '修改后, 拥有该角色的用户将自动下线.',
    label: '角色状态',
    rules: 'required',
  },
  {
    component: 'Radio',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'menuCheckStrictly',
    label: '菜单权限',
  },
  {
    component: 'Input',
    defaultValue: [],
    fieldName: 'menuIds',
    label: '菜单权限',
  },
  {
    component: 'Textarea',
    defaultValue: '',
    fieldName: 'remark',
    formItemClass: 'items-baseline',
    label: '备注',
  },
];
