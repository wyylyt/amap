(function($){

    var graspRoad;

    function dealData(str){
        var data = eval(str);

        var arr = [];

        for (var i = 0;i < data.length ;i++) {

            var result = gcoord.transform(
                [data[i].lng,data[i].lat],    // 经纬度坐标
                gcoord.WGS84,               // 当前坐标系
                gcoord.AMap                 // 目标坐标系
            );
            arr.push([result[0],result[1]])

            // arr.push([data[i].lng,data[i].lat])
        }
        return arr;
    }
    // var mapDraw = $('#container').amapDraw();

    function calculateTime(tm,location_time) {
        var tm = (new Date(tm))
    }

    /**
     * 轨迹纠偏
     */
    function dealgraspData(str) {

        var pointData=[];

        var data = eval(str);

        var arr=[];

        var tm = (new Date(data[0].location_time)).getTime()

        for (var i = 0; i < data.length; i++) {

            var time;
            if (i == 0) {
                time = tm;
            }else{
                time = (new Date(data[i].location_time)).getTime() - tm
            }
            var result = gcoord.transform(
                [data[i].lng,data[i].lat],    // 经纬度坐标
                gcoord.WGS84,               // 当前坐标系
                gcoord.AMap                 // 目标坐标系
            );
            var obj = {"x":result[0],"y":result[1],"sp":data[i].gps_speed,"ag":data[i].direction_angle, "tm":time}
            
            arr.push(obj);
        }

        if(!graspRoad) {
            graspRoad = new AMap.GraspRoad()
        }

        graspRoad.driving(arr,function(error,result){
            if(!error){
                pointData = [];
              var newPath = result.data.points;
              for(var i =0;i<newPath.length;i+=1){
                pointData.push([newPath[i].x,newPath[i].y])
              }
            }
          })

        return pointData;
    }

    $('.btnCont button').on('click',function(){
        var html = $(this).text();
        var data = dealData(html);
        mapDraw.drawPolylinetMap(data)
    })
    $('#startMove').on('click',function(){
        mapDraw.markerStartMoveByTrack()
    })

    $('#drawLineSubsection').on('click',function(){
        var dataArr = [];
        // for (var i = 1; i < 5; i++) {
        //     var name = 'AA00002' + i;
        //     var arr = dealData(name);
        //     console.log('arr',arr)
        //     dataArr.push(arr)
        // }
        var arr = dealData('AA000021')
        var arr2 = dealData('AA000024')
        dataArr.push(arr)
        dataArr.push(arr2)
        mapDraw.drawSubsectionPolylinetMap(dataArr)
    })
})(jQuery)