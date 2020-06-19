<template>
  <div class="defence-build pop-container">
    <pop-title :title="'围栏编辑'"></pop-title>
    <div class="type">
      <div class="type-item">
        <span>围栏名称:</span>
        <input type="text" v-model="$store.state.fenceData.name" />
      </div>
      <div class="select-bar type-item">
        <span>触发类型:</span>
        <spinner
          :content="typeArr[$store.state.fenceData.type]"
          :list="typeArr"
          @sendValue="getType"
        ></spinner>
      </div>
      <div class="select-bar type-item">
        <span>报警等级：</span>
        <spinner
          :content="levelArr[$store.state.fenceData.level]"
          :list="levelArr"
          @sendValue="getLevel"
        ></spinner>
      </div>
      <div class="add-number-bar type-item">
        已添加人数:
        <span class="number">{{ checkedNum }}</span>
      </div>
    </div>
    <div class="check-oper">
      <div>
        <lh-checkbox
          content="是否选择全体人员"
          @sendCheckMsg="getRange"
          :isChecked="$store.state.fenceData.range ? true : false"
        ></lh-checkbox>
      </div>
    </div>
    <div class="operation">
      <div class="relieve">
        <p>选择解除人员</p>
        <ul>
          <li class="oper-title list-title">
            <span>
              <lh-checkbox @sendCheckMsg="removeAll" :isChecked="allRemove"></lh-checkbox>
            </span>
            <span>姓名</span>
            <span>人员编号</span>
          </li>
          <li
            class="list-item"
            v-for="(item, index) in $store.state.fenceData.persons"
            :key="index"
            @dblclick="leftToRight(index)"
          >
            <span>
              <lh-checkbox @sendCheckMsg="removeItem($event, index)" :isChecked="item.is_selected"></lh-checkbox>
            </span>
            <span>{{ item.name }}</span>
            <span>{{ item.pid }}</span>
          </li>
        </ul>
      </div>
      <div class="center-icon">
        <span
          class="icon iconfont"
          @click="exchange('left')"
          @touchstart.stop.prevent="exchange('left')"
        >&#xe641;</span>
        <span
          class="icon iconfont"
          @click="exchange('right')"
          @touchstart.stop.prevent="exchange('right')"
        >&#xe642;</span>
      </div>
      <div class="add">
        <p>可添加人员</p>
        <ul @touchstart="getFirstY" @touchmove="scrollElement" ref="listBar">
          <li class="person-class height50">
            <div>
              <spinner :content="personType[typeid]" :list="personType" @sendValue="getPersonType"></spinner>
            </div>
            <div class="search-bar marginR20">
              <search-item holder="请输入人员信息" @search="getValue" @valueChange="valueChange"></search-item>
            </div>
          </li>
          <li class="oper-title list-title">
            <span>
              <lh-checkbox @sendCheckMsg="addAll" :isChecked="allAdd"></lh-checkbox>
            </span>
            <span>姓名</span>
            <span>人员编号</span>
            <span>类型</span>
          </li>
          <li
            class="list-item"
            v-for="(item, index) in rightData"
            :key="index"
            @dblclick="rightToLeft(index)"
          >
            <span>
              <lh-checkbox @sendCheckMsg="addItem($event, index)" :isChecked="item.is_selected"></lh-checkbox>
            </span>
            <span>{{ item.name }}</span>
            <span>{{ item.pid }}</span>
            <span>{{ item.type===0?'公安':'地铁人员' }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bot-bar">
      <div class="draw-defence">
        <button class="common-button height38-button" @click="drawFence">重新绘制围栏</button>
      </div>
      <div class="right-bar">
        <button class="common-button height38-button marginR20" @click="backToMain">返回</button>
        <button class="common-button height38-button" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import LhCheckbox from "@/components/common/LhCheckbox.vue";
import Spinner from "@/components/common/Spinner.vue";
import SearchItem from "@/components/common/SearchItem.vue";
import PopTitle from "@/components/common/PopTitle.vue";

import checkMixin from "@/mixin/checkMixin.js";
import scrollMixin from "@/mixin/scrollMixin.js";
import { getAllPerson, putFence, getSearchResult } from "@/apis/interfance.js";
export default {
  components: {
    LhCheckbox,
    Spinner,
    SearchItem,
    PopTitle
  },
  mixins: [checkMixin, scrollMixin],
  data() {
    return {
      isDraw: false,
      allRemove: false,
      allAdd: false,
      count: 0,
      typeArr: ["离开触发", "进入触发", "进出触发"],
      levelArr: ["普通", "危险"],
      rightData: [],
      personType: ["公安", "地铁人员", "全部"],
      typeid: 2,
      searchWords: ""
    };
  },
  mounted() {
    this.$store.state.operationType = 5;
    getAllPerson().then(data => {
      this.count = data.count;
      data.results.forEach(value => {
        value.is_selected = false;
      });
      this.rightData = data.results;
      let flag = this.$store.state.fenceData.range;
      let arr = this.$store.state.fenceData.persons;
      let len = this.rightData.length,
        length = arr.length,
        k = 0;
      for (var i = 0; i < len; i++) {
        if (!flag) {
          for (var j = 0; j < length; j++) {
            if (!arr[j] || !this.rightData[k]) {
              continue;
            }
            if (arr[j].id === this.rightData[k].id) {
              this.rightData.splice(k, 1);
              k = k - 1;
            }
            k++;
          }
        }
      }
    });
  },
  computed: {
    checkedNum() {
      if (this.$store.state.fenceData.range === 1) {
        return this.count;
      } else {
        return this.$store.state.fenceData.persons
          ? this.$store.state.fenceData.persons.length
          : 0;
      }
    }
  },
  methods: {
    drawFence() {
      this.$router.push("/blankmap/fence");
    },
    getRange(flag) {
      this.$store.state.fenceData.range = flag === true ? 1 : 0;
    },
    getType(type) {
      this.typeArr.forEach((value, index) => {
        if (value === type) {
          this.$store.state.fenceData.type = index;
        }
      });
    },
    getLevel(level) {
      this.levelArr.forEach((value, index) => {
        if (value === level) {
          this.$store.state.fenceData.level = index;
        }
      });
    },
    removeAll(flag) {
      this.checkAll(flag, this.$store.state.fenceData.persons);
    },
    removeItem(e, index) {
      this.allRemove = this.selectItem(
        e,
        index,
        this.$store.state.fenceData.persons
      );
    },
    addAll(flag) {
      this.checkAll(flag, this.rightData);
    },
    addItem(e, index) {
      this.allAdd = this.selectItem(e, index, this.rightData);
    },
    exchange(content) {
      if (content === "left") {
        let k = 0;
        let len = this.rightData.length;
        for (var i = 0; i < len; i++) {
          if (this.rightData[k].is_selected === true) {
            this.rightData[k].is_selected = false;
            this.$store.state.fenceData.persons.push(this.rightData[k]);
            this.rightData.splice(k, 1);
          } else {
            k++;
          }
        }
      }
      if (content === "right") {
        let arr = this.$store.state.fenceData.persons,
          l = 0,
          length = arr.length;
        for (var j = 0; j < length; j++) {
          if (arr[l].is_selected === true) {
            arr[l].is_selected = false;
            this.rightData.push(arr[l]);
            arr.splice(l, 1);
          } else {
            l++;
          }
        }
      }
    },
    submit() {
      if (this.$store.state.chartArr.length !== 0) {
        this.$emit("submit");
        return;
      }
      let { name, level, range, type } = this.$store.state.fenceData;
      let arr = [];
      this.$store.state.fenceData.persons.forEach(value => {
        arr.push(value.id);
      });
      putFence(this.$store.state.fenceData.id, {
        name,
        level,
        range,
        type,
        map: this.$store.state.fenceData.map.mapid,
        persons: "[" + arr.toString() + "]"
      })
        .then(() => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          // this.$store.state.defenceImgArr = [];
          this.backToMain();
        })
        .catch(() => {
          this.$message.error("修改失败");
        });
    },
    getValue(val) {
      this.searchWords = val;
      if (!val) return;
      this.valueChange(val);
    },
    getPersonType(content) {
      this.personType.forEach((value, index) => {
        if (value === content) {
          this.typeid = index;
        }
      });
    },
    valueChange(val) {
      let reg = /[\u4E00-\u9FA5\\s]/gim;
      if (reg.test(val) === true) {
        getSearchResult({ name: val }, this.typeid, undefined, 200).then(
          data => {
            this.rightData = data.results;
          }
        );
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, this.typeid, undefined, 200).then(
          data => {
            this.rightData = data.results;
          }
        );
      }
    },
    rightToLeft(index) {
      this.$store.state.fenceData.persons.push(this.rightData[index]);
      this.rightData.splice(index, 1);
    },
    leftToRight(index) {
      this.rightData.push(this.$store.state.fenceData.persons[index]);
      this.$store.state.fenceData.persons.splice(index, 1);
    }
  },
  watch: {
    "$store.state.fenceData": {
      immediate: true,
      handler() {
        let flag = this.$store.state.fenceData.range;
        let arr = this.$store.state.fenceData.persons;
        let len = this.rightData.length,
          length = arr.length,
          k = 0;
        for (var i = 0; i < len; i++) {
          if (!flag) {
            for (var j = 0; j < length; j++) {
              if (!arr[j]) continue;
              if (arr[j].id === this.rightData[k].id) {
                this.rightData.splice(k, 1);
                k = k - 1;
              }
            }
          }
          k++;
        }
      }
    },
    typeid() {
      this.valueChange(this.searchWords);
    },
    "$store.state.fenceData.persons.length": {
      handler() {
        let arr = this.$store.state.fenceData.persons;
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i].id == arr[j].id) {
              //第一个等同于第二个，splice方法删除第二个
              arr.splice(j, 1);
              j--;
            }
          }
        }
      }
    },
    rightData(val) {
      let arr = this.$store.state.fenceData.persons,
        newArr = [...val];
      let length = arr.length;
      for (var i = 0; i < length; i++) {
        newArr = newArr.filter(value => {
          return arr[i].id != value.id;
        });
      }
      if (newArr && newArr.length != val.length) {
        this.rightData = newArr;
      }
    }
  }
};
</script>

