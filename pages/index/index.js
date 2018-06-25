//index.js
//获取应用实例 提交码云测试
var app = getApp()
var bmap=require('../../utils/bmap-wx.js');
var common=require('../../utils/common.js');
var lastcity='';
Page({
  onShareAppMessage:function(){
    return{
      title:"微信天气",
      desc:'',
      path: 'pages/index/index'
    }
  },
  data: {
    gogoleft:0,
    gogoright:-50,
    gogostatus:false,
    pagesize:100,
    pagetop:0,
    userInfo:{},
    animationW:{},
    animationM:{},
    theWeather:{
      weatherIcon:"",
      date:0,
      currentCity:"",
      weatherDesc:"~",
      pm25:0,
      temperature:"~",
      wind:"无风"
    },
    cityMenus:[],
    today:"2018-06-20",
    daylight:true,
    wall:"/images/clearday"
  },
  setMenuNatural:function(normal){
    var animationW=wx.createAnimation({
      duration:200
    });
    var animationM=wx.createAnimation({
      duration:200
    });
    var menuStatus=false;
    if(this.data.gogostatus){
      animationW.width("100%").height("100vh").top("0vh").left("0%").step();
      animationM.right("40%").step();
      menuStatus=false;
    }else{
      animationW.width("90%").height("90vh").top("5vh").left("-40%").step();
      animationM.right("0%").step();
      menuStatus = true;
    };
    this.setData({
       animationW:animationW.export(),
       animationM:animationM.export(),
       gogostatus:menuStatus,
       cityMenus:common.getCityList()
    })
  },
  setAdd:function(){
    wx.navigateTo({
      url: '../add/add',
    })
  },
  menuTab:function(e){
    wx.showLoading();
    var itemId=e.target.id;
    var that=this;
    if(itemId==""){
      console.log("id 空着");
      return;
    }
    var theCity=common.getCity()[itemId];

    this.setData({
      'theWeather.currentCity':theCity.currentCity
    })
    var BMap=new bmap.BMapWX({
      ak:'DUGyGbcSax7XqgAmQeIjKvWX3TablruD'
    });
    BMap.weather({
      city:theCity.currentCity,
      fail:this.fail,
      success:this.success
    });
  },
  delTab:function(){
    
  },
  onPullDownRefresh:function(){
    console.log("wa");
  },
  onLoad:function(options){
    var thisMoment=new Date().getHours();
    
    if(thisMoment>18||thisMoment<6){
      this.setData({
        daylight:false
      })
    }else{
      this.setData({
        daylight:true
      })
    }
    wx.showLoading();
    var cityname=common.init();
    console.log(cityname)
    this.setData({
      'theWeather.currentCity':cityname
    })
    var BMap=new bmap.BMapWX({
      ak:"DUGyGbcSax7XqgAmQeIjKvWX3TablruD"
    });
    var weatherData={}
    if(options.name!=null){
      this.setData({
        'theWeather.currentCity':options.name
      })
      console.log(options.name+"ee");
    }
    BMap.weather({
      city:this.data.theWeather.currentCity,
      fail:this.fail,
      success:this.success
    });
  },
  fail:function(data){
    wx.showModal({
      title: '城市天气搜索失败',
      content: '未找到'+this.data.theWeather.currentCity+'的天气预报信息',
      showCancel:false,
      confirmText:'返回',
      success: function (res) {
        if (res.confirm) {
           wx.navigateTo({
            url: '../index/index',
          });
          }
      }
      
    });
    wx.hideLoading();
    },

success:function (data){
  wx.hideLoading();
  var weatherData=data.currentWeather[0];
  weatherData.fullData=data.originalData.results[0];

  var date=weatherData.date;
  date=date.substring(date.indexOf("：")+1,date.indexOf("℃"));
  weatherData.date=date;
  var days=weatherData.fullData.weather_data;
  for(var i=0;i<days.length;i++){
    if(i==0){
      var todayText=days[i].date;
      todayText=todayText.substring(todayText.indexOf("周"),todayText.indexOf("周")+2);
      days[i].date=todayText;
    }
    days[i].weather=common.iconChanger(days[i].weather).icon;
  }
  weatherData.fullData.weather_data=days;
  var tudayStatus=common.iconChanger(weatherData.weatherDesc);
  weatherData.weatherIcon=tudayStatus.icon;
  weatherData.weatherDesc=tudayStatus.status;
  weatherData.wind=common.windHelper(weatherData.wind);
  weatherData.pmpm=common.pmText(weatherData.pm25);

  common.refreshCity(weatherData);
  this.setData({
    theWeather:weatherData,
    today:common.getToday(),
    wall:tudayStatus.wall,
    gogostatus:true

  });
  this.setMenuNatural();
}
})
