import axios from 'axios';
import params from "@/apis/commonParams.js"
let baseURL = params.baseUrl;
// let instance = axios.create({
//     timeout: 1000 * 6
// });

function interval(Person, mapid) {
    return setInterval(() => {
        axios.get(
            baseURL + `/position/${mapid}/`
        ).then(data => {
            let flag = false;
            data = data.data;
            let keyArr = Object.keys(data)
            let str ="";
            data[-1] && data[-1].forEach(value => {
                this.$store.state.persons = this.$store.state.persons.filter(val => {
                    return val.labelId != value;
                })
                str += this.$store.state.personList[value].name + "   ";
          
            })
            if (str) {
                this.$message({
                    showClose: true,
                    message: str + "下线",
                    type: "warning"
                });
            }

            let persons = this.$store.state.persons;
            keyArr.forEach(value => {
                persons.length && persons.forEach((val) => {
                    if (val.labelId == value) {
                        //test1111111111111
                        val.steps = [...val.steps, ...data[value]]
                        flag = true;
                        //test22222222222
                        // let firstFlag = true;
                        // let num = data[value].length !== 0 ? data[value][0].no : -1;
                        // let maxNum = val.steps[val.steps.length - 1] ? val.steps[val.steps.length - 1].no : 0;
                        // data[value].forEach((item) => {
                        //     if(item.no < num && firstFlag){
                        //         maxNum = item.no -1;
                        //         firstFlag = false;
                        //     }
                        //     let flag1 = item.no > maxNum;
                        //     if (flag1) {
                        //         val.steps.push(item)
                        //         maxNum = item.no;
                        //     }
                        // })
                        // flag = true;
                    }
                });
                if (data[value].length === 0) return;
                // if (flag === false && this.$store.state.mapid == data[value][0].map_id) {  不过滤非本地图人员数据
                if (flag === false) {
                    //test20200306
                    if (data[value][0].pos) {
                        let firstPoint = data[value][0];
                        let person = new Person(100, 145, firstPoint.pos[0], firstPoint.pos[1], firstPoint.position, this.scale, firstPoint.label_id, firstPoint.map_id, this.$store.state.personList[value]);
                        person.steps = [...data[value]];
                        person.winWidth = window.innerWidth;
                        person.winHeight = window.innerHeight;
                        persons.push(person);
                        // for (var i = 0; i < 150; i++) {
                        //     persons.push(person);
                        // }
                        
                        //     this.$message({
                        //     showClose: true,
                        //     message: "["+this.$store.state.personList[value].job +"] "+ this.$store.state.personList[value].name+"上线了！！",
                        //     type: 'success'
                        // })
                    }
                } else {
                    flag = false;
                }
                persons.length === 0 && (() => {
                    if (data[value][0].pos) {
                        let firstPoint = data[value][0];
                        let person = new Person(100, 145, firstPoint.pos[0], firstPoint.pos[1], firstPoint.position, this.scale, firstPoint.label_id, firstPoint.map_id, this.$store.state.personList[value]);
                        person.steps = [...data[value]];
                        person.winWidth = window.innerWidth;
                        person.winHeight = window.innerHeight;
                        persons.push(person);
                    }
                })()
            })
            // if (flag === false && this.$store.state.mapid == data.map_id ) {
            //     //test20200306
            //     // for(let i =0;i<400;i++){
            //     //    persons.push(new Person(90, 165, data.pos[0], data.pos[1], data.position, this.scale, data.label_id));
            //     // }
            // } else {
            //     flag = false;
            // }
        })
    }, 1000)
}



export default interval;