import params from "@/apis/commonParams.js"

function wsAlarmInit() {
    const ws = new WebSocket(`${params.wsUrl}/alarmdata/`);
    ws.onopen = () => {
        this.$message({
            type: 'success',
            message: '报警信息连接已开启!'
        });
    }
    ws.onmessage = (e) => {
        let data = JSON.parse(e.data)
        this.$store.state.unhandleAlarm.unshift(data);
        this.rightFlag = true;
     
        // this.$confirm('您有一条新的报警信息，请及时处理', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     // this.$message({
        //     //   type: 'success',
        //     //   message: '删除成功!'
        //     // });
        //     this.rightFlag = true;
        //   })
        if (data.type.level === 3) {
            // this.popMonitorVideo(data.cameraid);
            this.popMonitorVideo(2);
            this.cameraMenu = false;
        }
    };
    ws.onclose = () => {
        this.$message({
            type: 'error',
            message: '报警信息连接已关闭!'
        });
    };
}
export default wsAlarmInit;