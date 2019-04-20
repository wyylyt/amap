/**
 * author by wanjikun 2019/04/12
 */
;(function($){

    var lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];

    function AmapDraw($this,options){
        var defaults = {
            center: [116.478935,39.997761],
            zoom: 17,
        }
        this.options = $.extend(defaults,options);
        this.$this = $this;
        this.state = {
            mapViewId:$this[0].id,
            mapView:null,
            marker:null, //点标记
            markers:[], //点标记集合
            pathTrackData:[] //轨迹路径经纬度数组
        }

        this._initMap();
        // this.drawPolylinetMap();
    }
    AmapDraw.prototype = {
        /**
         * 初始化地图
         */
        _initMap:function() {
            var id = this.state.mapViewId;
            var options = this.options;
            if (id !== undefined) {
                this.state.mapView = new AMap.Map(id, {
                    resizeEnable: true,
                    center: options.center,
                    zoom: options.zoom
                });
                // this.drawMarker(lineArr[0])
            }
        },
        /**
         * 绘制轨迹
         * pathData 轨迹经纬度数组
         */
        drawPolylinetMap:function(pathData) {
            var mapView = this.state.mapView;
            var options = this.options;
            var pathArr = pathData || [];

            this.state.pathTrackData = pathData;

            if (mapView) {
                mapView.clearMap();

                // this.drawMarker(pathArr[0])

                new AMap.Polyline({
                    map: mapView,
                    path: pathArr,
                    showDir:true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                })
                mapView.setFitView();
            }
        },
        /**
         * 分段绘制轨迹
         */
        drawSubsectionPolylinetMap:function(data){
            var mapView = this.state.mapView;

            if (mapView) {
                mapView.clearMap();

                // this.drawMarker(pathArr[0])
                var coloeArr = ['red','blue','yellow',"#28F"]
                for (let i = 0; i < data.length; i++) {
                    new AMap.Polyline({
                        map: mapView,
                        path: data[i],
                        showDir:true,
                        strokeColor: coloeArr[i],  //线颜色
                        // strokeOpacity: 1,     //线透明度
                        strokeWeight: 6,      //线宽
                        // strokeStyle: "solid"  //线样式
                    })
                    mapView.setFitView();
                }

                
            }
        },
        /**
         * 绘制点标记
         * pos 点标记经纬度
         */
        drawMarker:function(pos){
            var mapView = this.state.mapView;
            if(mapView){
                var marker = new AMap.Marker({
                    map: mapView,
                    position:pos,
                    icon: "https://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13),
                    autoRotation: true,
                    angle:-90,
                });

                this.state.markers.push(marker)
            }
        },
        /**
         * 删除所有点标记
         */
        removeAllMarkers:function(){
            var map = this.state.mapView,markers=this.state.markers;
            if (map) {
                map.remove(markers)
            }
        },
        /**
         * 根据轨迹移动点标记
         * speed 移动速度
         */
        markerStartMoveByTrack:function(speed){
            var pathTrackData = this.state.pathTrackData,
                marker = this.state.marker,
                moveSpeed = speed || 10000;
            if (pathTrackData.length && marker) {
                marker.moveAlong(pathTrackData, moveSpeed);
            }
        },
        /**
         * 根据位置经纬度点移动marker
         * pos 经纬度 speed 速度
         */
        // markerStartMove:function(pos,speed) {
        //     var 
        // }
    }

    $.fn.amapDraw = function (options) {
        return new AmapDraw(this,options)
    }
})(jQuery)