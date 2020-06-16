<template>
  <div class="defence-build">
    <el-steps :active="$store.state.defenceActive" finish-status="success">
      <el-step title="设置围栏名称"></el-step>
      <el-step title="触发类型"></el-step>
      <el-step title="报警等级"></el-step>
      <el-step title="选择人员"></el-step>
      <el-step title="绘制围栏"></el-step>
      <el-step title="提交"></el-step>
    </el-steps>
    <div class="type">
      <div class="type-item">
        <span>围栏名称</span>
        <input type="text" v-model="$store.state.fenceData.name" placeholder="名称" />
      </div>
      <div class="select-bar type-item" v-show="$store.state.defenceActive > 0">
        <!-- <span>类型：</span> -->
        <span>触发类型</span>
        <spinner
          :content="typeArr[$store.state.fenceData.type]||'类型'"
          :list="typeArr"
          @sendValue="getType"
        ></spinner>
      </div>
      <div class="select-bar type-item" v-show="$store.state.defenceActive > 1">
        <span>报警等级</span>
        <spinner
          :content="levelArr[$store.state.fenceData.level]||'等级'"
          :list="levelArr"
          @sendValue="getLevel"
        ></spinner>
      </div>
    </div>

    <div class="check-oper" v-show="$store.state.defenceActive > 2">
      <div>
        <lh-checkbox
          content="是否选择全体人员"
          @sendCheckMsg="getRange"
          :isChecked="$store.state.fenceData.range ? true : false"
        ></lh-checkbox>
      </div>
      <div class="add-number-bar type-item">
        已添加人数:
        <span class="number">{{ checkedNum }}</span>
      </div>
    </div>

    <div class="operation" v-show="$store.state.defenceActive > 2">
      <div class="relieve">
        <p>已选择人员</p>
        <ul>
          <li class="oper-title">
            <span>
              <lh-checkbox @sendCheckMsg="removeAll" :isChecked="allRemove"></lh-checkbox>
            </span>
            <span>姓名</span>
            <span>人员编号</span>
          </li>
          <li
            v-for="(value, index) in $store.state.fenceData.persons"
            :key="index"
            @dblclick="leftToRight(index)"
          >
            <span>
              <lh-checkbox @sendCheckMsg="removeItem($event, index)" :isChecked="value.is_selected"></lh-checkbox>
            </span>
            <span>{{ value.name }}</span>
            <span>{{ value.pid }}</span>
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
          <li class="person-class">
            <div>
              <spinner :content="personType[typeid]" :list="personType" @sendValue="getPersonType"></spinner>
            </div>
            <div class="search-bar">
              <search-item holder="请输入人员信息" @search="getValue" @valueChange="valueChange"></search-item>
            </div>
          </li>
          <li class="oper-title">
            <span>
              <lh-checkbox @sendCheckMsg="addAll" :isChecked="allAdd"></lh-checkbox>
            </span>
            <span>姓名</span>
            <span>人员编号</span>
            <span>类型</span>
          </li>
          <li v-for="(value, index) in checkPerson" :key="index" @dblclick="rightToLeft(index)">
            <span>
              <lh-checkbox @sendCheckMsg="addItem($event, index)" :isChecked="value.is_selected"></lh-checkbox>
            </span>
            <span>{{ value.name }}</span>
            <span>{{ value.pid }}</span>
            <span>{{ value.type===0?'公安':'地铁人员' }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bot-bar">
      <div class="draw-defence" v-show="$store.state.defenceActive > 3">
        <lh-button content="绘制围栏" @checkClick="drawFence"></lh-button>
      </div>
      <div class="right-bar" v-show="$store.state.defenceActive > 4">
        <lh-button content="返回" @checkClick="backToMain"></lh-button>
        <lh-button content="提交" @checkClick="submit"></lh-button>
      </div>
    </div>
  </div>
</template>

<script>
import LhCheckbox from "@/components/common/LhCheckbox.vue";
import Spinner from "@/components/common/Spinner.vue";
import LhButton from "@/components/common/LhButton.vue";
import SearchItem from "@/components/common/SearchItem.vue";
import checkMixin from "@/mixin/checkMixin.js";
import scrollMixin from "@/mixin/scrollMixin.js";

import { getAllPerson, getSearchResult } from "@/apis/interfance.js";
export default {
  components: {
    LhCheckbox,
    Spinner,
    LhButton,
    SearchItem
  },
  mixins: [checkMixin, scrollMixin],
  data() {
    return {
      isDraw: false,
      // defenceName: "", //围栏名称
      type: undefined, //围栏类型
      typeArr: ["离开触发", "进入触发", "进出触发"],
      level: undefined, //围栏等级
      levelArr: ["普通", "危险"],
      range: 0, //范围
      checkedPerson: [], //已选人员
      checkPerson: [], //可选人员
      allRemove: false,
      allAdd: false,
      count: 0,
      allNum: 0,
      personType: ["公安", "地铁人员", "全部"],
      typeid: 2,
      searchWords: ""
    };
  },
  mounted() {
    this.$store.state.operationType = 4;
    getAllPerson().then(data => {
      this.count = data.count;
      data.results.forEach(value => {
        value.is_selected = false;
      });
      this.checkPerson = data.results;
      let arr = this.$store.state.fenceData.persons;
      let len = this.checkPerson.length,
        length = arr.length;
      for (var i = 0; i < len; i++) {
        let k = 0;
        for (var j = 0; j < length; j++) {
          if (!arr[j] || !this.checkPerson[k]) continue;
          if (arr[j].id === this.checkPerson[k].id) {
            this.checkPerson.splice(k, 1);
            k = k - 1;
          }
          k++;
        }
      }
    });
  },
  methods: {
    drawFence() {
      this.$router.push("/blankmap/fence");
    },
    getType(type) {
      this.typeArr.forEach((value, index) => {
        if (value === type) {
          this.$set(this.$store.state.fenceData, "type", index);
        }
      });

      if (this.$store.state.defenceActive < 3) {
        this.$store.state.defenceActive = 2;
      }
    },
    getLevel(level) {
      this.levelArr.forEach((value, index) => {
        if (value === level) {
          this.$set(this.$store.state.fenceData, "level", index);
        }
      });
      if (this.$store.state.defenceActive < 4) {
        this.$store.state.defenceActive = 3;
      }
    },
    getRange(flag) {
      let range = flag === true ? 1 : 0;
      this.$set(this.$store.state.fenceData, "range", range);
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
      this.checkAll(flag, this.checkPerson);
    },
    addItem(e, index) {
      this.allAdd = this.selectItem(e, index, this.checkPerson);
    },
    exchange(content) {
      if (content === "left") {
        let k = 0;
        let len = this.checkPerson.length;
        for (var i = 0; i < len; i++) {
          if (this.checkPerson[k].is_selected === true) {
            this.checkPerson[k].is_selected = false;
            this.$store.state.fenceData.persons.push(this.checkPerson[k]);
            this.checkPerson.splice(k, 1);
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
            this.checkPerson.push(arr[l]);
            arr.splice(l, 1);
          } else {
            l++;
          }
        }
      }
    },
    submit() {
      let { name, level, range, type, persons } = this.$store.state.fenceData;
      if (!name) {
        this.$message.error("名字不能为空！！！！！！！！！！");
        return;
      }
      if (this.$store.state.fenceData.type === undefined) {
        this.$message.error("类型不能为空！！！！！！！！！！");
        return;
      }
      if (this.$store.state.fenceData.level === undefined) {
        this.$message.error("等级不能为空！！！！！！！！！！");
        return;
      }
      if (!range && persons.length === 0) {
        this.$message.error("人员不能为空");
        return;
      }
      if (this.$store.state.chartArr.length === 0) {
        this.$message.error("还未绘制围栏");
        return;
      }
      this.$store.state.fenceData.level = level ? level : 0;
      this.$store.state.fenceData.type = type ? type : 0;
      this.$store.state.fenceData.range = range ? range : 0;
      this.$emit("submit");
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
        getSearchResult({ name: val }, this.typeid,undefined,200).then(data => {
          this.checkPerson = data.results;
        });
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, this.typeid,undefined,200).then(data => {
          this.checkPerson = data.results;
        });
      }
    },
    rightToLeft(index) {
      this.$store.state.fenceData.persons.push(this.checkPerson[index]);
      this.checkPerson.splice(index, 1);
    },
    leftToRight(index) {
      this.checkPerson.push(this.$store.state.fenceData.persons[index]);
      this.$store.state.fenceData.persons.splice(index, 1);
    }
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
  watch: {
    "$store.state.fenceData.name": {
      // 围栏名称
      handler(val) {
        if (val !== "" && this.$store.state.defenceActive === 0) {
          this.$store.state.defenceActive = 1;
        } else if (val === "" && this.$store.state.defenceActive < 2) {
          this.$store.state.defenceActive = 0;
          this.$message.info("请设置围栏名称！");
        } else if (val === "" && this.$store.state.defenceActive > 1) {
          this.$message.info("请设置围栏名称！");
        }
      }
    },
    "$store.state.fenceData.range": {
      handler(val) {
        if (val === 1 && this.$store.state.defenceActive === 3) {
          this.$store.state.defenceActive = 4;
        } else if (
          val !== 1 &&
          this.$store.state.fenceData.persons.length <= 0
        ) {
          this.$store.state.defenceActive = 3;
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
            if (!arr[i] || !arr[j]) continue;
            if (arr[i].id == arr[j].id) {
              //第一个等同于第二个，splice方法删除第二个
              if (arr.length == 0) break;
              arr.splice(j, 1);
              j--;
            }
          }
        }
        if (arr.length > 0 && this.$store.state.defenceActive === 3) {
          this.$store.state.defenceActive = 4;
        } else if (
          arr.length <= 0 &&
          this.$store.state.defenceActive === 4 &&
          this.$store.state.fenceData.range === 0
        ) {
          this.$store.state.defenceActive = 3;
        }
      }
    },
    checkPerson(val) {
      let arr = this.$store.state.fenceData.persons,newArr=[...val];
      let length = arr.length;
      for (var i = 0; i < length; i++) {
        newArr =  newArr.filter((value)=>{
          return  arr[i].id != value.id
        })
      }
      if(newArr && newArr.length != val.length){
        this.checkPerson = newArr;
      }
    }
  }
};
</script>

