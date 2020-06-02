function Person(width, height, startX, startY, direction, scale, labelId, mapid, person) {
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    this.direction = direction;
    this.scale = scale;
    this.isSelected = false; //是否选中
    this.i = 0;
    this.labelId = labelId; //标签id
    this.follow = false; //人员是否跟随
    this.steps = []; //人员行走的数据
    this.mapid = mapid; //地图id 
    this.track = false; //是否显示轨迹
    this.trackArr = []; //轨迹坐标点
    this.color = ""; //颜色
    this.isFirst = true; //实时播放视频时是否时第一个
    this.person = person;
    this.trackBackArr = [];
    this.forwardArr = [];
    this.P_Width = 90;
    this.P_HEIGHT = 165;
    this.realWidth = 0;
    this.realHeight = 0;
    this.t = 0;
    this.distance = 0;
    this.isOffset = false;
    this.offsetArr = [];
    this.offsetDeg = 0;
    this.oldPoint = [];

}
//更新状态
Person.prototype.update = function (nextX, nextY, direction, scale, sx, sy, mapid) {
    let flag = this.startX === nextX && this.startY === nextY;
    if (flag === true) {
        this.src = direction + 49;
    }
    this.startX = nextX;
    this.startY = nextY;
    this.scale = scale;
    this.sx = sx;
    this.sy = sy;
    this.mapid = mapid;
    this.direction = direction;
    if (flag === true) return;
    this.i = this.direction === direction ? this.i + 1 : 1;
    // 修改
    this.i = this.i > 6 ? 1 : this.i;
    this.src = direction + this.i;
}
//绘制
Person.prototype.drawImage = function () {
    let width = this.P_Width * this.scale,
        height = this.P_HEIGHT * this.scale,
        actions = null,
        pos = this.imageToCanvas([this.startX, this.startY]);
    if (this.isSelected === false && this.follow === false) {
        actions = this.actionObj;
    } else {
        actions = this.actionObj;
        width = width * 1.4;
        height = height * 1.4;
    }
    this.relWidth = width;
    this.realHeight = height;
    this.context.beginPath();
    this.context.fillStyle = "rgba(0,0,0,0.7)";
    this.context.textAlign = 'center';
    let len = 40 * this.scale,
        r = 20 * this.scale,
        size = 30 * this.scale;
    this.context.lineTo(pos[0] - len, pos[1] - height * 1.2 - r);
    this.context.moveTo(pos[0] + len, pos[1] - height * 1.2 - r);
    this.context.moveTo(pos[0] + len, pos[1] - height * 1.2 + r);
    this.context.moveTo(pos[0] - len, pos[1] - height * 1.2 + r);
    this.context.fill();
    this.context.beginPath();
    this.context.arc(pos[0] + len, pos[1] - height * 1.2, r, 1.5 * Math.PI, 0.5 * Math.PI);
    this.context.arc(pos[0] - len, pos[1] - height * 1.2, r, 0.5 * Math.PI, 1.5 * Math.PI);
    this.context.fill();
    this.context.closePath();
    this.context.beginPath();
    this.context.font = `bold ${size}px Arial`;
    this.context.fillStyle = "#fff";
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.person.name, pos[0], pos[1] - height * 1.2, 2 * len + 2 * r);
    this.context.closePath();
    this.context.drawImage(actions["img" + this.src], pos[0] - width / 2, pos[1] - 184 / 220 * height, width, height);
    if (this.follow) {
        this.t = this.t >= 17 ? 0 : this.t + 1;
        this.context.beginPath();
        this.context.font = `bold 20px Arial`;
        this.context.fillStyle = "#000";
        this.context.textAlign = 'center';
        let arr = ["正在实时跟踪中.", "正在实时跟踪中.", "正在实时跟踪中.",
            "正在实时跟踪中..", "正在实时跟踪中..", "正在实时跟踪中..",
            "正在实时跟踪中...", "正在实时跟踪中...", "正在实时跟踪中...",
            "正在实时跟踪中....", "正在实时跟踪中....", "正在实时跟踪中....",
            "正在实时跟踪中.....", "正在实时跟踪中.....", "正在实时跟踪中.....",
            "正在实时跟踪中......", "正在实时跟踪中......", "正在实时跟踪中......"
        ]
        this.context.fillText(this.person.name + "  " + arr[this.t], this.winWidth / 2, this.winHeight / 4, 300);
        this.context.closePath();
    }
}

