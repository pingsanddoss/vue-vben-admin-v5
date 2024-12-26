<script lang="ts" setup>
import { ref } from 'vue';

import { notification } from 'ant-design-vue';
import { cloneDeep, size } from 'lodash-es';

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
  sendInfo1: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['next', 'prev']);
const value1 = ref();
const value2 = ref();
const value3 = ref();
const value4 = ref();
const dataSource = ref<any>([
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]);

const columns = ref<any>([
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]);
const options1 = ref([
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);

const options2 = ref([
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);

const options3 = ref([
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);

const options4 = ref([
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);

const itemNew = ref();
function formSchema1() {
  // props.info.result[0]
  options1.value = [];
  options2.value = [];
  options3.value = [];
  options4.value = [];
  value1.value = '';
  value2.value = '';
  value3.value = '';
  value4.value = '';

  columns.value = [];
  dataSource.value = [];
  for (const key in props.info.data[0]) {
    const value = props.info.data[0][key];
    options1.value.push({
      value: key,
      label: value,
    });
    options2.value.push({
      value: key,
      label: value,
    });
    options3.value.push({
      value: key,
      label: value,
    });
    options4.value.push({
      value: key,
      label: value,
    });
    if ('人员姓名'.includes(props.info.data[0][key])) {
      value1.value = key;
    }
    if ('手机号'.includes(props.info.data[0][key])) {
      value2.value = key;
    }
    if ('实发工资'.includes(props.info.data[0][key])) {
      value3.value = key;
    }
    if ('邮箱'.includes(props.info.data[0][key])) {
      value4.value = key;
    }
  }

  columns.value.push({
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  });
  for (const key in props.info.data[0]) {
    const value = props.info.data[0][key];
    columns.value.push({
      title: value,
      dataIndex: key,
      key,
      width: 160,
    });
  }

  props.info.data[1].forEach((item: any, index: any) => {
    // itemNew.value = JSON.parse(JSON.stringify(item));
    itemNew.value = structuredClone(item);
    itemNew.value.id = index + 1;
    itemNew.value.key = index + 1;
    dataSource.value.push(itemNew.value);
  });
}

// on(() => {
//   console.log(props.info.result.value[0]);
// });

formSchema1();
async function customResetFunc() {
  emit('prev');
}

async function submitFunc() {
  if (value1.value === null || value2.value === null || value3.value === null) {
    notification.error({
      message: '有必填未填',
      description: '',
    });
    return null;
  }
  const clone = cloneDeep(props.info.data);
  const clone1 = cloneDeep(props.sendInfo1);
  const sendInfo1: any = {};
  sendInfo1.dataHead = clone[0];
  sendInfo1.dataBody = clone[1];
  sendInfo1.name = value1.value;
  sendInfo1.phone = value2.value;
  sendInfo1.salary = value3.value;
  sendInfo1.mail = value4.value;
  sendInfo1.sendType = clone1.sendType;
  sendInfo1.sendDate = clone1.sendDate;
  sendInfo1.sendState = clone1.sendState;

  emit('next', sendInfo1);
}
</script>
<template>
  <div style="height: 75vh; background-color: hsl(var(--background))">
    <div class="flex">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-class-name="
          (_record: any, index: any) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :scroll="{
          scrollToFirstRowOnChange: true,
          x: 'max-content',
          y: '300px',
        }"
        bordered
        class="ant-table-striped flex-1 overflow-hidden"
        size="small"
      />
    </div>
    <div class="body-foot">
      <div class="body-foot-tip">
        <div>匹配工资数据</div>
      </div>
      <div class="company-info-item">
        <div class="tip3" style="margin-left: 60px">*</div>
        <div class="label">员工姓名：</div>
        <a-select
          v-model:value="value1"
          :options="options1"
          style="width: 150px"
        />
        <div class="tip3">*</div>
        <div class="label">手机号：</div>
        <a-select
          v-model:value="value2"
          :options="options2"
          :size="size"
          style="width: 150px"
        />
        <div class="tip3">*</div>
        <div class="label">实发工资：</div>
        <a-select
          v-model:value="value3"
          :options="options3"
          style="width: 150px"
        />
        <div class="tip3"></div>
        <div class="label">邮箱：</div>
        <a-select
          v-model:value="value4"
          :options="options4"
          style="width: 150px"
        />
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 20px">
      <a-button class="md:ml-6" type="primary" @click="customResetFunc">
        上一步
      </a-button>
      <a-button class="md:ml-6" type="primary" @click="submitFunc">
        下一步
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: hsl(var(--border));
}

.body-foot {
  padding-bottom: 24px;
  border: 1px solid hsl(var(--border));
  border-radius: 3px;
  box-shadow: 0 2px 8px 0 rgb(31 50 98 / 12%);
}

.company-info-item {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.body-foot-tip {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 500;
}

.tip3 {
  margin-top: 8px;
  margin-right: 4px;
  margin-left: 60px;
  color: #f6404e;
}

.label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
}
</style>
