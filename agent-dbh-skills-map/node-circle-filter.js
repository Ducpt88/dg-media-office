(function hideOnlyDepartmentNodeCircles() {
  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (!proto) return;

  const beginPath = proto.beginPath;
  const arc = proto.arc;
  const fill = proto.fill;
  const stroke = proto.stroke;

  const nodeFill = value => typeof value === "string" && /^#[0-9a-f]{6}(10|18)$/i.test(value);
  const nodeStroke = value => typeof value === "string" && /^#[0-9a-f]{6}(30|88)$/i.test(value);

  proto.beginPath = function () {
    this.__dgNodeCircleRadius = 0;
    return beginPath.apply(this, arguments);
  };

  proto.arc = function (x, y, radius) {
    this.__dgNodeCircleRadius = Math.max(this.__dgNodeCircleRadius || 0, Number(radius) || 0);
    return arc.apply(this, arguments);
  };

  proto.fill = function () {
    if (this.__dgNodeCircleRadius >= 25 && nodeFill(this.fillStyle)) return;
    return fill.apply(this, arguments);
  };

  proto.stroke = function () {
    if (this.__dgNodeCircleRadius >= 25 && nodeStroke(this.strokeStyle)) return;
    return stroke.apply(this, arguments);
  };
})();
