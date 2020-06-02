<template>
  <div class="panel">
    <div class="person-info">
      <span>{{$store.state.labelData.person?$store.state.labelData.person.name:""}}</span>
      <span>{{$store.state.labelData.person?$store.state.labelData.person.polid:""}}</span>
      <span class="del" @click="hidden" @touchstart.stop.prevent="hidden"></span>
    </div>
    <ul class="person-oper">
      <li @click="hiddenTrack" @touchstart.stop.prevent="hiddenTrack">
        <lh-button
          :content="flag===true?'隐藏实时轨迹':'显示实时轨迹'"
          :size="{ width: '100px',lineHeight: '30px'}"
        ></lh-button>
      </li>
      <li @click="checkHistoryTrack" @touchstart.stop.prevent="checkHistoryTrack">
        <lh-button content="查看历史轨迹" :size="{ width: '100px',lineHeight: '30px'}"></lh-button>
      </li>
      <li @click="checkPersonalMsg" @touchstart.stop.prevent="checkPersonalMsg">
        <lh-button content="查看个人信息" :size="{ width: '100px',lineHeight: '30px'}"></lh-button>
      </li>
      <li @click="personFollow" @touchstart.stop.prevent="personFollow">
        <lh-button
          :content="followFlag===true?'取消实时跟踪':'实时跟踪'"
          :size="{ width: '160px',lineHeight: '30px'}"
        ></lh-button>
      </li>
    </ul>
  </div>
</template>
<script>
import LhButton from "@/components/common/LhButton.vue";
import personMixin from "@/mixin/personMixin.js";
export default {
  mixins: [personMixin],
  components: {
    LhButton
  },
  props: {
    panelFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      flag: false,
      followFlag:false
    };
  },
  mounted(){
   this.$store.state.persons.forEach(value => {
        if (value.labelId == this.$store.state.labelData.id) {
          this.flag = value.track;
          this.followFlag = value.follow;
        }
      });
  },
  methods: {
    hidden() {
      this.$emit("changePanelState", false);
    },
    hiddenTrack() {
      this.$store.state.persons.forEach(value => {
        if (value.labelId == this.$store.state.labelData.id) {
          value.track = !value.track;
          value.trackArr = [];
          value.color = "";
          this.flag = value.track;
        }
      });
    },
    checkHistoryTrack() {},
    checkPersonalMsg() {
      this.$emit("checkPersonInfo", this.$store.state.labelData.person);
    },
  },
  watch: {
    "$store.state.labelData.id": {
      handler(val) {
        this.$store.state.persons.forEach(value => {
          if (value.labelId == val) {
            this.flag = value.track;
            this.followFlag = value.follow;
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.panel {
  width: 22.5rem;
  height: 13rem;
  background: url("../images/panel.png") no-repeat;
  background-position: center;
  background-size: 100% 100%;
  color: #fff;
  box-shadow:0.3rem 0.4rem 1rem 0rem rgba(4,0,0,0.6);
  .person-info {
    display: flex;
    justify-content: space-between;
    height: 1.6rem;
    font-size: 1.6rem;
    padding: 1.6rem 0 0 0;
    line-height: 1.6rem;
    span {
      width: 16%;
      margin-left: 1rem;
    }
    span:first-of-type {
      flex-grow: 1;
    }
    .del {
      background: url(../images/XX.png) no-repeat;
      background-position: center;
      margin-left: 1rem;
      cursor: pointer;
    }
    button{
      padding:0;
    }
  }
  .person-oper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    li {
      margin-top: 1rem;
      cursor: pointer;
    }
  }
}
</style>