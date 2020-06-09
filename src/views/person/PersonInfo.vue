<template>
  <div class="person-info root-element">
    <div class="base-info">
      <h4>基本信息</h4>
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
    <div class="alarm-statistics">
      <h4>报警统计</h4>
      <div class="alarm-pic" ref="alarmGraph"></div>
    </div>
    <div class="label-info">
      <h4>标签信息</h4>
    </div>
    <div class="alarm-info">
      <h4>报警信息</h4>
      <ul class="alarm-content">
        <li>
          <div class="alarm-item">
            <p>2020-06-01 13：42：50</p>
            <p>
              在xxxxx发出越界报警【紧急】
              <span @click="linkToDetail">查看</span>
            </p>
          </div>
          <div class="alarm-item">
            <p>2020-06-01 13：42：50</p>
            <p>
              在xxxxx发出越界报警【紧急】
              <span>查看</span>
            </p>
          </div>
          <div class="alarm-item">
            <p>2020-06-01 13：42：50</p>
            <p>
              在xxxxx发出越界报警【紧急】
              <span>查看</span>
            </p>
          </div>
          <div class="alarm-item">
            <p>2020-06-01 13：42：50</p>
            <p>
              在xxxxx发出越界报警【紧急】
              <span>查看</span>
            </p>
          </div>
        </li>
        <li ref="radarGraph"></li>
      </ul>
    </div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/radar");

// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  data() {
    return {};
  },
  mounted() {
    this.initAlarm();
    this.initRadar();
  },
  methods: {
    initAlarm() {
      let myChart = echarts.init(this.$refs.alarmGraph);
      myChart.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "2020-05-29",
              "2020-05-30",
              "2020-05-31",
              "2020-06-01",
              "2020-06-02",
              "2020-06-03",
              "2020-06-04"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "个人报警数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      });
    },
    initRadar() {
      let myChart = echarts.init(this.$refs.radarGraph);
      myChart.setOption({
        title: {
          text: "报警数据雷达图",
          left: "center",
          textStyle: {
            color: '#fff'
        }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: "center",
          data: ["某水果手机"]
        },
        radar: [
          {
            indicator: [
              { text: "越界报警 60", max: 100 },
              { text: "跟随报警 73", max: 100 },
              { text: "脱离互监组报警 85", max: 100 },
              { text: "聚集报警 40", max: 100 },
              { text: "低电量报警 60", max: 100 },
              { text: "sos主动报警 30", max: 100 },
              
            ],
            radius: 80,
            center: ["50%", "40%"]
          }
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "item"
            },
            areaStyle: {},
            data: [
              {
                value: [60, 73, 85, 40, 60,30],
                name: "报警统计"
              }
            ]
          }
        ]
      });
    },
    linkToDetail(){
        this.$router.push("/detail")
    }
  }
};
</script>

<style lang="less">
@title_Height: 2.6rem;
.person-info {
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
    .alarm-pic {
      width: 100%;
      height: calc(~"100% - @{title_Height}");
    }
    .alarm-content {
      font-size: 1.4rem;
      width: 100%;
      height: calc(~"100% - @{title_Height}");
      display: flex;
      li {
        width: 50%;
        .alarm-item {
          height: 5rem;
          margin-top: 0.8rem;
          margin-left: 1rem;
          p {
            height: 2.5rem;
            line-height: 2.5rem;
          }
          p:nth-of-type(2) {
            text-indent: 2rem;
          }
          span{
              cursor: pointer;
              color:#00c297;
              &:hover{
                  text-decoration: underline;
              }
          }
        }
      }
    }
  }
}
</style>