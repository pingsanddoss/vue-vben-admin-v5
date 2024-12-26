<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { Divider } from 'ant-design-vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

import { requestClient } from '#/api/request.js';

const emit = defineEmits(['next', 'send-info']);

// const { onImportXls } = useListPage({
//   designScope: 'user1-list',
//   tableProps: {
//     title: '用户列表',
//   },
//   importConfig: {
//     url: getImportUrl,
//   },`
// });
const sendDate = ref<any>(dayjs());
const sendType = ref<any>();
const options1 = ref<any>([
  {
    value: '工资',
    label: '工资',
  },
  {
    value: '奖金',
    label: '奖金',
  },
]);

const plainOptions = [
  { label: '短信', value: '1' },
  { label: '小程序', value: '2' },
  { label: '邮件', value: '3' },
];

const state = ref({
  value1: [],
});
const formState = ref<any>({ user: '' });
const dataSource = ref<any>([
  {
    id: '',
    key: '1',
    sendType: '胡彦斌',
  },
  {
    id: '',
    key: '2',
    sendType: 'sas',
  },
]);
const column1 = ref<any>([
  {
    title: '发薪类型',
    dataIndex: 'sendType',
    key: 'key',
    id: 'id',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
]);
const open = ref(false);

function handleFinish() {
  requestClient
    .post('/sys/smsGz/addDict', { sendType: formState.value.user })
    .then((res) => {
      // console.log(res);
      if (res === 'success') {
        requestClient.get('/sys/smsGz/getDict').then((res) => {
          // console.log(res);
          options1.value = [];
          for (const [i, re] of res.entries()) {
            re.key = i;
            options1.value.push({
              value: re.sendType,
              label: re.sendType,
            });
          }
          dataSource.value = res;
        });
      }
    });
}

const canSubmit = computed(() => {
  return (
    sendType.value !== undefined &&
    sendDate.value !== null &&
    state.value.value1.length > 0
  );
});

const editableData = reactive<any>({});

const edit = (key: any) => {
  editableData[key] = cloneDeep(
    dataSource.value.find((item: any) => key === item.key),
  );
};
const save = (key: any) => {
  requestClient
    .post('/sys/smsGz/updateDict', {
      id: editableData[key].id,
      sendType: editableData[key].sendType,
    })
    .then((res) => {
      if (res === 'success') {
        requestClient.get('/sys/smsGz/getDict').then((res) => {
          options1.value = [];
          for (const [i, re] of res.entries()) {
            re.key = i;
            options1.value.push({
              value: re.sendType,
              label: re.sendType,
            });
          }
          dataSource.value = res;
        });
      }
    });
  // Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
  delete editableData[key];
};
const cancel = (key: any) => {
  delete editableData[key];
};
const delete1 = (key: any) => {
  requestClient.post('/sys/smsGz/deleteDict', { id: key }).then((res) => {
    if (res === 'success') {
      requestClient.get('/sys/smsGz/getDict').then((res) => {
        options1.value = [];
        for (const [i, re] of res.entries()) {
          re.key = i;
          options1.value.push({
            value: re.sendType,
            label: re.sendType,
          });
        }
        dataSource.value = res;
      });
    }
  });
};

function open1() {
  open.value = true;
  requestClient.get('/sys/smsGz/getDict').then((res) => {
    options1.value = [];
    for (const [i, re] of res.entries()) {
      re.key = i;
      options1.value.push({
        value: re.sendType,
        label: re.sendType,
      });
    }
    dataSource.value = res;
  });
}

async function import1(params: any) {
  const formData = new window.FormData();
  const customFilename = params.name || 'file';

  if (params.filename) {
    formData.append(customFilename, params.file, params.filename);
  } else {
    formData.append(customFilename, params.file);
  }
  if (params.data) {
    Object.keys(params.data).forEach((key) => {
      const value = params.data![key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
        return;
      }

      formData.append(key, params.data[key]);
    });
  }
  await requestClient
    .post('/sys/smsGz/importExcelNew', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ignoreCancelToken: true,
      },
    })
    .then((fileInfo) => {
      // console.log(fileInfo);
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('send-info', {
        sendType: sendType.value,
        sendDate: sendDate.value.format('YYYY/MM'),
        sendState: state.value.value1,
      });
      // console.log(fileInfo);
      emit('next', { data: fileInfo });
    });

  // onImportXls(file);
  // emit('next');
}

