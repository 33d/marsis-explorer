Spectrogram = function(element, dataset) {
  this.element = $(element);
  this.dataset = dataset;
  this.canvas = $("<canvas/>");
  this.element.append(this.canvas);
};

Spectrogram.prototype.load = function(url) {
  var spectrogram = this;
  if (!(typeof(url) === "string")) {
    // It's JSON
    this.initChart(url);
  } else {
    // It's a text URL
    $.ajax({
      url: url,
      dataType: 'json',
      beforeSend: function(xhr) { /* For Firefox with local files */
        if (xhr.overrideMimeType)
          xhr.overrideMimeType("application/json");
      },
      error: function(xhr, status, e) {
        alert("Can't load " + url);
      },
      success: function(data, status, xhr) {
        spectrogram.initChart(data);
      }
    });
  }
};

Spectrogram.prototype.initChart = function(data) {
  this.canvas.attr({width: data.frames.length, height: 512});
  var c = this.canvas.get(0).getContext("2d");
  
  frameData = [];
  for (var i = 0; i < data.frames.length; i++)
    frameData[data.frames[i].frame] = data.frames[i];
  frameKeys = Object.keys(frameData).sort(function(a, b) { return a - b; });
  
  var max = 0;
  for (var k = 0; k < frameKeys.length; k++)
    max = Math.max(max, Math.max.apply(null, frameData[frameKeys[k]][this.dataset]));

  for (var i = 0; i < frameKeys.length; i++) {
    var d = frameData[frameKeys[i]][this.dataset];
    for (var j = 0; j < 512; j++) {
      c.fillStyle = "hsl(0, 0%, " + d[j] * 100 / max + "%)";
      c.fillRect(i, j, 1, 1);
    }
  }
};

