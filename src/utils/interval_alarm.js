import axios from 'axios';
import params from "@/apis/commonParams.js"
let baseURL = params.baseUrl;
function intervalAlarm() {
    return setInterval(() => {
        axios.get(
            baseURL + `/alarmdata/?size=200&status=False`
        ).then(data => {
            data = data.data.results;
            this.$store.state.unhandleAlarm = data;
            // console.log( "111",this.$store.state.unhandleAlarm);
            let len = data.length;
            if (len === 0 || !data[0]) return;
            for (let i = 0; i < len; i++) {
                let nowTime = +new Date(),
                    value = data[i];
                if (nowTime - value.logtime > 5000) {
                    break;
                }
                this.rightFlag = true;
                let labelid = value.labelid;
                if(labelid<100){
                    labelid = "UWBTF01010" + value.labelid; 
                }else{
                    labelid = "UWBTF0101" + value.labelid; 
                }
                this.findPerson(labelid)
            }
        })
    }, 5000)
}



export default intervalAlarm;