requestClient.get('/sys/smsGz/getDict').then((res) => {
  // console.log(res);
  options1.value = [];
  for (const re of res) {
    options1.value.push({
      value: re.sendType,
      label: re.sendType,
    });
  }
});
</script>
<template>
  <div class="step1">
    <Divider />

    <div class="step1-form">
      <div class="company-info">
        <div class="company-info-item">
          <div class="label">发薪类型：</div>
          <div class="label-right">
            <a-select
              v-model:value="sendType"
              :options="options1"
              class="ant-select1"
              size="large"
              style="width: 332px"
            />
            <div class="label-set" @click="open1">设置</div>
          </div>
        </div>
        <div>
          <div class="company-info-item">
            <div class="label">发薪时间：</div>
            <div class="label-right">
              <a-date-picker
                v-model:value="sendDate"
                format="YYYY/MM"
                picker="month"
                size="large"
                style="width: 308px; height: 40px"
              />
            </div>
          </div>
          <div class="company-info-item">
            <div class="label">
              <span style="margin-right: 4px; color: rgb(250 100 0)">*</span>
              发送方式：
            </div>
            <div class="label-right">
              <a-checkbox-group
                v-model:value="state.value1"
                :options="plainOptions"
                name="checkboxgroup"
                style="width: 340px"
              />
            </div>
          </div>
        </div>
        <div
          class="flex justify-center"
          style="margin-top: 23px; margin-left: 150px"
        >
          <a-upload
            :custom-request="(file: any) => import1(file)"
            :show-upload-list="false"
            accept=".xls,.xlsx"
            name="file"
          >
            <a-button :disabled="!canSubmit" type="primary">
              上传工资表
            </a-button>
          </a-upload>
        </div>
        <div class="company-info-tip2">
          <div>
            <div class="info-tip1">
              <span style="margin-right: 4px; color: rgb(250 100 0)">*</span>
              <div>请上传Excel格式的工资表（需包含姓名和手机号)</div>
            </div>
            <div class="info-tip1" style="margin-top: 4px">
              <div style="margin-left: 10px">
                您可以上传自定义模板；没有模板？
              </div>
              <a
                href="/static/工资模版.xlsx"
                style="color: #3d7fff; cursor: pointer"
              >
                点击下载
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:open="open" :footer="null" title="提示">
      <a-form :model="formState" layout="inline" @finish="handleFinish">
        <a-form-item>
          <a-input v-model:value="formState.user" placeholder="请输入类型" />
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="formState.user === ''"
            html-type="submit"
            type="primary"
          >
            添加
          </a-button>
        </a-form-item>
      </a-form>

      <a-table :columns="column1" :data-source="dataSource" bordered>
        <template #bodyCell="{ column, text, record }">
          <template v-if="['sendType'].includes(column.dataIndex)">
            <div>
              <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="width: 200px; margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.key]">
                <a @click="save(record.key)">保存</a>
                <a-popconfirm title="确定取消?" @confirm="cancel(record.key)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(record.key)">编辑</a>
                <a-popconfirm title="确定删除?" @confirm="delete1(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.step1 {
  height: 75vh;
  background-color: hsl(var(--background));
  h3 {
    margin: 0 0 12px;
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    font-size: 14px;
    line-height: 22px;
  }

  p {
  }
}

.pay-select {
  width: 20%;
}

.pay-input {
  width: 70%;
}

.company-info {
  align-items: center;
}
.company-info-item {
  margin-top: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.company-info-tip2 {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #1f1f1f;
  line-height: 20px;
  margin-left: 13%;
}
.info-tip1 {
  color: #999;
  display: flex;
}
.label {
  width: 41%;
  margin-right: 16px;
  text-align: right;
  font-size: 14px;
  font-weight: 400;
}
.label-right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 340px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #1f1f1f;
}
.label-set {
  color: #3d7fff;
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  white-space: nowrap;
  display: block;
  unicode-bidi: isolate;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>
