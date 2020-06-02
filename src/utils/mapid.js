export function saveMapid(mapid){
   localStorage.setItem("mapid",mapid)
}

export function getMapid(){
   return localStorage.getItem("mapid") || 1;
}