var isAndroid = kendo.support.mobileOS.android;
var loadCourses = false;

// override datasources
navDataSource = new kendo.data.DataSource({
  // 使用 data 的方法一
  //  data: [
  //      {
  //        "課程名稱": "一起來運動",
  //        "url": "2-views/courseDetail.html?courseId=U0001",
  //        "section": "A"
  //      },
  //      {
  //        "課程名稱": "運動運動",
  //        "url": "2-views/pullToRefresh.html?courseId=U0002",
  //        "section": "A"        
  //      },
  //      {
  //        "課程名稱": "年後減肥大作戰",
  //        "url": "2-views/courseDetail.html?courseId=U0003",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "飛輪",
  //        "url": "2-views/courseDetail.html?courseId=U0004",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "瑜珈",
  //        "url": "2-views/courseDetail.html?courseId=U0005",
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
      console.log("scheme total");
      取得經緯度();    
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
  
  if (loadCourses == false) return 1;
  
  allDataReady = 0;
  readCourses();

  var checkDataReady = setInterval(function(){
    if (allDataReady==4) {
      clearInterval(checkDataReady);
      //console.log("Set up data for listview")
      var dataTemp =[];
      inCourse.forEach(function(course, index, array){
        courseData.forEach(function(item, ind, arr){
          if (course==item[0]) {
            //console.log(course, ind);
            var courseTitle = {
              "課程名稱": courseData[ind][0] + ": " +
                         courseData[ind][1],
              "老師姓名": courseData[ind][2] + " 老師",
              "課程時間": courseData[ind][3], 
              "url": "2-views/courseDetail.html?courseId=" + courseData[ind][0],
              "section": "A"             
            };
            dataTemp.push(courseTitle);
          }
        });
      });
   
      //console.log(dataTemp);
      
      data.success( dataTemp);      
    }
    
  }, 100);

}

function nullForNow(e) {
  console.log("nullForNow");
  //currentExample = nullForNow;
}

function removeView(e) {
  //console.log("removeView", e);  
  if (reloadCourseNeeded) {
    readCourses(); 
    reloadCourseNeeded = false;
  }
  if (!e.view.element.data("persist")) {
    console.log(e);
    e.view.purge();
  }

}

function initSearch(e) {
  console.log("initSearch");
  var searchBox = e.view.element.find("#demos-search");

  searchBox.on("input", function () {
    searchForCourse(searchBox.val()); //, product);
  });

  searchBox.on("blur", function () {
    //        if (searchBox.val() == "") {
    //            hideSearch();
    //        }
    searchBox.val("");
    searchForCourse("");
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

function searchForCourse(value){ 
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

window.app = new kendo.mobile.Application($(document.body), {
  layout: "courseDiv",
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