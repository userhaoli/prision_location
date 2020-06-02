/**
 * 
 * @param { Object } parmas  包含参数el=>元素,type=>事件类型 String ,handle=>事件处理函数 Function
 */
function eventInit( parmas ){
 let { el,type,handle } = parmas;
 if ( el.addEventListener ) {
    el.addEventListener(type,handle);
 } else if( el.attachEvent ) {
     el.attachEvent("on"+type,function(){
        handle.call(this)
     })
 }
}
export default eventInit;