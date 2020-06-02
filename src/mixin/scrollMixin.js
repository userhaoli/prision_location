const scrollMixin = {
    data() {
        return {
            oldY: 0,
        }
    },
    methods: {
        getFirstY(e) {
            this.oldY = e.targetTouches[0].pageY;
        },
        scrollElement(e, elRef) {
            if (elRef) {
                this.$refs[elRef].scrollTop -= e.targetTouches[0].pageY - this.oldY;
            } else {
                this.$refs.listBar.scrollTop -= e.targetTouches[0].pageY - this.oldY;
            }
            this.oldY = e.targetTouches[0].pageY;
        }
    }
}

export default scrollMixin;