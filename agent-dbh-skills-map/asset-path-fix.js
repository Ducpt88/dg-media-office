(function fixDgSkillsMapAssetPaths() {
  const assetNames = new Set([
    "office-bg.png",
    "manager-chibi.png",
    "ceo-frame.png",
    "ceo-walk1.png",
    "ceo-walk2.png",
    "char-fly.png",
    "char-jump.png",
    "char-sit.png",
    "char-walk.png",
    "char-wave.png",
    "char-working.png",
    "team-1-walk1.png",
    "team-1-walk2.png",
    "team-2-walk1.png",
    "team-2-walk2.png",
    "team-3-walk1.png",
    "team-3-walk2.png",
    "team-4-walk1.png",
    "team-4-walk2.png",
    "team-5-walk1.png",
    "team-5-walk2.png",
    "team-leader-1.png",
    "team-leader-2.png",
    "team-leader-3.png",
    "team-leader-4.png",
    "team-leader-5.png"
  ]);

  const imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (!imageSrc || !imageSrc.set || !imageSrc.get) return;

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: imageSrc.configurable,
    enumerable: imageSrc.enumerable,
    get: imageSrc.get,
    set(value) {
      let next = value;
      if (typeof value === "string" && value.startsWith("/")) {
        const name = value.slice(1).split(/[?#]/, 1)[0];
        if (assetNames.has(name)) next = "./" + value.slice(1);
      }
      return imageSrc.set.call(this, next);
    }
  });
})();
