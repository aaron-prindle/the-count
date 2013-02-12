Raphael.fn.pieChart = function (cx, cy, r, init_values, init_labels, stroke) {
  var paper = this,
  rad = Math.PI / 180,
  chart = this.set();
  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
    x2 = cx + r * Math.cos(-endAngle * rad),
    y1 = cy + r * Math.sin(-startAngle * rad),
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }
  update = function(values, labels){
    var angle = 0,
    total = 0,
    start = .66,
    process = function (j) {
      var value = values[j],
      angleplus = 360 * value / total,
      popangle = angle + (angleplus / 2),
      color = Raphael.hsb(start, .75, .75),
      gcolor = Raphael.hsb(start, .75, 1),
      ms = 500,
      delta = 30,
      bcolor = Raphael.hsb(start, 1, 1),
      p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color + "-"+gcolor, stroke: stroke, "stroke-width": 3}); //,
      angle += angleplus;
      chart.push(p);
      start += .2;
    };
    for (var i = 0, ii = values.length; i < ii; i++) {
      total += values[i];
    }
    for (i = 0; i < ii; i++) {
      process(i);
    }
  }
  update(init_values, init_labels);
  setInterval(function() {
    var values = [],
    labels = [];
    $("tr").each(function () {
      var percent = $("td", this).text(); 
      values.push(parseInt(percent, 10));
      labels.push($("th", this).text() + " " + percent);
    });
    ////////////////////////////////////////
    if(values[0] >= 40){
      if($('#alert_dude').is(':empty')){
	$('#alert_dude').addClass("alert alert-error");
	$('#alert_dude').html("<strong>Warning!</strong> Do not let in any more dudes!.");
}
    }
    else{
      $('#alert_dude').removeClass("alert alert-error");
      $('#alert_dude').html("");
    }
    if(parseInt($('#total_val').html(), 10) > 150){
      if($('#alert_capacity').is(':empty')){
	$('#alert_capacity').addClass("alert alert-error");
	$('#alert_capacity').html("<strong>Warning!</strong> We are at max capacity!.");
      }
    }
    else{
      $('#alert_capacity').removeClass("alert alert-error");
      $('#alert_capacity').html("");
    }    
    ////////////////////////////////////////    
    update(values,labels);
    return chart;
  }, 100);
  return chart;
};

$(function () {
  var values = [],
  labels = [];
  Raphael("holder", 600, 600).pieChart(300, 300, 300, values, labels, "#fff");
});