<style lang="less" scoped>
p {
  margin: 0.6rem 0;
}
.defence-build {
  box-sizing: border-box;
  .type {
    display: flex;
    line-height: 4rem;
    padding: 0 1rem;
    .add-number-bar {
      flex-grow: 1;
      text-align: right;
      margin-right: 0;
      font-size: 1.2rem;
    }
    .number {
      color: #e5304b;
    }
    .select-bar {
      display: flex;
      align-items: center;
    }
    div {
      margin-right: 2rem;
    }
    .type-item {
      height: 5rem;
      line-height: 5rem;
      span {
        margin-right: 1rem;
      }
      input {
        width: 20rem;
        color: #fff;
        background: 0;
        line-height: 3rem;
        height: 3rem;
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        border-radius: 0.5rem;
        text-indent: 0.4rem;
      }
    }
  }
  .check-oper {
    display: flex;
    padding: 0rem 1rem 1rem 1rem;
    border-bottom: 1px solid rgba(178, 223, 255, 0.2);
    align-items: center;
    & > div {
      margin-right: 3rem;
    }
    .draw-defence {
      flex-grow: 1;
      text-align: right;
      margin-right: 0;
    }
  }
  .operation {
    font-size: 1.4rem;
    display: flex;
    padding: 0 1rem;
    height: 74%;
    color: #fff;
    .relieve {
      width: 34%;
    }
    .center-icon {
      width: 8%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // text-align: center;
      span {
        display: inline-block;
        width: 3rem;
        line-height: 3rem;
        font-size: 2.6rem;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        margin-top: 0.6rem;
        border-radius: 1.5rem;
        text-align: center;
        &:hover {
          background: rgba(0, 0, 0, 0.6);
        }
      }
    }
    .add {
      flex-grow: 1;
      .person-class > div {
        width: 15rem;
      }
      .person-class > .search-bar {
        width: 28rem;
      }
    }
    ul {
      border: 1px solid rgba(178, 223, 255, 0.2);
      height: 95%;
      overflow: auto;
      border-radius: 0.5rem;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 3.6rem;
        padding-left: 1rem;
        input {
          width: 20%;
        }
        span {
          width: 30%;
          flex-grow: 1;
        }
        span:first-of-type {
          width: 8%;
        }
      }
    }
    ul::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    ul::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0.3rem;
      background: rgba(255, 255, 255, 0.3);
    }
  }
  .bot-bar {
    display: flex;
    margin-top: 1rem;
    justify-content: space-between;
    padding: 0 1rem;
    .draw-defence {
      display: flex;
      align-items: center;
    }
    .right-bar {
      display: flex;
      div {
        margin-right: 1rem;
      }
    }
  }
  li {
    cursor: pointer;
  }
}
</style>