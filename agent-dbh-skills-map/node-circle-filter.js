(function hideOnlyDepartmentNodeCircles() {
  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (!proto) return;

  const beginPath = proto.beginPath;
  const arc = proto.arc;
  const fill = proto.fill;
  const stroke = proto.stroke;

  function alphaOf(value) {
    if (typeof value !== "string") return 1;
    const hex = value.match(/^#[0-9a-f]{6}([0-9a-f]{2})$/i);
    if (hex) return parseInt(hex[1], 16) / 255;
    const rgba = value.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/i);
    return rgba ? Number(rgba[1]) : 1;
  }

  const nodeFill = value => {
    const alpha = alphaOf(value);
    return alpha >= 0.055 && alpha <= 0.105;
  };

  const nodeStroke = value => {
    const alpha = alphaOf(value);
    return (alpha >= 0.17 && alpha <= 0.20) || (alpha >= 0.52 && alpha <= 0.55);
  };

  proto.beginPath = function () {
    this.__dgNodeCircleRadius = 0;
    return beginPath.apply(this, arguments);
  };

  proto.arc = function (x, y, radius) {
    this.__dgNodeCircleRadius = Math.max(this.__dgNodeCircleRadius || 0, Number(radius) || 0);
    return arc.apply(this, arguments);
  };

  proto.fill = function () {
    if (this.__dgNodeCircleRadius >= 40 && nodeFill(this.fillStyle)) return;
    return fill.apply(this, arguments);
  };

  proto.stroke = function () {
    if (this.__dgNodeCircleRadius >= 40 && nodeStroke(this.strokeStyle)) return;
    return stroke.apply(this, arguments);
  };
})();
