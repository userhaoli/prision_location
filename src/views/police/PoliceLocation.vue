<template>
  <div class="police-location root-element">
    <div class="police-statistics">
      <h4>警力统计</h4>
      <div class="statistics-chart" ref="statisticsChart"></div>
    </div>
    <div class="alarm-">
      <h4>警员列表</h4>
      <div class="police-list" ref="alarmGraph"></div>
    </div>
    <div class="label-info">
      <h4>警员分布</h4>
    </div>
    <div class="base-info">
      <h4>警员详情</h4>
      <div class="info-content">
        <div class="content-top">
          <img src="/images/favicon.ico" alt />
          <ul class="info-right">
            <li>姓名:张三</li>
            <li>性别:男</li>
            <li>编号:115055</li>
            <li>标签ID:uwb1202</li>
          </ul>
        </div>
        <ul class="content-bottom">
          <li>身份证号：511322199805265512</li>
          <li>家庭住址：四川省成都市xxxx</li>
          <li>身份证号：511322199805265512</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");

// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  data() {
    return {};
  },
  mounted() {
    // this.initAlarm();
    this. initPolice();
  },
  methods: {
    initPolice() {
      let myChart = echarts.init(this.$refs.statisticsChart);
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    linkToDetail() {
      this.$router.push("/detail");
    }
  }
};
</script>

<style lang="less">
@title_Height: 2.6rem;
.police-location {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 140rem;
  margin: 0 auto;
  & > div {
    width: 45%;
    height: 45%;
    border: 1px solid #fff;
    h4 {
      font-size: 1.8rem;
      height: @title_Height;
      line-height: @title_Height;
    }
    .info-content {
      width: 100%;
      height: calc(~"100% - @{title_Height}");
      font-size: 1.6rem;
      .content-top {
        display: flex;
        img {
          width: 30%;
          margin: 0 2rem;
        }
        .info-right {
          li {
            margin-top: 1.5rem;
          }
        }
      }
      .content-bottom {
        margin-left: 2rem;
        li {
          line-height: 3rem;
          height: 3rem;
        }
      }
    }
    .statistics-chart,.police-list {
      width: 100%;
      height: calc(~"100% - @{title_Height}");
    }
  }
}
</style>