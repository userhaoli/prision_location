<template>
  <div class="roll" @mouseleave="hidePersonDetail">
    <ul class="top-bar" @click="hidePersonDetail " @touchstart.stop.prevent="hidePersonDetail">
      <li>
        <p>{{allCount}}</p>
        <p>总人数</p>
      </li>
      <li>
        <p>{{$store.state.persons?$store.state.persons.length:0}}</p>
        <p>连接人数</p>
      </li>
    </ul>
    <ul style="height:29rem; overflow-y: auto;background:transparent; color: rgb(255,255,247);font-size: 1.3rem;line-height: 1.8rem;">
      <li>
        <el-row class="tac">
          <el-col>
            <!--:default-openeds="[$store.state.mapid+'']"-->
            <!--unique-opened="true"-->
            <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#1c295a"
                    text-color="#fff"
                    active-text-color="rgba(44, 59, 120, 0.9)"
                    :default-openeds="opends"
                    :unique-opened="true"
                    @open="changeState"
                    >
              <el-submenu v-for="(item,index) in mapList" :key="index" :index="item.mapid+''">
                <template slot="title">
                  <i class="el-icon-location" :style="menuIndex == item.mapid?'color:#99f8ff; font-weight:bold':''"></i>
                  <span :style="menuIndex == item.mapid?'color:#99f8ff; font-weight:bold':''">{{ item.name }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item :index="item.mapid+'1'">
                    <ul class="content">
                      <li @click="showPersonDetail(item.mapid,0,$event)" @touchstart.stop.prevent="showPersonDetail(item.mapid,0,$event)" @mouseenter="showPersonDetail(item.mapid,0,$event)">
                        <span>公安人员：{{getPoliceLength(item.mapid)}}人</span>
                        <div
                            class="wrapper"
                        >
                          <!--@mouseleave="hidePersonDetail"-->
                          <span class="fonts">
                            <!--<span class="icon iconfont">&#xe62f;</span>-->
                            <span class="icon iconfont">&#xe60e;</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </el-menu-item>
                  <el-menu-item :index="item.mapid+'2'">
                    <ul class="content">
                      <li @click="showPersonDetail(item.mapid,1,$event)" @touchstart.stop.prevent="showPersonDetail(item.mapid,1,$event)" @mouseenter="showPersonDetail(item.mapid,1,$event)">
                        <span @click="showPersonDetail(item.mapid,1,$event)" @touchstart.stop.prevent="showPersonDetail(item.mapid,1,$event)">地铁人员：{{getWorkerLength(item.mapid)}}人</span>
                        <div
                            class="wrapper"
                        >
                          <span class="fonts">
                            <!--<span class="icon iconfont">&#xe62f;</span>-->
                            <span class="icon iconfont">&#xe60e;</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </li>
    </ul>
    <!--<div class="flash">-->
    <!--<p>2019.10.15 16:23</p>-->
    <!--<button type="button" @click="flash">刷新</button>-->
    <!--</div>-->
    <transition name="slide-fade">
      <div class="personDetail" v-show="display" ref="personDetail" @click="hidePersonDetail"  @touchstart.stop.prevent="hidePersonDetail">
        <div v-if="typeState == 0">
          <ul class="contents" v-if="currPoliceList.length > 14">
            <template v-for="(item,index) in currPoliceList">
              <li v-if="(index % 2)== 0" :key="index">
                <label
                  style="min-width: 10rem; text-align: left; color: #99f8ff"
                >{{item.person.job}} ：</label>
                <label style="text-align: left; min-width: 10rem;">{{item.person.name}}</label>
                <label
                  style="min-width: 10rem; text-align: left; color: #99f8ff"
                  v-if="index+1<policeList.length"
                >{{currPoliceList[index+1].person.job}} ：</label>
                <label
                  style="text-align: left; min-width: 10rem;"
                  v-if="index+1<policeList.length"
                >{{currPoliceList[index+1].person.name}}</label>
              </li>
            </template>
          </ul>
          <ul class="contents" v-if="currPoliceList.length < 15">
            <li v-for="(item,index) in currPoliceList" :key="index">
              <label
                style="min-width: 10rem; text-align: left; color: #99f8ff"
              >{{item.person.job}} ：</label>
              <label style="text-align: left; min-width: 10rem;">{{item.person.name}}</label>
            </li>
          </ul>
        </div>
        <div v-if="typeState == 1">
          <ul class="contents" v-if="currWorkerList.length > 14">
            <template v-for="(item,index) in currWorkerList">
              <li v-if="(index % 2)== 0" :key="index">
                <label
                  style="min-width: 10rem; text-align: left; color: #99f8ff"
                >{{item.person.job}} ：</label>
                <label style="text-align: left; min-width: 10rem;">{{item.person.name}}</label>
                <label
                  style="min-width: 10rem; text-align: left; color: #99f8ff"
                  v-if="index+1<currWorkerList.length"
                >{{currWorkerList[index+1].person.job}} ：</label>
                <label
                  style="text-align: left; min-width: 10rem;"
                  v-if="index+1<currWorkerList.length"
                >{{currWorkerList[index+1].person.name}}</label>
              </li>
            </template>
          </ul>
          <ul class="contents" v-if="currWorkerList.length < 15">
            <li v-for="(item,index) in currWorkerList" :key="index">
              <label
                style="min-width: 10rem; text-align: left; color: #99f8ff"
              >{{item.person.job}} ：</label>
              <label style="text-align: left; min-width: 10rem;">{{item.person.name}}</label>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAllPerson, getAllMap } from "@/apis/interfance.js";
