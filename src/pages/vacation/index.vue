<template>
  <div id="vacation" class="w-full h-screen flex justify-center items-center">
    <img src="https://picsum.photos/1920/1080" style="position: absolute; z-index: -1; height: 100%; width: 100%" />
    <div class="flex flex-col justify-center items-center">
      <div class="items-center">
        <div class=" bg-orange-400 text-white text-xl ml-2 m-2 rounded-md pl-3 pr-3">
          <p><span v-if="isHavaHoliday">太好了，这个月有假期！</span>
            <span v-else>天塌啦！这个月没有假期！</span>
            <span>最近的假期是
              <span class=" text-2xl font-bold" style="color:#165DFF">{{ nextClosestDate.month }}月{{ nextClosestDate.day
              }}日！</span></span>
            还有
            <span class=" text-2xl font-bold" style="color:#165DFF"> {{ daysDifference }}天！ </span>
          </p>
        </div>
        <div style="width: 70vw; background-color: #ffffff4f" class="rounded-xl items-start p-8">
          <a-calendar v-model="calendarValue" @panel-change="handleMonthChange" :modes="['month']">
            <template #default="row">
              <div :class="[
                currentMouth == row.month ? 'text-black' : 'text-gray-400',
                'flex justify-center items-center w-8 h-8 rounded-full m-2 relative flex-col',
              ]" :style="{
            color: currentDay == row.date && currentMouth == row.month ? '#fff' : '',
            backgroundColor: currentDay == row.date && currentMouth == row.month ? '#165DFF' : '',
          }">
                {{ row.date }}
              </div>
              <div class="mt-1 ml-3 flex">
                <span v-if="isHoliday(row) && currentMouth == row.month"
                  class="bg-orange-500 p-1 rounded-md text-white text-xs mr-1">假</span>
                <span v-if="isRecommendHoliday(row) && currentMouth == row.month"
                  class="bg-blue-500 p-1 rounded-md text-white text-xs">推</span>
              </div>
            </template>
          </a-calendar>
        </div>
      </div>
      <div class="text-white mt-10">
        <span class="bg-orange-500 p-1 rounded-md text-white text-xs mr-1">假</span>为国家法定节假日
        <span class="bg-blue-500 p-1 rounded-md text-white text-xs">推</span>为推荐请假的日期
      </div>
      <p class="text-white mt-2 mb-2 text-center">
        本工具就是为了凑假期的，在法定节假日上面加上合理的请假，达到最优的休假时间，本工具仅代表个人意见，勿喷！
      </p>
    </div>
  </div>
</template>

<script lang="js" setup name="vacation">
import { ref, computed, } from 'vue';
import dayjs from 'dayjs';
import { getVacationList } from '../../serve/vacation';

const calendarValue = ref(new Date());
const currentMouth = ref(dayjs(calendarValue.value).format('M')); // 初始化 currentMouth
const currentDay = ref(dayjs().format('D'));
const vacationList = ref([]);
const daysDifference = ref(0);
const isHavaHoliday = ref(false);
const nextClosestDate = ref({})

const getVacationDays = computed(() => {
  const monthData = vacationList.value.find(item => item.mouth === currentMouth.value);
  return monthData ? monthData.children || [] : [];
});

const isHoliday = (row) => {
  const dayData = getVacationDays.value.find(item => item.day === String(row.date));
  return dayData ? dayData.isHoliday : false;
};

const isRecommendHoliday = (row) => {
  const dayData = getVacationDays.value.find(item => item.day === String(row.date));
  return dayData ? dayData.recommendHoliday : false;
};

const getVacationByYear = (year) => { // 接收字符串类型的 year
  getVacationList({ year }).then(res => {
    vacationList.value = res
    const nowMouth = dayjs().format('M');
    isHavaHoliday.value = vacationList.value.filter(item => item.mouth === nowMouth).length > 0;
    // 获取当前日期
    const today = new Date();
    // 查找离今天最近的下一个日期
    let minDiff = Infinity;
    vacationList.value.forEach(month => {
      month.children.forEach(child => {
        // 创建一个具体的日期对象
        const date = new Date(today.getFullYear(), month.mouth - 1, child.day);
        // 如果日期在今天之后
        if (date > today) {
          // 计算与今天的时间差
          const diff = date - today;
          // 如果时间差更小，更新最接近的下一个日期
          if (diff < minDiff) {
            minDiff = diff;
            nextClosestDate.value = { ...child, month: month.mouth, date };
          }
        }
      });
    });
    if (nextClosestDate.value) {
      // 计算距离今天的天数
      daysDifference.value = Math.floor(minDiff / (1000 * 60 * 60 * 24));
      console.log(`离今天最近的下一个日期是：${nextClosestDate.value.month}月${nextClosestDate.value.day}日，距离今天还有 ${daysDifference.value} 天`);
    } else {
      console.log("没有未来的日期！");
    }

  }).catch(error => {
    console.error("Error fetching vacation data:", error);
    // 处理错误，例如显示错误消息给用户
  });
};

const handleMonthChange = (date) => {
  console.log(date)
  console.log('--', dayjs(date).format('M'))
  currentMouth.value = dayjs(date).format('M');
}

const year = dayjs().format('YYYY');
getVacationByYear(year); // 组件挂载后立即获取当年的假期
</script>

<style lang="scss" scoped></style>
