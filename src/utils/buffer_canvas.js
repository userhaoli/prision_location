//缓存画布初始化

let buffer = null,
  bufCtx;
let baseImg = new Image();
baseImg.src = "/images/base.png";
let baseImgAbn = new Image();
baseImgAbn.src = "/images/base_abn.png";

function getBuffer(parmas) {
  let {
    width, //canvas宽
    height, //canvas高
    bgImg, // 大地图
    cla, // Person类
    sx, //x偏移量
    sy, //y偏移量
    scale, //放大倍数
    flag, //是否绘制轨迹、围栏的标识、跟随
    point, //围栏坐标点
    person, //人物
    mapid, //地图id
    baseStation,
    camera,
    defenceImgArr,
    groupPointArr,
    imgStatus,
    trackBackPerson, //轨迹回放人物实例
    trackBackFlag,
    trackBackArr,
    forwardArr,
    resetFlag,
    stopFlag,
    // ratio
  } = parmas;
  let {
    waterFlag,
    isShowPerson,
    isShowStation,
    isShowCamera,
    isShowTrack,
    isShowDefenceImg
  } = imgStatus;
  if (buffer === null) {
    buffer = document.createElement("canvas"),
      bufCtx = buffer.getContext("2d");
    cla.prototype.context = bufCtx;
  }
  buffer.width = width;
  buffer.height = height;
  bufCtx.clearRect(0, 0, width, height);
  drawBgImage();
  // drawText();
  if (trackBackFlag) {
    if (resetFlag) {
      reset(trackBackArr, forwardArr)
    }
    if (stopFlag) {
      stopTrackBack();
    } else {
      trackBack();
    }
  } else {
    drawDefenceImg();
    drawGroupArea();
    drawCamera();
    drawBaseStation();
    drawTrack();
    waterFlag ? drawWaterPerson() : drawPerson();
    drawDefence();
  }
  return buffer;
  //绘制背景
  function drawBgImage() {
    bufCtx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, sx, sy, bgImg.width * scale, bgImg.height * scale);
    // bufCtx.drawImage(bgImg, 0, 0, bgImg.width*ratio, bgImg.height*ratio, sx, sy, bgImg.width * scale, bgImg.height * scale);
  }

  //绘制基站
  function drawBaseStation() {
    if (!isShowStation) return;
    if (!baseStation) return;
    baseStation.length !== 0 && (() => {
      baseStation.forEach(value => {
        mapid === value.mapid && (() => {
          value.i++;
          let pos = imageToCanvas([value.startX, value.startY]),
            x = pos.x - value.width * scale / 2,
            y = (value.checked && value.i / 6 === parseInt(value.i / 6)) ? pos.y - (value.height - 40) * scale : pos.y - value.height * scale,
            width = value.checked ? (value.width + 15) * scale : value.width * scale,
            height = value.checked ? (value.height + 15) * scale : value.height * scale;
          value.status && bufCtx.drawImage(baseImg, parseInt(x), parseInt(y), width, height);
          !value.status && bufCtx.drawImage(baseImgAbn, parseInt(x), parseInt(y), width, height);
        })()
      })
    })()
  }
  //绘制摄像头
  function drawCamera() {
    if (!isShowCamera) return;
    if (!camera) return;
    camera.length !== 0 && (() => {
      camera.forEach(value => {
        mapid === value.mapid &&
          (() => {
            value.i++;
            let pos = imageToCanvas([value.startX, value.startY]),
              x = pos.x - value.width * scale / 2,
              y = (value.checked && value.i / 6 === parseInt(value.i / 6)) ? pos.y - (value.height - 40) * scale : pos.y - value.height * scale,
              width = value.checked ? (value.width + 15) * scale : value.width * scale,
              height = value.checked ? (value.height + 15) * scale : value.height * scale;
            value.status && bufCtx.drawImage(value.IMGS_GOOD[value.direction], parseInt(x), parseInt(y), width, height);
            !value.status && bufCtx.drawImage(value.IMGS_BAD[value.direction], parseInt(x), parseInt(y), width, height);
          })()
      })
    })()
  }
  //绘制人物
  function drawPerson() {
    if (!isShowPerson) return;
    person.length !== 0 && (() => {
      person.forEach(value => {
        value.scale = scale;
        value.sx = sx;
        value.sy = sy;
        mapid === value.mapid && value.drawImage();
      })
    })()
  }
  //绘制水滴人物
  function drawWaterPerson() {
    if (!isShowPerson) return;
    person.length !== 0 && (() => {
      person.forEach(value => {
        value.scale = scale;
        value.sx = sx;
        value.sy = sy;
        mapid === value.mapid && value.drawWaterImage();
      })
    })()
  }
  //绘制轨迹
  // function drawTrack() {
  //   if (!isShowTrack) return;
  //   flag.isShowTrack === true && (() => {
  //     let k = 0,
  //       colorArr = ["#f00", "#0f0", "#00f", "#ff0", "#000", "#009C7C"];
  //     person.forEach(value => {
  //       if (value.track === true) {
  //         value.scale = scale;
  //         value.sx = sx;
  //         value.sy = sy;
  //         let color = value.color ? value.color : colorArr[k];
  //         mapid === value.mapid && value.drawTrack(value.trackArr, color);
  //         k++;
  //       }
  //     })
  //   })()
  // }

  //绘制轨迹
  function drawTrack() {
    if (!isShowTrack) return;
    flag.isShowTrack === true && (() => {
      person.forEach(value => {
        if (value.track === true || value.follow === true) {
          value.scale = scale;
          value.sx = sx;
          value.sy = sy;
          if (!value.color && value.colorArr.length) {
            value.color = value.colorArr.shift();
          }
          if (value.follow) {
            let arr = [],
              arr1 = [],
              oldIndex = -1;
            let length = value.trackArr.length,
              isEqual = true;
            value.trackArr.forEach((value, index) => {
              if (oldIndex + 1 != index) {
                isEqual = false;
              }
              if (value[2] == mapid) {
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
            arr.forEach(val => {
              val[0] && mapid === val[0][2] && value.drawTrack(val, value.color)
            })
          } else {
            mapid === value.mapid && value.drawTrack(value.trackArr, value.color);
          }
        }
      })
    })()
  }

  //绘制围栏
  function drawDefence() {
    flag.isShowDefence === true && (() => {
      point.forEach((value) => {
        bufCtx.beginPath();
        bufCtx.strokeStyle = "#f00";
        bufCtx.fillStyle = "rgba(0,166,123,0.2)"
        value.forEach((v, i) => {
          let pos = imageToCanvas(v);
          if (i === 0) {
            bufCtx.moveTo(pos.x, pos.y);
          } else {
            bufCtx.lineTo(pos.x, pos.y);
          }
        })
        bufCtx.stroke();
        bufCtx.fill();
      })
    })()
  }

  //绘制已有围栏
  function drawDefenceImg() {
    if (!isShowDefenceImg) return;
    if (!defenceImgArr) return;
    if (!defenceImgArr.length) return;
    defenceImgArr.forEach((value) => {
      if (mapid === value.mapid) {
        bufCtx.beginPath();
        bufCtx.strokeStyle = "#f00";
        bufCtx.fillStyle = "rgba(0,166,123,0.2)";
        let points = value.points;
        let len = points.length / 2;
        for (let i = 0; i < len; i++) {
          let pos = imageToCanvas([points[2 * i], points[2 * i + 1]]);
          if (i === 0) {
            bufCtx.moveTo(pos.x, pos.y);
          } else {
            bufCtx.lineTo(pos.x, pos.y);
          }
        }
        bufCtx.closePath();
        bufCtx.stroke();
        bufCtx.fill();
      }
    })
  }
  //绘制基站组区域
  function drawGroupArea() {
    if (!groupPointArr) return;
    if (!groupPointArr.length) return;
    groupPointArr.forEach((value) => {
      if (mapid == value.map) {
        bufCtx.beginPath();
        bufCtx.strokeStyle = "#000";
        bufCtx.fillStyle = "rgba(42, 72, 137, 0.6)";
        let points = value.points;
        if (typeof (value.points) === "string") {
          points = JSON.parse(value.points);
        }
        let len = points.length / 2;
        for (let i = 0; i < len; i++) {
          let pos = imageToCanvas([points[2 * i], points[2 * i + 1]]);
          if (i === 0) {
            bufCtx.moveTo(pos.x, pos.y);
          } else {
            bufCtx.lineTo(pos.x, pos.y);
          }
        }
        bufCtx.closePath();
        bufCtx.stroke();
        bufCtx.fill();
      }
    })
  }
  //轨迹回放
  function trackBack() {
    trackBackPerson.scale = scale;
    trackBackPerson.sx = sx;
    trackBackPerson.sy = sy;
    trackBackPerson.trackBack("#f00", mapid);
  }
  //暂停轨迹回放
  function stopTrackBack() {
    trackBackPerson.stopTrackBack();
  }
  //重置轨迹回放位置
  function reset() {
    stopTrackBack.reset(trackBackArr, forwardArr);
  }

  function imageToCanvas(pos) {
    return {
      x: parseInt(pos[0] * scale + sx),
      y: parseInt(pos[1] * scale + sy)
    }
  }
}


export default getBuffer;