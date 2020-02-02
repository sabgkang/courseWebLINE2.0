var isAndroid = kendo.support.mobileOS.android;

// override datasources
navDataSource = new kendo.data.DataSource({
  // 使用 data 的方法一
  //  data: [
  //      {
  //        "課程名稱": "一起來運動",
  //        "url": "actionsheet/courseDetail.html?courseId=U0001",
  //        "section": "A"
  //      },
  //      {
  //        "課程名稱": "運動運動",
  //        "url": "actionsheet/pullToRefresh.html?courseId=U0002",
  //        "section": "A"        
  //      },
  //      {
  //        "課程名稱": "年後減肥大作戰",
  //        "url": "actionsheet/courseDetail.html?courseId=U0003",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "飛輪",
  //        "url": "actionsheet/courseDetail.html?courseId=U0004",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "瑜珈",
  //        "url": "actionsheet/courseDetail.html?courseId=U0005",
  //        "section": "C"        
  //      },    
  //    
  //  ],
  
  // 使用 data 的方法二, transport
  transport: {
    read: function (data) { getCourseData(data); }
  },
//  sort: {
//    field: "課程名稱",
//    dir: "asc"
//  },
  requestStart: function () {
    kendo.ui.progress($("#loading"), true);
  },
  requestEnd: function () {
    kendo.ui.progress($("#loading"), false);
  },

  schema: {
    total: function () {
      console.log("bbb");
      return 77;
    }
  },
  serverPaging: true,
  pageSize: 40,
  //group: { field: "section" }
})

searchDataSource = navDataSource;

function getCourseData(data) {
  console.log("getting data");
  allDataReady = 0;
  readCourses();

  var checkDataReady = setInterval(function(){
    if (allDataReady==4) {
      clearInterval(checkDataReady);
      console.log("Set up data for listview")
      var dataTemp =[];
      inCourse.forEach(function(course, index, array){
        courseData.forEach(function(item, ind, arr){
          if (course==item[0]) {
            console.log(course, ind);
            var courseTitle = {
              "課程名稱": courseData[ind][0] + ": " +
                         courseData[ind][1],
              "老師姓名": courseData[ind][2],
              "課程時間": courseData[ind][3], 
              "url": "actionsheet/courseDetail.html?courseId=" + courseData[ind][0],
              "section": "A"             
            };
            dataTemp.push(courseTitle);
          }
        });
      });
      
      console.log(dataTemp);
      
      data.success( dataTemp
//        [
//          {
//            "課程名稱": "一起來運動",
//            "url": "actionsheet/courseDetail.html?courseId=U0001",
//            "section": "A"
//              },
//          {
//            "課程名稱": "運動運動",
//            "url": "actionsheet/courseDetail.html?courseId=U0002",
//            "section": "A"
//              },
//          {
//            "課程名稱": "年後減肥大作戰",
//            "url": "actionsheet/courseDetail.html?courseId=U0003",
//            "section": "B"
//              },
//          {
//            "課程名稱": "飛輪",
//            "url": "actionsheet/courseDetail.html?courseId=U0004",
//            "section": "B"
//              },
//          {
//            "課程名稱": "瑜珈",
//            "url": "actionsheet/courseDetail.html?courseId=U0005",
//            "section": "C"
//              },
//        ]
      );      
    }
    
  }, 100);

}

function nullCurrentExample(e) {
  console.log("nullCurrentExample");
  currentExample = null;
}

function removeView(e) {
  console.log("removeView");  
  if (!e.view.element.data("persist")) {
    e.view.purge();
  }

}

function initSearch(e) {
  console.log("initSearch");
  var searchBox = e.view.element.find("#demos-search");

  searchBox.on("input", function () {
    searchExamplesFor(searchBox.val()); //, product);
  });

  searchBox.on("blur", function () {
    //        if (searchBox.val() == "") {
    //            hideSearch();
    //        }
    searchBox.val("");
    searchExamplesFor("");
    hideSearch();
  });
}

var desktop = !kendo.support.mobileOS;

function showSearch() {
  $("#normal").addClass("navbar-hidden");
  $("#search").removeClass("navbar-hidden");
  if (desktop) {
    setTimeout(function () {
      $("#demos-search").focus();
    });
  } else {
    $("#demos-search").focus();
  }
}

function hideSearch() {
  $("#normal").removeClass("navbar-hidden");
  $("#search").addClass("navbar-hidden");
}

function checkSearch(e) {
  if (!searchDataSource.filter()) {
    e.preventDefault();
    this.replace([]);
    $("#search-tooltip").show();
  } else {
    $("#search-tooltip").hide();
  }
}

function searchExamplesFor(value){ 
  if (value.length < 2) {
        searchDataSource.filter(null);
    } else {
        var filter = { logic: "and", filters: []};
        var words = value.split(" ");

        for (var i = 0; i < words.length; i ++) {
            var word = words[i];
            filter.filters.push({
                logic: "or",
                filters: [
                    //{ field: "section", operator: "contains", value: word },
                    { field: "課程名稱", operator: "contains", value: word },
                    //{ field: "title", operator: titleContains(word) }
                ]
            });
        }

        searchDataSource.filter(filter);
    }
}

    function readCourses(){
      console.log("call API to Read Database");
      userName = decodeURI(displayName[1]);
      
//      $.loading.start('讀取資料');
//      allDataReady = 0;
//      getDataByAPIs();

      var checkDataReady = setInterval(function(){ 
        //console.log("aaa", allDataReady);
        if (allDataReady==4) {
          clearInterval(checkDataReady);
          console.log("Data is ready");
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
              //console.log(course[i][0]);
              if (course[i][4] == userPhoneNumber) {
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

window.app = new kendo.mobile.Application($(document.body), {
  layout: "examples",
  transition: "slide",
  skin: "nova",
  icon: {
    "": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "72x72": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "76x76": '@Url.Content("~/content/mobile/AppIcon76x76.png")',
    "114x114": '@Url.Content("~/content/mobile/AppIcon72x72@2x.png")',
    "120x120": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")',
    "152x152": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")'
  }
});