export default {
  data() {
    return {
      display: false,
      allCount: 0,
      personList: [],
      policeList: [],
      workerList: [],
      typeState: 0,
      mapList: [],
      currentMapId: 0,
      currPoliceList: [],
      currWorkerList: [],
      opends: [this.$store.state.mapid+''],
      menuIndex: this.$store.state.mapid,
    };
  },
  watch: {
    "$store.state.persons.length": {
        handler() {
            this.getPersonList();
        }
    }
  },
  mounted() {
    this.getAllMap();
    this.getPersonList();
    getAllPerson().then(data => {
      this.allCount = data.count;
    });
  },
  methods: {
    getPoliceLength(id){
      let length = 0;
      this.policeList.forEach(val => {
          if(val.mapid === id){
              length += 1;
          }
      })
      return length;
    },
    getWorkerLength(id){
        let length = 0;
        this.workerList.forEach(val => {
            if(val.mapid === id){
                length += 1;
            }
        })
        return length;
    },
    getAllMap(){
        getAllMap().then(data => {
            this.mapList = data.results;
        })
    },
    getPersonList() {
      this.personList = this.$store.state.persons;
      this.policeList = [];
      this.workerList = [];
      for (var i = 0; i < this.personList.length; i++) {
        if (this.personList[i].person.type === 0) {
          this.policeList.push(this.personList[i]);
        } else if (this.personList[i].person.type === 1) {
          this.workerList.push(this.personList[i]);
        }
      }
    },
    flash() {
      this.$message({
        type: "info",
        message: "正在发送请求"
      });
    },
    handleMsg() {
      alert("消息处理");
    },
    handleWrite() {
      alert("记录");
    },
    // lfq
    showPersonDetail(mapId,typeState) {
      this.currentMapId = mapId;
      this.currPoliceList = [];
      this.currWorkerList = [];
      this.policeList.forEach(val => {
          if(val.mapid === mapId){
              this.currPoliceList.push(val);
          }
      })
      this.workerList.forEach(val => {
          if(val.mapid === mapId){
              this.currWorkerList.push(val);
          }
      })
      this.typeState = typeState;
      this.display = true;
    },
    hidePersonDetail() {
      this.display = false;
    },
    changeState(index){
      this.menuIndex = index;
    }
  }
};
</script>

<style lang="less" scoped>
/*过渡动画*/
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-2rem);
  opacity: 0;
}
.personDetail {
  /*width: 159px;*/
  /*max-height: 400px;*/
  overflow-y: auto;
  background: url("../images/right_color.png") no-repeat;
  background-size: 100% 100%;
  opacity: 0.97;
  border-radius: 0px 3px 3px 0px;
  position: fixed;
  left: 24.5rem;
  top: 14.4rem;
  display: flex;
  align-items: center;
  z-index: 10; /* lfq 20200324*/
  .contents {
    font-size: 1.3rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 2.2rem;
    li {
      margin: 0.2rem 1rem;
      padding: 0.4rem;
      border-radius: 4rem;
      display: flex;
      /*justify-content: space-between;*/
      align-items: center;
      cursor: pointer;
      .fonts {
        display: none;
        span {
          margin-right: 0.8rem;
          font-size: 1.6rem;
        }
      }
      &:hover {
        background: #0096ff;
        .fonts {
          display: inline-block;
        }
      }
    }
  }
}
.roll ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.4rem; /*高宽分别对应横竖滚动条的尺寸*/
}
.roll ::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 0.3rem;
  background: rgba(255, 255, 255, 0.3);
}
.roll {
  width: 23.9rem;
  height: 40.0rem;
  background: url("../images/right_color.png") no-repeat;
  background-size: 100% 100%;
  opacity: 0.97;
  border-radius: 0px 3px 3px 0px;
  p {
    margin: 0.6rem 0;
    font-size: 1.4rem;
  }
  .top-bar {
    display: flex;
    color: rgba(134, 208, 255, 1);
    justify-content: space-between;
    li {
      padding: 2.0rem 0;
      flex-grow: 1;
      text-align: center;
      font-size: 1.4rem;
      p:first-of-type {
        font-weight: 400;
        font-size: 3.0rem;
      }
      border-bottom: 1px solid rgba(178, 223, 255, 0.2);
    }
  }
  .content {
    font-size: 1.4rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 1.2rem;
    li {
      height: 3.4rem;
/*      margin: 0px 0px;
      padding: 4px;*/
      border-radius: 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      /*.wrapper {
        height: 26rem;
      }*/
      .fonts {
        display: inline-block;
        span {
          margin-right: 0.8rem;
          font-size: 1.6rem;
        }
      }
      &:hover {
        /*background: #0096ff;*/
        .fonts {
          display: inline-block;
        }
      }
    }
  }
  .flash {
    margin-top: 16rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1.4rem;
    color: rgba(134, 208, 255, 1);
    button {
      background: 0;
      border: 0;
      color: rgba(134, 208, 255, 1);
      cursor: pointer;
    }
  }
}
.el-menu{
  overflow-x: hidden;
  border-right: none;
}
.el-menu   .el-submenu__title {
  font-size: 1.5rem;
  padding-left:0rem !important;
}
.el-menu-item,   .el-submenu__title {
  height: 3.9rem;
  line-height: 3.6rem;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
}
.el-menu .el-submenu__icon-arrow{
  right:1rem !important;
}
.el-menu .el-menu-item-group__title {
  padding: 0rem;
}
</style>