function processSubjects(subjects){
  subjects.forEach(function(item,index){
    var title=item.title;
    var directorArray=item.directors;
    var director="";
    directorArray.forEach(function(obj,i){
      director+=obj.name+" / ";
    });
    if(director!==""){
      director=director.slice(0,-2);
    }
      var castsArray=item.casts;
      var casts="";
      castsArray.forEach(function(obj,j){
        casts+=obj.name+" / ";
      });
      if(casts!==""){
        casts=casts.slice(0,-2);
      }
      var genres=item.genres.join("/");
      var year =item.year;
      var text=`名称：${title}\n导演：${director}\n主演：${casts}\n类型：${genres}\n上映年份：${year}（中国大陆）`;
      item.text=text;
    
  });
}
module.exports={
  processSubjects:processSubjects
}//模块化processSubjects