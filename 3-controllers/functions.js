// MM/DD/YYYY ==> YYYY-MM-DD
function convertDate(dateStr){ 
  var dateArr = dateStr.split("/");
  // Kendo UI Calendar 的日期是類似 2/9/2020，月和日不會補0
  //if (dateArr[0].length ==1) dateArr[0]= "0"+dateArr[0];
  //if (dateArr[1].length ==1) dateArr[1]= "0"+dateArr[1];
  return dateArr[2]+"-"+dateArr[0]+"-"+dateArr[1];
}

// 設定 $a enabled 或 disabled
function setEnabled($a, Enabled ){
  $a.each(function(i, a){          
    var en = a.onclick !== null;        
    if(en == Enabled)return;
    if(Enabled){
      a.onclick = $(a).data('orgClick');            
    }
    else
    {
      $(a).data('orgClick',a.onclick);
      a.onclick = null;
    }
  });
}

function 取得經緯度() {
  navigator.geolocation.getCurrentPosition(function (position) {
    //console.log(position.coords.latitude, position.coords.longitude);
    目前位置經度 = Math.floor(position.coords.latitude * 10000) / 10000;
    目前位置緯度 = Math.floor(position.coords.longitude * 10000) / 10000;
    $("#deleteMe").text("所在位置 經度: " + String(目前位置緯度) + ", 緯度: " + String(目前位置緯度));
  });
}

// 計算 兩點 間的距離
function calcDistance(lat1, lon1, lat2, lon2) {
  var R = 6371000; // meter
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

function readCourses(){
  console.log("call API to Read Database");
  userName = decodeURI(displayName[1]);

  var checkDataReady = setInterval(function(){ 
    //console.log("aaa", allDataReady);
    if (allDataReady==4) {
      clearInterval(checkDataReady);
      //console.log("Data is ready", courseData);
      //alert("Data is ready");
      $.loading.end();
      notInCourse=[];
      inCourse=[];
      myHistory=[];     
      var attended=false;
      var isNow=false;
      var inHistory=false; 
      courseMember.forEach(function(course, index, array){  
        attended = false;        
        for (var i=1; i<course.length;i++) {
          if (course[i][3] == userId[1]) {              
            //console.log(course[0],userName, "已參加")
            attended = true;
          }
        };

        isNow = false;
        courseData.forEach(function(newCourse, index, array){
          if (newCourse[0]==course[0]) isNow = true; 
        });

        inHistory = false;
        courseHistory.forEach(function(oldCourse, index, array){
          if (oldCourse[0]==course[0]) inHistory = true; 
        });

        if (!attended && isNow)     notInCourse.push(course[0]);
        if (attended  && isNow)     inCourse.push(course[0]);        
        if (attended  && inHistory) myHistory.push(course[0]);
      });
      //addCourseCards();
    }
  }, 100);

  $.loading.start('讀取資料');
  allDataReady = 0;
  getDataByAPIs(checkDataReady);    

};

function getDataByAPIs(checkDataReady) {
  var request1, reuquest2, request3, request4;
  // call API:10 =========================================================================
  paramToSend = "?API=10";      
  request1 = new XMLHttpRequest()
  if (useLocalAPIs) {
    request1.open('GET', 'http://localhost:5000' + paramToSend, true);
  } else {
    request1.open('GET', 'https://api-linko-sports-center.herokuapp.com/'+paramToSend, true);
  }

  request1.onload = function() {
    var responseMsg = this.response;

    //responseMsg="API:10 courseData 讀取失敗"; //故意測試錯誤
    if (responseMsg != "API:10 courseData 讀取失敗") {
      courseData = JSON.parse(this.response);
      //console.log(courseData);
      allDataReady++;
      request2.send();
    } else {
      clearInterval(checkDataReady); 
      //$.loading.end();
      alert("課程資料讀取失敗，請稍後再試，或洽櫃台人員");
    }

  }
  // Send request
  request1.send();
  // =====================================================================================      

  // call API:11 =========================================================================
  paramToSend = "?API=11";      
  request2= new XMLHttpRequest()
  if (useLocalAPIs) {
    request2.open('GET', 'http://localhost:5000' + paramToSend, true);
  } else {
    request2.open('GET', 'https://api-linko-sports-center.herokuapp.com/'+paramToSend, true);
  }

  request2.onload = function() {
    var responseMsg = this.response;

    //responseMsg="API:11 courseHistory 讀取失敗"; //故意測試錯誤        
    if (responseMsg != "API:11 courseHistory 讀取失敗") {
      courseHistory = JSON.parse(this.response);
      //console.log(courseHistory);
      allDataReady++;
      request3.send();          
    } else {
      clearInterval(checkDataReady);
      //$.loading.end();
      alert("課程歷史讀取失敗，請稍後再試，或洽櫃台人員");
    }

  }
  // =====================================================================================      
  
  // call API:12 =========================================================================
  paramToSend = "?API=12";      
  request3 = new XMLHttpRequest()
  if (useLocalAPIs) {
    request3.open('GET', 'http://localhost:5000' + paramToSend, true);
  } else {
    request3.open('GET', 'https://api-linko-sports-center.herokuapp.com/'+paramToSend, true);
  }

  request3.onload = function() {
    var responseMsg = this.response;

    //responseMsg="API:12 courseMember 讀取失敗"; //故意測試錯誤         
    if (responseMsg != "API:12 courseMember 讀取失敗") {
      courseMember = JSON.parse(this.response);
      //console.log(courseMember);
      allDataReady++;
      request4.send();
    } else {
      clearInterval(checkDataReady);
      //$.loading.end();
      alert("課程報名資料讀取失敗，請稍後再試，或洽櫃台人員");
    }

  }
  // ===================================================================================== 
 
  // call API:13 =========================================================================
  paramToSend = "?API=13&"+"UserId="+userId[1];      
  request4 = new XMLHttpRequest()
  if (useLocalAPIs) {
    request4.open('GET', 'http://localhost:5000' + paramToSend, true);
  } else {
    request4.open('GET', 'https://api-linko-sports-center.herokuapp.com/'+paramToSend, true);
  }

  request4.onload = function() {
    var responseMsg = this.response;

    //responseMsg="API:13 courseMember 讀取失敗"; //故意測試錯誤         
    if (responseMsg.substr(0,6) != "API:13") {
      userPhoneNumber = responseMsg;
      allDataReady++;         
    } else {
      clearInterval(checkDataReady);
      //$.loading.end();
      alert("客戶資料讀取失敗，請稍後再試，或洽櫃台人員");
    }

  }
  // =====================================================================================      
}