// //绘制水滴图
Person.prototype.drawWaterImage = function () {
    let width = this.width * this.scale,
        height = this.height * this.scale,
        action = null,
        pos = this.imageToCanvas([this.startX, this.startY]);
    if (this.person.type === 0) {
        action = this.waterShape['police_unchecked']
    } else {
        switch (this.person.job) {
            case "值班员":
                action = this.waterShape['staff_unchecked'][0];
                break;
            case "站务员":
                action = this.waterShape['staff_unchecked'][1];
                break;
            case "保安":
                action = this.waterShape['staff_unchecked'][2];
                break;
            case "保洁":
                action = this.waterShape['staff_unchecked'][3];
                break;
            default:
                action = this.waterShape['staff_unchecked'][0];
                break;
        }
    }
    if (this.isSelected === true || this.follow === true) {
        // action = this.person.type === 0 ? this.waterShape['police_checked'] : this.waterShape['staff_checked'];
        // action = this.person.type === 0 ? this.waterShape['police_unchecked'] : this.waterShape['staff_unchecked'];
        width = width * 1.4;
        height = height * 1.4;
    }
    this.realWidth = width;
    this.realHeight = height;
    this.context.beginPath();
    this.context.fillStyle = "rgba(0,0,0,0.7)";
    this.context.textAlign = 'center';
    let len = 40 * this.scale,
        r = 20 * this.scale,
        size = 30 * this.scale;
    this.context.lineTo(pos[0] - len, pos[1] - height * 1.3 - r);
    this.context.moveTo(pos[0] + len, pos[1] - height * 1.3 - r);
    this.context.moveTo(pos[0] + len, pos[1] - height * 1.3 + r);
    this.context.moveTo(pos[0] - len, pos[1] - height * 1.3 + r);
    this.context.fill();
    this.context.beginPath();
    this.context.arc(pos[0] + len, pos[1] - height * 1.3, r, 1.5 * Math.PI, 0.5 * Math.PI);
    this.context.arc(pos[0] - len, pos[1] - height * 1.3, r, 0.5 * Math.PI, 1.5 * Math.PI);
    this.context.fill();
    this.context.closePath();
    this.context.beginPath();
    this.context.font = `bold ${size}px Arial`;
    this.context.fillStyle = "#fff";
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    // this.context.fillText(this.person.name, pos[0], pos[1] - height * 1.3,2*len+2*r);
    this.context.fillText(this.person.name, pos[0], pos[1] - height * 1.3, 2 * len);
    this.context.closePath();
    this.context.drawImage(action, pos[0] - width / 2, pos[1] - height, width, height);
    if (this.follow) {
        this.t = this.t >= 35 ? 0 : this.t + 1;
        this.context.beginPath();
        this.context.font = `bold 20px Arial`;
        this.context.fillStyle = "#fff";
        this.context.textAlign = 'center';
        let arr = ["正在实时跟踪中.", "正在实时跟踪中.", "正在实时跟踪中.", "正在实时跟踪中.", "正在实时跟踪中.", "正在实时跟踪中.",
            "正在实时跟踪中..", "正在实时跟踪中..", "正在实时跟踪中..", "正在实时跟踪中..", "正在实时跟踪中..", "正在实时跟踪中..",
            "正在实时跟踪中...", "正在实时跟踪中...", "正在实时跟踪中...", "正在实时跟踪中...", "正在实时跟踪中...", "正在实时跟踪中...",
            "正在实时跟踪中....", "正在实时跟踪中....", "正在实时跟踪中....", "正在实时跟踪中....", "正在实时跟踪中....", "正在实时跟踪中....",
            "正在实时跟踪中.....", "正在实时跟踪中.....", "正在实时跟踪中.....", "正在实时跟踪中.....", "正在实时跟踪中.....", "正在实时跟踪中.....",
            "正在实时跟踪中......", "正在实时跟踪中......", "正在实时跟踪中......", "正在实时跟踪中......", "正在实时跟踪中......", "正在实时跟踪中......"
        ]
        this.context.fillText(this.person.name + "  " + arr[this.t], this.winWidth / 2, this.winHeight / 4, 300);
        this.context.closePath();
    }
}
//绘制轨迹
Person.prototype.drawTrack = function (personPos, color) {
    let arr = [];
    personPos.forEach((value, index) => {
        if ((index / 4) === parseInt(index / 4, 10)) {
            arr.push(value)
        }
    })
    arr.push(personPos[personPos.length - 1]);
    this.context.beginPath();
    this.context.strokeStyle = color;
    let last2x, last2y, last1x, last1y, nowX, nowY, nextX, nextY, cp1x, cp1y, cp2x, cp2y;
    if (arr.length < 3) return;
    arr.forEach((value, index) => {
        let point, pos;
        value = this.imageToCanvas(value);
        if (index === 0) {
            this.context.lineTo(value[0], value[1]);
            return;
        } else if (index === 1) {
            point = this.imageToCanvas(arr[index - 1])
            last2x = point[0];
            last2y = point[1];
            //下一个点
            pos = this.imageToCanvas(arr[index + 1]);
            nextX = pos[0];
            nextY = pos[1];
        } else if (index === arr.length - 1) {
            //下一个点
            nextX = value[0];
            nextY = value[1];
        } else {
            //上两个点
            point = this.imageToCanvas(arr[index - 2]);
            last2x = point[0];
            last2y = point[1];
            //下一个点
            pos = this.imageToCanvas(arr[index + 1]);
            nextX = pos[0];
            nextY = pos[1];
        }
        //上一个点
        point = this.imageToCanvas(arr[index - 1])
        last1x = point[0];
        last1y = point[1];
        //当前点
        nowX = value[0];
        nowY = value[1];
        //第一个控制点
        cp1x = last1x + (nowX - last2x) * 0.2;
        cp1y = last1y + (nowY - last2y) * 0.2;
        //最后一个控制点
        cp2x = nowX - (nextX - last1x) * 0.2;
        cp2y = nowY - (nextY - last1y) * 0.2;
        this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nowX, nowY);
    })
    this.context.stroke();
    this.context.globalCompositeOperation = 'source-over';
}


