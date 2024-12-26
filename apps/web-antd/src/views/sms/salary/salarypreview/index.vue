<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useWatermark } from '@vben/hooks';

import { requestClient } from '#/api/request';

const { destroyWatermark, updateWatermark } = useWatermark();

const info = ref<any>([]);
const info2 = ref<any>(false);
const smsNew = ref<any>({
  sendDate: '',
  sendType: '',
  name: '',
  salary: 0,
});
const errmsg = ref<any>();
const route = useRoute();
const confirmName = (params: any) => {
  return requestClient.post('/sys/smsGz/getSmsGzNew', params);
};
const getItem1 = (params: any) => {
  return requestClient.post('/sys/smsGz/getSmsGzNewDetail', params);
};

async function createWaterMark() {
  await updateWatermark({
    advancedStyle: {
      colorStops: [
        {
          color: 'red',
          offset: 0,
        },
        {
          color: 'blue',
          offset: 1,
        },
      ],
      type: 'linear',
    },
    content: `${smsNew.value.name}\n${new Date().toLocaleString()}`,
    globalAlpha: 0.2,
    fontSize: '10px',
    gridLayoutOptions: {
      cols: 2,
      gap: [20, 20],
      matrix: [
        [1, 0],
        [0, 1],
      ],
      rows: 2,
    },
    height: 100,
    layout: 'grid',
    rotate: 22,
    width: 100,
    zIndex: 9999,
  });
}

const confirmName1 = ref('');
destroyWatermark();
function confirmName2() {
  confirmName({ id: route.query.id, name: confirmName1.value }).then((res) => {
    if (res === 'true') {
      info2.value = true;
      getItem1({ id: route.query.id, name: confirmName1.value }).then((res) => {
        info.value = res[0];
        smsNew.value = res[1];
        // setWatermark(smsNew.value.name);
        nextTick(() => {
          createWaterMark();
        });

        // info.value = res.
      });
    } else {
      errmsg.value = '输入姓名错误';
    }
  });
}

// watch(
//   info2,
//   (count, prevCount) => {
//     if (count === true) {
//       getItem1({ id: route.query.id, name: confirmName1.value }).then((res) => {
//         console.log(res);
//         info.value = res[0];
//         smsNew.value = res[1];
//         //info.value = res.
//       });
//     }
//   },
//   { immediate: true, deep: true }
// );

watch(
  confirmName1,
  (count) => {
    if (count === '') {
      errmsg.value = null;
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="content">
    <template v-if="!info2">
      <div class="content-confirm">
        <div class="title-confirm">
          <div class="title-confirm-1">江苏白雪电器股份有限公司</div>
        </div>
        <div class="body-confirm">
          <div class="title-tip-confirm">
            为了保护薪资信息安全，请输入（姓名）进行验证
          </div>
          <div class="phone-tip-confirm">
            <a-input
              v-model:value="confirmName1"
              align="left"
              class="inputs"
              placeholder="点击输入姓名"
            />
          </div>
          <template v-if="errmsg != null">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                color: red;
              "
            >
              {{ errmsg }}
            </div>
          </template>
          <div class="next-confirm" @click="confirmName2">验证</div>
        </div>
      </div>
    </template>
    <template v-if="info2">
      <div class="head1">
        <div class="head-title">
          {{ smsNew.sendDate.split('/')[0] }}年-{{
            smsNew.sendDate.split('/')[1]
          }}月-{{ smsNew.sendType }}
        </div>
      </div>
      <div class="title">
        <div class="tip1">实发工资（元）</div>
        <div class="tip2">{{ smsNew.salary }}</div>
        <div class="tip3">江苏白雪电器股份有限公司</div>
      </div>
      <div class="body">
        <div class="info-item1">
          <div class="tip"></div>
          <div class="tip-label">工资明细</div>
        </div>
        <template v-for="item in info" :key="item.id">
          >
          <div class="info-item" style="justify-content: space-between">
            <div class="tip4">{{ item.name }}</div>
            <div class="tip4">{{ item.value }}</div>
          </div>
        </template>
        <template v-if="smsNew.showBroadcast === 'Y'">
          <div style="margin: 14px; font-size: 12px; color: #666">
            公告：{{ smsNew.broadcastText }}
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.content-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.title-confirm {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 8vh;
  background: #fbfbfd;
}

.title-confirm-1 {
  display: -webkit-box;
  height: 20px;
  margin-right: 8px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #4a4a4a;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  -webkit-box-pack: center;
}

.body-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 92vh;
  background: #f5f5f5;
}

.title-tip-confirm {
  height: 20px;
  margin-top: 46px;
  margin-bottom: 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #030303;
}

.phone-tip-confirm {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 88%;
  height: 24px;
  margin-top: 10px;
  font-size: 17px;
  font-weight: 400;
  line-height: 24px;
  color: #020202;
}

.next-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 44px;
  margin-top: 0;
  margin-top: 50px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: #326fe6ff;
  border: 1px;
  border-radius: 23px;
}

.inputs {
  width: 100%;
  height: 40px;
  font-size: 17px;
  font-weight: 400;
  line-height: 24px;
  color: #030303;
  text-align: left;
  background: #fff;
  border: 1px solid #fff;
  border-radius: 6px;
}

div {
  display: block;
  padding: 0;
  margin: 0;
  word-break: break-all;
  unicode-bidi: isolate;
}

.content {
  width: 100%;
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
  width: 100%;
  height: 2vh;
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
  height: 20vh;
  margin: 10px;
  background-image: url('/salary.png');
  background-size: 100% 100%;
  border-radius: 8px;
}

.body {
  height: 78vh;
  overflow-y: scroll;
}

.info-item {
  display: flex;
  align-items: center;
  height: 50px;
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
  font-size: 17px;
  font-weight: 400;
  line-height: 17px;
  color: #fff;
  text-align: center;
}

.tip2 {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 700;
  line-height: 28px;
  color: #fff;
  text-align: center;
}

.tip3 {
  display: -webkit-box;
  margin: 20px 20px 10px;
  overflow: hidden;
  font-size: 20px;
  font-weight: 500;
  color: #f2f3fc;
  text-align: center;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tip4 {
  height: 19px;
  font-size: 20px;
  font-weight: 300;
  line-height: 19px;
  color: #030303;
}
</style>