<style lang="less" scoped>
p {
  margin: 0.6rem 0;
}
.defence-build  .el-steps {
  padding: 0 1rem;
}
.defence-build {
  color: #fff;
  // background: rgba(24, 45, 77, 0.6);
  height: 93%;
  box-sizing: border-box;
  font-size: 14px;
  opacity: 0.8;
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
    .select-bar {
      display: flex;
      align-items: center;
      .item {
        width: 15rem;
        padding-right: 0.4rem;
      }
    }
    div {
      margin-right: 2rem;
    }
    .type-item {
      span {
        margin-right: 1rem;
      }
      input {
        color: #fff;
        width: 12rem;
        background: 0;
        line-height: 2.6rem;
        height: 2.6rem;
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        border-radius: 0.5rem;
        text-indent: 0.4rem;
      }
    }
  }
  .check-oper {
    display: flex;
    padding: 0.4rem 1rem 1rem 1rem;
    border-bottom: 1px solid rgba(178, 223, 255, 0.2);
    align-items: center;
    & > div {
      margin-right: 3rem;
    }
    .number {
      color: #e5304b;
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
    height: 62.5%;
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
        color: #72b2e3;

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
      .oper-title {
        // padding: 4px 0;
        background: rgba(178, 223, 255, 0.2);
        border-radius: 0.5rem 0.5rem 0px 0px;
      }
      .person-class > div {
        width: 10rem;
      }
      .person-class > .search-bar {
        width: 24rem;
      }
    }
    ul {
      border: 1px solid rgba(178, 223, 255, 0.2);
      height: 90%;
      overflow: auto;
      background: rgba(178, 223, 255, 0.1);
      border-radius: 0.5rem;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 3.6rem;
        padding-left: 1rem;
        cursor: pointer;
        &:hover {
          background: rgba(134, 208, 255, 0.1);
        }
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
      .oper-title {
        line-height: 3rem;
        background: rgba(178, 223, 255, 0.2);
        border-radius: 0.5rem 0.5rem 0px 0px;
      }
    }
    ul::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    ul::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0.3rem;
      background: rgba(134, 208, 255, 0.3);
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
      & > div {
        margin-right: 1rem;
      }
    }
  }
}
.defence-build::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.8rem; /*高宽分别对应横竖滚动条的尺寸*/
}
.defence-build::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 0.3rem;
  background: rgba(134, 208, 255, 0.3);
}
 .el-step__title {
  font-size: 1.4rem;
  line-height: 3rem;
}
 .el-step__title.is-process {
  font-weight: 700;
  color: #f2f6fc;
}
</style>