//轨迹回放
Person.prototype.trackBack = function (color, mapid) {

    let arr = [],
        arr1 = [],
        oldIndex = -1;
    let length = this.forwardArr.length,
        isEqual = true;
    this.forwardArr.forEach((value, index) => {
        if (oldIndex + 1 != index) {
            isEqual = false;
        }
        if (value[3] == mapid) {
            arr1.push(value);
            oldIndex = index;
            isEqual = true;
        }
        if (isEqual === false && arr1.length) {
            arr.push([...arr1]);
            arr1 = [];
        }

        if (index === length - 1) {
            arr.push([...arr1])
        }
    })

    arr.forEach(value => {
        this.drawTrack(value, color);
    })

    this.startX = this.trackBackArr[0][0];
    this.startY = this.trackBackArr[0][1];
    this.mapid = this.trackBackArr[0][3];
    let width = this.width * this.scale,
        height = this.height * this.scale,
        pos = this.imageToCanvas([this.startX, this.startY]),
        image = this.type == 0 ? this.waterShape['police_unchecked'] : this.waterShape['staff_unchecked'][0];
    this.context.drawImage(image, pos[0] - width / 2, pos[1] - height, width, height);
    if (this.trackBackArr.length < 2) return;
    this.forwardArr.push(this.trackBackArr[0]);
    this.trackBackArr.shift();
}
//重置轨迹坐标点
Person.prototype.reset = function (trackBackArr, forwardArr) {
    this.trackBackArr = trackBackArr;
    this.forwardArr = forwardArr;
}
//清除轨迹
Person.prototype.clearTrack = function () {
    this.tractArr = [];
}
Person.prototype.informationPanel = function (mousePos) {
    let pos = this.imageToCanvas([this.startX, this.startY]);
    let minX = pos[0] - this.realWidth / 2,
        maxX = pos[0] + this.realWidth / 2,
        minY = pos[1] - this.realHeight + 34,
        maxY = pos[1] + 34;
    if (mousePos.x >= minX && mousePos.x <= maxX && mousePos.y >= minY && mousePos.y <= maxY) {
        return true;
    }
}
Person.prototype.imageToCanvas = function (pos) {
    return [pos[0] * this.scale + this.sx, pos[1] * this.scale + this.sy]
}
Person.prototype.colorArr = ["#f00", "#0f0", "#00f", "#4B0082", "#000", "#009C7C", "#FF8C00", "#600"];

export default Person;