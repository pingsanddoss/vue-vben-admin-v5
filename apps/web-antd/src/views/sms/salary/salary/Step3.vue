<script lang="ts" setup>
import { ref, watch } from 'vue';

import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

import { requestClient } from '#/api/request';

const prop = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
  sendInfo2: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['redo', 'prev', 'next']);
const nums = ref<any>();
const gonggao = ref<any>('');
const shifagz = ref<any>();
const info11 = ref<any>([]);

const checked1 = ref<any>(false);
const checked2 = ref<any>(false);
const checked3 = ref<any>(false);
const sendtime = ref<any>();
const value1 = ref<any>([]);
const value2 = ref<any>([]);
const value3 = ref<any>([]);
const options1 = ref<any>([
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

watch(
  gonggao,
  (count) => {
    nums.value = count.length;
  },
  { immediate: true, deep: true },
);

function addItem(check1: any) {
  info11.value = [];
  options1.value = [];
  for (const key in prop.info.data[0]) {
    const value = prop.info.data[0][key];
    options1.value.push({
      value: key,
      label: value,
    });
    const as = prop.info.data[1];

    const item = as[0];
    for (const key1 in item) {
      if (key1 === prop.sendInfo2.salary) {
        shifagz.value = item[key1];
      }
      if (key === key1) {
        if (check1) {
          if (item[key1] !== null) {
            info11.value.push({
              name: value,
              value: item[key1],
            });
          }
        } else {
          info11.value.push({
            name: value,
            value: item[key1],
          });
        }
      }
    }
  }
}

const sendSmsGzNew = (params: any): any => {
  return requestClient.post('/sys/smsGz/sendSmsGzNew', params).then(() => {
    // handleSuccess();
  });
};

const uploadSalary = async (type: any) => {
  if (checked2.value === true && gonggao.value === null) {
    notification.error({
      message: '公告内容未填',
      description: '',
    });
    return null;
  }
  if (checked3.value === true && sendtime.value === null) {
    notification.error({
      message: '定时时间未填',
      description: '',
    });
    return null;
  }
  const a = cloneDeep(prop.sendInfo2);
  a.hide = value1.value;
  a.showNull = checked1.value;
  a.showBroadcast = checked2.value;
  a.broadcastText = gonggao.value;
  a.showCron = checked3.value;
  a.cronText = sendtime.value;
  await sendSmsGzNew(a, emit(type));
};

function gaibian(value: any) {
  value3.value = [];
  for (const element of value) {
    for (const key in prop.info.data[0]) {
      if (key === element) {
        value3.value.push(prop.info.data[0][key]);
      }
    }
  }
  value2.value = value;
}

const disabledDate = (current: any) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const disabledDateTime = () => {
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  };
};

addItem();
</script>
<template>
  <div class="content-send">
    <div class="content-preview-send">
      <div class="phone-preview">
        <div>
          <div class="content">
            <div class="head1">
              <div class="head-title">
                {{ sendInfo2.sendDate.split('/')[0] }}年-{{
                  sendInfo2.sendDate.split('/')[1]
                }}月-{{ sendInfo2.sendType }}
              </div>
            </div>
            <div class="title">
              <div class="tip1">实发工资（元）</div>
              <div class="tip2">{{ shifagz }}</div>
              <div class="tip3">江苏白雪电器股份有限公司</div>
            </div>
            <div class="body">
              <div class="info-item1">
                <div class="tip"></div>
                <div class="tip-label">工资明细</div>
              </div>
              <template v-for="item in info11" :key="item.name">
                <template
                  v-if="
                    !value3.includes(item.name) &&
                    ((item.value != null && item.value !== '') || !checked1)
                  "
                >
                  <div class="info-item" style="justify-content: space-between">
                    <div class="tip4">{{ item.name }}</div>
                    <div class="tip4">{{ item.value }}</div>
                  </div>
                </template>
              </template>
              <template v-if="checked2">
                <div style="margin: 14px; font-size: 12px; color: #666">
                  公告：{{ gonggao }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
        style="width: 1px; height: 400px; background: rgb(230 230 233)"
      ></div>
      <div class="preview-set">
        <div class="preview-set-one">
          <div class="company-info-item2">
            <div class="tip-set"></div>
            <div class="tip-label-set">显示设置</div>
          </div>
          <div class="company-info-item">
            <span class="tip-label1">隐藏数据：</span>
            <a-select
              v-model:value="value1"
              :options="options1"
              mode="multiple"
              style="width: 200px"
              @change="gaibian"
            />
            <span class="tip-label2">被隐藏的项将不会显示在工资条中</span>
          </div>
          <div class="company-info-item">
            <span class="tip-label1">隐藏空值：</span>
            <a-switch v-model:checked="checked1" />
            <span class="tip-label2">开启后工资条中将隐藏数值为空的项目</span>
          </div>
          <div class="company-info-item">
            <span class="tip-label1">添加公告：</span>
            <a-switch v-model:checked="checked2" />
            <span class="tip-label2">手机查看时，公告将显示在工资条底部</span>
          </div>
          <template v-if="checked2">
            <div
              style="
                position: relative;
                display: inline-block;
                width: 100%;
                margin-top: 20px;
                font-size: 14px;
                vertical-align: bottom;
              "
            >
              <a-textarea
                v-model:value="gonggao"
                autocomplete="off"
                class="el-textarea__inner"
                maxlength="70"
                placeholder="请输入内容"
                style="
                  min-height: 33px;
                  background-color: inherit;
                  border-color: inherit;
                "
              />
              <span class="el-input__count" style="background-color: inherit">
                {{ nums }}/70
              </span>
            </div>
          </template>
          <div class="company-info-item">
            <div class="tip-set"></div>
            <div class="tip-label-set">功能设置</div>
          </div>
          <div class="company-info-item">
            <span class="tip-label1">定时发送：</span>
            <a-switch v-model:checked="checked3" />
          </div>
          <template v-if="checked3">
            <div class="company-info-item">
              <span class="tip-label1">发送时间：</span>
              <a-date-picker
                v-model:value="sendtime"
                :disabled-date="disabledDate"
                :disabled-time="disabledDateTime"
                :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          </template>
        </div>
        <div class="footer-btn">
          <a-button type="primary" @click="emit('prev')"> 上一步 </a-button>
          <a-button
            style="margin-left: 20px"
            type="primary"
            @click="uploadSalary('next')"
          >
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content-send {
  align-items: center;
  width: 100%;
  height: 75vh;
  padding: 10px 0;
  background-color: hsl(var(--background));
  border-radius: 6px;
  box-shadow: 0 1px 6px 0 rgb(0 0 0 / 10%);
}

.content-preview-send {
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-preview {
  display: flex;
  justify-content: flex-end;
  width: 33%;
  margin-right: 50px;
}

.preview-set {
  width: 50%;
  height: 100%;
  margin-top: -10px;
  margin-left: 40px;
}

.preview-set-one {
  min-height: 400px;
}

.company-info-item2 {
  display: flex;
  align-items: center;
}

.company-info-item {
  display: flex;
  align-items: center;
  margin-top: 26px;
}

.tip-set {
  width: 4px;
  height: 15px;
  background: #3d7fff;
  border-radius: 2px;
}

.tip-label-set {
  margin-left: 6px;
  border-radius: 6px;
}

.tip-label1 {
  font-size: 14px;
  font-weight: 400;
}

.tip-label2 {
  margin-left: 6px;
  font-size: 14px;
  font-weight: 400;
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}

.content {
  width: 266px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  box-shadow: 0 8px 18px 0 rgb(104 113 168 / 28%);
}

.confirm {
  height: 100vh;
}

.head1 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  margin-bottom: 16px;
}

.head-title {
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #2a2d3f;
  text-align: center;
}

.title {
  justify-content: center;
  margin: 10px;
  background-image: url('/salary.png');
  background-size: 100% 100%;
  border-radius: 8px;
}

.body {
  height: 312px;
  overflow-y: auto;
}

.info-item {
  display: flex;
  align-items: center;
  height: 40px;
  margin-right: 14px;
  margin-left: 14px;
  border-bottom: 1px solid rgb(0 0 0 / 10%);
}

.info-item1 {
  display: flex;
  align-items: center;
  margin-top: 26px;
  margin-bottom: 10px;
}

.tip {
  width: 3px;
  height: 10px;
  margin-left: 14px;
  background: #465df9;
  border-radius: 2px;
}

.tip-label {
  height: 17px;
  margin-left: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
  color: #030303;
}

.tip1 {
  padding-top: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #fff;
  text-align: center;
}

.tip2 {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #fff;
  text-align: center;
}

.tip3 {
  display: -webkit-box;
  margin: 10px 20px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 400;
  color: #f2f3fc;
  text-align: center;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tip4 {
  height: 17px;
  font-size: 12px;
  line-height: 17px;
  color: #030303;
}

.el-textarea__inner {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 5px 15px;
  font-size: inherit;
  line-height: 1.5;
  color: #606266;
  resize: vertical;
  resize: none;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.el-input__count {
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 12px;
  color: #909399;
  background: #fff;
}
</style>
