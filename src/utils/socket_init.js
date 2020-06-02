import params from "@/apis/commonParams.js"

function socketInit(Person) {
    const ws = new WebSocket(`${params.wsUrl}/location/`);
    ws.onopen = function () {
        console.log("已建立定位连接!!!!");
    }
    ws.onmessage = (e) => {
        let flag = false;
        let data = JSON.parse(e.data);
        this.pos = [];
        this.person.forEach((value) => {
            if (value.labelId === data.label_id) {
                value.steps.push(data);
                flag = true;
            }
        })
        //新添加id  就创建一个Person实例放入person中
        if (flag === false && this.$store.state.mapid == data.map_id ) {
            this.person.push(new Person(90, 165, data.pos[0], data.pos[1], data.position, this.scale, data.label_id));
            //test20200306
            // for(let i =0;i<400;i++){
            //     this.person.push(new Person(90, 165, data.pos[0], data.pos[1], data.position, this.scale, data.label_id));
            // }
        } else {
            flag = false;
        }
    };
    ws.onclose = function () {
        console.log("连接已关闭...");
    };
}
export default socketInit;