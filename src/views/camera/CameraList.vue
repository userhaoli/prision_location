<template>
  <div class="table-wrapper pop-container">
    <div class="pop-title">
      <span>摄像头</span>
      <span class="icon iconfont marginR10">&#xe640;</span>
    </div>
    <div class="camera-oper">
      <spinner :content="mapArr[mapid]||'地图'" :list="mapArr" @sendValue="getValue"></spinner>
      <search-item @valueChange="searchValue" holder="请输入设备编号"></search-item>
    </div>
    <el-table
      :data="classList"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      :header-row-style="headerRowStyle"
      @touchstart="getFirstY"
      @touchmove="scrollElement"
      ref="listBar"
    >
      <el-table-column type="expand" align="center">
        <template slot-scope="scope">
          <el-form class="expandCameraInfo" label-width="8rem" label-position="left">
            <el-row>
              <el-col>
                <el-form-item label="坐标X" class="slotScope">{{scope.row.x}}</el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="坐标Y" class="slotScope">{{scope.row.y}}</el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="URL地址" class="slotScope">{{scope.row.url?scope.row.url:""}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="camera_id" label="摄像头编号"></el-table-column>
      <!-- <el-table-column :formatter="statusFormat" label="所在线路"></el-table-column> -->
      <!-- <el-table-column prop="map.name" label="所在区域"></el-table-column> -->
      <el-table-column prop="camera_name" label="名称"></el-table-column>
      <el-table-column prop="map.name" label="所在地图"></el-table-column>
      <el-table-column label="其他" width="60px">
        <template slot-scope="scopes">
          <div class="check-detail">
            <div class="content-controller play-icon">
              <img
                src
                alt="播放"
                title="播放"
                @click="loadMonitor(scopes.row.id)"
                @touchstart.stop.prevent="loadMonitor(scopes.row.id)"
              />
              <!--播放视频 lfq-->
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-check">
      <div>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="10"
          :current-page="page"
          prev-text="上一页"
          next-text="下一页"
          @current-change="getData"
          @prev-click="getData"
          @next-click="getData"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/common/Spinner.vue";
import SearchItem from "@/components/common/SearchItem.vue";
import {
  getCameraPage,
  getCameraData //lfq
} from "@/apis/interfance.js";
import scrollMixin from "@/mixin/scrollMixin.js";

export default {
  components: {
    Spinner,
    SearchItem
  },
  data() {
    return {
      page: 1,
      total: 0,
      classList: [],
      mapid: "",
      mapArr: [
        "天府广场中间圆形区域",
        "",
        "天府广场负三楼一号线",
        "天府广场负四楼二号线"
      ]
    };
  },
  mixins: [scrollMixin],
  mounted() {
    getCameraPage(this.page).then(data => {
      this.total = data.count;
      this.classList = data.results;
    });
  },
  methods: {
    //调取监控视频播放 lfq
    loadMonitor(id) {
      getCameraData(id).then(data => {
        let vId = data.id;
        let name = data.camera_name;
        let player = data.id;
        let rtsp = data.url;
        // let rtsp = "rtsp://" + data.username + ":" + data.password + "@" + data.ip;
        //  let rtsp = "rtsp://admin:admin@192.168.1.168:554/cam/realmonitor?channel=1&subtype=1";
        let active = false;
        let newMonitorList = [
          { id: vId, name: name, rtsp: rtsp, player: player, active: active }
        ]; //要调取的监控
        this.$store.commit("changeNewMonitorList", newMonitorList);
      });
      this.$emit("popVideo", id);
    },
    //分页
    getData(page) {
      this.page = page;
      let mapid = this.mapid === "" ? "" : this.mapid + 1;
      getCameraPage(page, mapid).then(data => {
        this.classList = data.results;
      });
    },
    //选择设备
    checkEquip(id) {
      this.$emit("dblclicked", { id, flag: "camera" });
    },
    // statusFormat: function(row) {
    //   let status = row.map.station.line;
    //   return status + "号线";
    // },
    rowStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    cellStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    headerCellStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    headerRowStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    getValue(value, index) {
      this.mapid = index;
      this.page = 1;
      console.log(value, index);
      getCameraPage(this.page, index + 1).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    },
    searchValue(value) {
      this.page = 1;
      getCameraPage(this.page, this.mapid, value).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    }
  }
};
</script>

<style lang="less">
.el-form-item__label {
  color: rgba(255, 255, 255, 1);
}
.expandCameraInfo .slotScope {
  color: rgb(255, 255, 255);
}
.expandCameraInfo {
  line-height: 1rem;
}
.slotScope form-label {
  color: rgba(255, 255, 255, 1);
}

.table-wrapper .el-table--fit {
  /*height: 40rem;*/
  background: rgba(178, 223, 255, 0.1);
  border-radius: 0.5rem;
}
// .table-wrapper  .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.table-wrapper .el-table_1_column_5 {
  width: 5rem !important;
}
.table-wrapper .el-table__header-wrapper {
  height: 3.6rem;
  background: rgba(178, 223, 255, 0.2);
  border-radius: 0.5rem 0.5rem 0rem 0rem;
}
.table-wrapper .el-table__header-wrapper th {
  padding: 0;
}
.table-wrapper .el-table__expand-icon {
  color: #fff;
}
.table-wrapper .el-form-item__label {
  color: #fff;
}
.table-wrapper .el-table__expand-icon > .el-icon {
  margin-top: -0.7rem;
}
.table-wrapper .el-form-item {
  padding: 0 5.5rem;
  margin: 0;
}
.table-wrapper .el-table tr {
  background-color: transparent !important;
  height: 3.6rem;
}
.table-wrapper .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  padding: 0;
}
.el-table__row > td {
  border: none;
}
.el-table::before {
  height: 0rem;
}
.el-table {
  height: 37.4rem;
  overflow: auto;
  &::-webkit-scrollbar {
    /*!*滚动条整体样式*!*/
    width: 0.5rem; /* !*高宽分别对应横竖滚动条的尺寸*!*/
  }
  &::-webkit-scrollbar-thumb {
    /*!*滚动条里面小方块*!*/
    border-radius: 0.3rem;
    background: rgba(255, 255, 255, 0.3);
    height: 3rem;
  }
}
.table-wrapper .el-table tr:hover {
  background: rgba(134, 208, 255, 0.1) !important;
}
.table-wrapper {
  .camera-oper {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    & > .item {
      width: 18rem;
    }
    & > .search-item {
      width: 18rem;
    }
  }
  el-table-column {
    background: rgba(24, 45, 77, 0.6);
    display: flex;
    align-items: center;
    line-height: 4rem;
    /*// padding: 1rem 0;*/
    cursor: pointer;
    & > div {
      display: inline-block;
      width: 4%;
    }
  }

  .el-table tr:hover {
    color: rgba(134, 208, 255, 1);
    background: rgba(134, 208, 255, 0.1);
    img {
      display: block;
    }
    .check-detail > span {
      /*display: inline;*/
      margin-left: 2rem;
    }
  }
  .check-detail {
    color: rgba(134, 208, 255, 1);
    height: 3rem;
    display: flex;
    padding-left: 1rem;
    span {
      display: none;
    }
  }
  .play-icon {
    justify-content: space-between;
    img {
      width: 3rem;
      height: 3rem;
      /*display: none;*/
      display: block;
    }
  }
}
.el-pagination__total {
  color: #fff;
}
</style>