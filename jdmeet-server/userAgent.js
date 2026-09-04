function parseUserAgent(userAgent = "") {
  const value = String(userAgent);
  const match = (...patterns) => {
    for (const [name, pattern] of patterns) {
      const result = value.match(pattern);
      if (result) {
        return { name, version: result[1]?.replace(/_/g, ".") || null };
      }
    }
    return { name: null, version: null };
  };

  const browser = match(
    ["Microsoft Edge", /EdgA?\/(\d+(?:\.\d+)*)/],
    ["Opera", /(?:OPR|Opera)\/(\d+(?:\.\d+)*)/],
    ["Firefox", /(?:Firefox|FxiOS)\/(\d+(?:\.\d+)*)/],
    ["Chrome", /(?:Chrome|CriOS)\/(\d+(?:\.\d+)*)/],
    ["Safari", /Version\/(\d+(?:\.\d+)*).*Safari/]
  );
  const operatingSystem = match(
    ["Windows", /Windows NT (\d+(?:\.\d+)*)/],
    ["Android", /Android[ /](\d+(?:\.\d+)*)/],
    ["iOS", /(?:iPhone|iPad).*OS (\d+(?:_\d+)*)/],
    ["macOS", /Mac OS X (\d+(?:_\d+)*)/],
    ["Chrome OS", /CrOS [^ ]+ (\d+(?:\.\d+)*)/]
  );

  let deviceType = "desktop";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(value)) deviceType = "tablet";
  else if (/Mobi|iPhone|iPod|Android/i.test(value)) deviceType = "mobile";

  return {
    browser: browser.name,
    browserVersion: browser.version,
    deviceType,
    os: operatingSystem.name || (/Linux/i.test(value) ? "Linux" : null),
    osVersion: operatingSystem.version,
  };
}

module.exports = { parseUserAgent };
