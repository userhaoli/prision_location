const converseImage = function (params, callback, flag, id) {
    if (flag === false) {
        let formData = new FormData();
        for (let prop in params.data) {
            formData.append(prop, params.data[prop]);
        }
        return callback ? callback(formData, id) : null;
    }
    let canvas = document.createElement("canvas");
    canvas.width = params.width;
    canvas.height = params.height;
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "rgba(0,166,123,0.2)";
    ctx.beginPath();
    params.point.forEach((v, i) => {
        if (i === 0) {
            ctx.moveTo(parseInt(v[0]), parseInt(v[1]));
        } else {
            ctx.lineTo(parseInt(v[0]), parseInt(v[1]));
        }
    })
    ctx.stroke();
    ctx.fill();
    return new Promise(function (resolve) {
        canvas.toBlob(function (result) {
            let formData = new FormData();
            for (let prop in params.data) {
                formData.append(prop, params.data[prop]);
            }
            formData.append('imageurl', result);
            resolve(callback ? callback(formData, id) : null)
        })
    })
}

export default converseImage;