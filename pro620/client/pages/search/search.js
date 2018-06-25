var subjectsUtil = require("../../utils/subjectsUtil.js");
var movie = require('../assets/data/movie.js');//将json转化为js对象，然后exports出去，在这边require调用
Page({

  data: {
    inputVal:"",
    movies:[],
    loadingHidden:true,
    modalHidden:true,
    tip:""
  },

 bindKeyInput(event){
   this.setData({inputVal:event.detail.value});
   //console.log(this.data.inputVal);
 },
 search(){
   this.setData({ movieData: movie.localDatabase });//json取值
  // console.log(movie.localDatabase); 
   var page=this;
   var queryStr=page.data.inputVal;
   var movieStr = page.data.movieData;//赋值
  // console.log(movieStr[0].subjects);
   if(queryStr==""){
     this.setData({"tip":"输入内容不能为空"});
     this.setData({modalHidden:false});
   }else{
     page.setData({loadingHidden:false});
     var subjects =movieStr[0].subjects;
    
    // console.log(subjects);
     page.setData({ inputVal: movieStr[0].title + ",共”" + movieStr[0].total+"“条记录"});
     subjectsUtil.processSubjects(subjects);
     page.setData({"movies":subjects,"loadingHidden":true});

        
       
     
   }
 },
 modalChange(){
   this.setData({"modalHidden":true});
 }

})