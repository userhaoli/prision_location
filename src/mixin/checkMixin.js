const checkMixin = {
    methods: {
        checkAll(flag, list) {
            list.forEach(value => {
                // value.is_selected = flag;
                this.$set(value, "is_selected", flag);
            });
        },
        selectItem(e, index, list) {
            list[index].is_selected = e;
            return list.every(val => {
                return val.is_selected === true;
            });
        },
        backToMain() {
            this.$emit("back");
            this.$store.state.fenceData = {
                persons: []
            };
            this.$store.state.chartArr = [];
        }
    }
}

export default checkMixin;