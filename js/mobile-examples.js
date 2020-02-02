var isAndroid = kendo.support.mobileOS.android;


var currentExample,
  currentSection;


var TITLES = {
  "actionsheet": "ActionSheet",
  "grid": "Grid",
  "scheduler": "Scheduler",
  "application": "Application",
  "mobile-buttongroup": "ButtonGroup",
  "collapsible": "Collapsilble",
  "mobile-drawer": "Drawer",
  "mobile-button": "Button",
  "mobile-forms": "Forms",
  "mobile-layout": "Layout",
  "mobile-listview": "ListView",
  "mobile-tabstrip": "TabStrip",
  "mobile-view": "View",
  "modalview": "ModalView",
  "navbar": "NavBar",
  "popover": "PopOver",
  "scroller": "Scroller",
  "mobile-scrollview": "ScrollView",
  "splitview": "SplitView",
  "mobile-styling": "Styling",
  "mobile-switch": "Switch",
  "touchevents": "Touch Events"
};

// override datasources

navDataSource = new kendo.data.DataSource({
  // 使用 data 的方法一
  //  data: [
  //      {
  //        "課程名稱": "一起來運動",
  //        "url": "actionsheet/index.html?courseId=U0001",
  //        "section": "A"
  //      },
  //      {
  //        "課程名稱": "運動運動",
  //        "url": "actionsheet/pullToRefresh.html?courseId=U0002",
  //        "section": "A"        
  //      },
  //      {
  //        "課程名稱": "年後減肥大作戰",
  //        "url": "actionsheet/index.html?courseId=U0003",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "飛輪",
  //        "url": "actionsheet/index.html?courseId=U0004",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "瑜珈",
  //        "url": "actionsheet/index.html?courseId=U0005",
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
  setTimeout(function () {
    data.success([
      {
        "課程名稱": "一起來運動",
        "url": "actionsheet/index.html?courseId=U0001",
        "section": "A"
          },
      {
        "課程名稱": "運動運動",
        "url": "actionsheet/index.html?courseId=U0002",
        "section": "A"
          },
      {
        "課程名稱": "年後減肥大作戰",
        "url": "actionsheet/index.html?courseId=U0003",
        "section": "B"
          },
      {
        "課程名稱": "飛輪",
        "url": "actionsheet/index.html?courseId=U0004",
        "section": "B"
          },
      {
        "課程名稱": "瑜珈",
        "url": "actionsheet/index.html?courseId=U0005",
        "section": "C"
          },
        ]);
  }, 1000);
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

function showDemoLayout(e) {
  currentExample = null;
  currentSection = null;
  navDataSource.fetch(function () {
    var url = e.view.id,
      element = e.view.element;

    currentExample = navDataSource.get(url);

    if (currentExample) {
      element.find("[data-icon=source-code]").show();
    } else {
      element.find("[data-icon=source-code]").hide();
    }
  });
}

function searchExamplesFor(value){ //, product) {
//    function titleContains(value) {
//        return function (title) {
//            var text = "";
//
//            if (title) {
//                text = title[product] || title["kendo-ui"] || title["aspnet-mvc"] || title["aspnet-core"];
//            }
//
//            return text.indexOf(value) >= 0;
//        };
//    }

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