function include(file) {
    var script = document.createElement("script");
    script.src = file;
    script.type = "text/javascript";
    script.async = false;
    document.getElementsByTagName("head").item(0).appendChild(script);
  }
  
  include("script/vendor.js");
  include("script/app.js");