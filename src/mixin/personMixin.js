const personMixin = {
    data() {
        return {
            followFlag: false
        }
    },
    methods: {
        //实时轨迹
        handleTrack() {
            let arr = this.$store.state.persons.filter(value => {
                if (value.person.id === this.$store.state.personInfo.id) {
                    return value.labelId
                }
            });
            if (arr.length === 0) {
                this.$message({
                    message: "该人员暂未上线",
                    type: "warning"
                });
                return;
            }
            this.$store.state.persons.forEach(value => {
                if (value.labelId == this.$store.state.labelData.id) {
                    value.track = !value.track;
                    value.trackArr = [];
                    value.color && value.colorArr.push(value.color);
                    value.color = "";
                    this.trackFlag = value.track;
                }
            });
        },
        personFollow() {
            let arr = this.$store.state.persons.filter(value => {
                if (value.person.id === this.$store.state.personInfo.id) {
                    return value.labelId
                }
            });
            if (arr.length === 0) {
                this.$message({
                    message: "该人员暂未上线",
                    type: "warning"
                });
                return;
            }
            this.$store.state.persons.forEach(value => {
                if (value.labelId == this.$store.state.labelData.id) {
                    value.follow = !value.follow;
                    value.isSelected = true;
                    if (value.track !== true) {
                        value.trackArr = [];
                    }
                    if(value.follow){
                        this.$store.state.followPerson = value;
                    }else{
                        this.$store.state.followPerson = null;
                    }
                    value.color && value.colorArr.push(value.color);
                    value.color = "";
                    value.isFirst = true;
                    this.followFlag = value.follow;
                } else {
                    value.follow = false;
                }
            });
        }
    }
}

export default personMixin;