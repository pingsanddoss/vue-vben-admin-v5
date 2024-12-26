<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';

import { useAccess } from '@vben/access';
import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';

import { Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';
import { columns, querySchema } from '#/views/sms/salary/sendlist/data';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  // 日期选择格式化
  fieldMappingTime: [
    [
      'createTime',
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    // trigger: 'row',
    checkMethod: ({ row }) => row.roleId !== 1,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await requestClient.get<any>('sys/sendList/list', {
          params: {
            ...formValues,
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          },
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'roleId',
  },
  id: 'system-role-index',
};

const checked = ref(false);
function tableCheckboxEvent(checked: Ref<boolean>) {
  const event: (params: any) => void = (params) => {
    checked.value = params.$table.getCheckboxRecords().length > 0;
  };
  return event;
}
const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: tableCheckboxEvent(checked),
    checkboxAll: tableCheckboxEvent(checked),
  },
});

function handleAdd() {
  // drawerApi.setData({});
  // drawerApi.open();
}

function queryTodaySend() {
  requestClient.post('sys/sendList/queryTodaySend').then(() => {
    tableApi.query();
  });
}

function queryYestodaySend() {
  requestClient.post('sys/sendList/queryYestodaySend').then(() => {
    tableApi.query();
  });
}

async function handleEdit() {
  // drawerApi.setData({ id: record.roleId });
  // drawerApi.open();
}

async function handleDelete() {
  // await requestClient.delete<void>(`${Api.root}/${roleIds}`);
  // row.roleId;
  await tableApi.query();
}

function handleMultiDelete() {
  // const rows = tableApi.grid.getCheckboxRecords();
  // const ids = rows.map((row: any) => row.roleId);
  // Modal.confirm({
  //   title: '提示',
  //   okType: 'danger',
  //   content: `确认删除选中的${ids.length}条记录吗？`,
  //   onOk: async () => {
  //     await requestClient.delete<void>(`${Api.root}/${roleIds}`);
  //     ids;
  //     await tableApi.query();
  //     checked.value = false;
  //   },
  // });
}

// function handleDownloadExcel() {
//   commonDownloadExcel(roleExport, '角色数据', tableApi.formApi.form.values, {
//     fieldMappingTime: formOptions.fieldMappingTime,
//   });
// }

const { hasAccessByRoles } = useAccess();

const isSuperAdmin = computed(() => hasAccessByRoles(['superadmin']));

const [RoleAuthModal] = useVbenModal({});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="工资发送记录">
      <template #toolbar-tools>
        <Space>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            @click="handleMultiDelete"
          >
            删除
          </a-button>
          <a-button type="primary" @click="handleAdd"> 添加 </a-button>
          <a-button type="primary" @click="queryTodaySend">
            更新今日短信状态
          </a-button>
          <a-button type="primary" @click="queryYestodaySend">
            更新昨日短信状态
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <!-- 租户管理员不可修改admin角色 防止误操作 -->
        <!-- 超级管理员可通过租户切换来操作租户管理员角色 -->
        <template
          v-if="!row.superAdmin && (row.roleKey !== 'admin' || isSuperAdmin)"
        >
          <Space>
            <a-button @click.stop="handleEdit()"> 编辑 </a-button>
            <Popconfirm
              placement="left"
              title="确认删除？"
              @confirm="handleDelete()"
            >
              <a-button danger @click.stop=""> 删除 </a-button>
            </Popconfirm>
          </Space>
          <!--          <Dropdown-->
          <!--            placement="bottomRight"-->
          <!--          >-->
          <!--            <template #overlay>-->
          <!--              <Menu>-->
          <!--                <MenuItem key="1" @click="handleAuthEdit(row)">-->
          <!--                  数据权限-->
          <!--                </MenuItem>-->
          <!--                <MenuItem key="2" @click="handleAssignRole(row)">-->
          <!--                  分配用户-->
          <!--                </MenuItem>-->
          <!--              </Menu>-->
          <!--            </template>-->
          <!--            <a-button size="small" type="link">-->
          <!--              {{ $t('pages.common.more') }}-->
          <!--            </a-button>-->
          <!--          </Dropdown>-->
        </template>
      </template>
    </BasicTable>
    <!--    <RoleDrawer @reload="tableApi.query()" />-->
    <RoleAuthModal @reload="tableApi.query()" />
  </Page>
</template>
