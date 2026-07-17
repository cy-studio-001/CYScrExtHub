(function (Scratch) {
  "use strict";

  const CACHE_EXPIRY = 3600000;
  const cache = {};

  class HidreamWeather {
    constructor() {
      this.lastKey = "";
      this.lastRequestSuccess = false;
      this.lastRequestDuration = 0;
      this.lastRawData = "";
      this.lastUpdateISO = "";
    }

    getInfo() {
      return {
        id: "hidreamWeather",
        name: "Hidream Weather",
        color1: "#4FC3F7",
        color2: "#29B6F6",
        color3: "#0288D1",
        unsandboxed: true,
        blocks: [
          // 主功能
          {
            opcode: "fetchWeather",
            blockType: Scratch.BlockType.COMMAND,
            text: "获取城市 [CITY] 天气（留空自动定位）",
            arguments: { CITY: { type: Scratch.ArgumentType.STRING, defaultValue: "" } },
          },

          // 请求状态
          { opcode: "getRequestStatus", blockType: Scratch.BlockType.BOOLEAN, text: "天气请求成功？" },
          { opcode: "getRequestDuration", blockType: Scratch.BlockType.REPORTER, text: "请求耗时(ms)" },

          // 当前实时天气
          { opcode: "getCurrentTemperature", blockType: Scratch.BlockType.REPORTER, text: "当前温度(°C)" },
          { opcode: "getCurrentWindSpeed", blockType: Scratch.BlockType.REPORTER, text: "当前风速(km/h)" },
          { opcode: "getCurrentWeatherDesc", blockType: Scratch.BlockType.REPORTER, text: "当前天气描述" },
          { opcode: "getCurrentWeatherIcon", blockType: Scratch.BlockType.REPORTER, text: "当前天气图标" },

          // 今日天气
          { opcode: "getTodayMaxTemp", blockType: Scratch.BlockType.REPORTER, text: "今日最高温(°C)" },
          { opcode: "getTodayMinTemp", blockType: Scratch.BlockType.REPORTER, text: "今日最低温(°C)" },
          { opcode: "getTodayHumidity", blockType: Scratch.BlockType.REPORTER, text: "当前湿度(%)" },

          // 日出日落
          { opcode: "getSunrise", blockType: Scratch.BlockType.REPORTER, text: "今日日出时间" },
          { opcode: "getSunset", blockType: Scratch.BlockType.REPORTER, text: "今日日落时间" },

          // 未来预报
          {
            opcode: "getHourTemp",
            blockType: Scratch.BlockType.REPORTER,
            text: "[HOURS]小时后温度(°C)",
            arguments: { HOURS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } },
          },
          {
            opcode: "getHourWeather",
            blockType: Scratch.BlockType.REPORTER,
            text: "[HOURS]小时后天气",
            arguments: { HOURS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } },
          },
          {
            opcode: "getHourIcon",
            blockType: Scratch.BlockType.REPORTER,
            text: "[HOURS]小时后天气图标",
            arguments: { HOURS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } },
          },

          // 位置信息
          { opcode: "getLocationName", blockType: Scratch.BlockType.REPORTER, text: "当前城市" },
          { opcode: "getCoordinates", blockType: Scratch.BlockType.REPORTER, text: "经纬度" },
        ],
      };
    }

    _fetchWithTimeout(url, options = {}, timeoutSec = 8) {
      const controller = new AbortController();
      const signal = controller.signal;
      const timeout = Math.max(1, Number(timeoutSec || 8)) * 1000;
      const start = performance.now();
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          controller.abort();
          reject({ name: "TimeoutError", duration: Math.floor(performance.now() - start) });
        }, timeout);

        fetch(url, { ...options, signal })
          .then((resp) => {
            clearTimeout(timer);
            resolve({ response: resp, duration: Math.floor(performance.now() - start) });
          })
          .catch((err) => {
            clearTimeout(timer);
            reject({ name: err.name, duration: Math.floor(performance.now() - start) });
          });
      });
    }

    fetchWeather(args) {
      const city = (args.CITY || "").trim();
      const startAll = performance.now();
      const that = this;

      return new Promise(async (resolve) => {
        try {
          const key = city || "__ip__";
          this.lastKey = key;

          if (cache[key] && Date.now() - cache[key].timestamp < CACHE_EXPIRY) {
            that.lastRawData = JSON.stringify(cache[key].data, null, 2);
            that.lastRequestSuccess = true;
            that.lastRequestDuration = Math.floor(performance.now() - startAll);
            that.lastUpdateISO = cache[key].meta.updateISO;
            resolve();
            return;
          }

          let lat = null, lon = null, locationName = "";

          if (city) {
            try {
              const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`;
              const g = await this._fetchWithTimeout(geoUrl, {}, 6);
              if (g.response.ok) {
                const geoJson = await g.response.json();
                if (geoJson.results?.length) {
                  const r = geoJson.results[0];
                  lat = Number(r.latitude);
                  lon = Number(r.longitude);
                  locationName = r.name;
                }
              }
            } catch (e) {}
          }

          if (lat == null || lon == null) {
            try {
              const ipapi = await this._fetchWithTimeout("https://ipapi.co/json/", {}, 6);
              if (ipapi.response.ok) {
                const ipjson = await ipapi.response.json();
                lat = Number(ipjson.latitude);
                lon = Number(ipjson.longitude);
                locationName = ipjson.city || ipjson.region;
              }
            } catch (e) {}
          }

          if (lat == null || lon == null) {
            try {
              const ipwho = await this._fetchWithTimeout("https://ipwho.is/", {}, 6);
              if (ipwho.response.ok) {
                const ipjson = await ipwho.response.json();
                lat = Number(ipjson.latitude);
                lon = Number(ipjson.longitude);
                locationName = ipjson.city || ipjson.region;
              }
            } catch (e) {}
          }

          if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) {
            that.lastRequestSuccess = false;
            resolve();
            return;
          }

          const hourlyVars = "temperature_2m,relativehumidity_2m,weathercode";
          const dailyVars = "weathercode,sunrise,sunset,temperature_2m_max,temperature_2m_min";
          const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=${hourlyVars}&daily=${dailyVars}&timezone=auto`;

          const f = await this._fetchWithTimeout(forecastUrl, {}, 10);
          if (!f.response.ok) throw new Error("请求失败");
          const forecastJson = await f.response.json();

          cache[key] = {
            data: forecastJson,
            timestamp: Date.now(),
            meta: { lat, lon, locationName, updateISO: new Date().toISOString() }
          };

          that.lastRawData = JSON.stringify(forecastJson, null, 2);
          that.lastRequestSuccess = true;
          that.lastRequestDuration = f.duration;
          that.lastUpdateISO = cache[key].meta.updateISO;
          resolve();
        } catch (err) {
          that.lastRequestSuccess = false;
          resolve();
        }
      });
    }

    getRequestStatus() { return !!this.lastRequestSuccess; }
    getRequestDuration() { return this.lastRequestDuration || 0; }

    _getCache() { return cache[this.lastKey] || null; }

    _getCurrent() {
      const c = this._getCache();
      return c?.data?.current_weather || null;
    }

    getCurrentTemperature() {
      const cur = this._getCurrent();
      return cur ? Number(cur.temperature || 0) : 0;
    }

    getCurrentWindSpeed() {
      const cur = this._getCurrent();
      return cur ? Number(cur.windspeed || 0) : 0;
    }

    _weatherCodeToStr(code) {
      const map = {
        0:"晴朗",1:"晴",2:"多云",3:"阴天",
        45:"雾",48:"霜雾",51:"小雨",53:"中雨",55:"大雨",
        56:"冻雨",57:"强冻雨",61:"小雨",63:"中雨",65:"大雨",
        66:"冻雨",67:"强冻雨",71:"小雪",73:"中雪",75:"大雪",
        77:"雪粒",80:"阵雨",81:"中阵雨",82:"强阵雨",
        85:"阵雪",86:"强阵雪",95:"雷阵雨",96:"雷暴",99:"强雷暴"
      };
      return map[code] || "未知";
    }

    _codeToIcon(code) {
      if (code === 0) return "☀️";
      if (code === 1 || code === 2) return "⛅";
      if (code === 3) return "☁️";
      if (code >= 45) return "🌫️";
      if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
      if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "❄️";
      if (code >= 95) return "⛈️";
      return "🌥️";
    }

    getCurrentWeatherDesc() {
      const cur = this._getCurrent();
      return cur ? this._weatherCodeToStr(cur.weathercode) : "";
    }

    getCurrentWeatherIcon() {
      const cur = this._getCurrent();
      return cur ? this._codeToIcon(cur.weathercode) : "";
    }

    _getTodayIndex() {
      const c = this._getCache();
      if (!c?.data?.daily?.time) return 0;
      const today = new Date().toISOString().slice(0,10);
      return c.data.daily.time.findIndex(t => t.startsWith(today)) || 0;
    }

    getTodayMaxTemp() {
      const c = this._getCache();
      const i = this._getTodayIndex();
      return c?.data?.daily?.temperature_2m_max[i] || 0;
    }

    getTodayMinTemp() {
      const c = this._getCache();
      const i = this._getTodayIndex();
      return c?.data?.daily?.temperature_2m_min[i] || 0;
    }

    getTodayHumidity() {
      const c = this._getCache();
      return c?.data?.hourly?.relativehumidity_2m[0] || 0;
    }

    getSunrise() {
      const c = this._getCache();
      return c?.data?.daily?.sunrise[0] || "";
    }

    getSunset() {
      const c = this._getCache();
      return c?.data?.daily?.sunset[0] || "";
    }

    _getHourData(h) {
      const c = this._getCache();
      if (!c?.data?.hourly) return null;
      const hours = Math.max(0, Math.min(24, Number(h) || 0));
      return {
        temp: c.data.hourly.temperature_2m[hours],
        code: c.data.hourly.weathercode[hours]
      };
    }

    getHourTemp(args) {
      const d = this._getHourData(args.HOURS);
      return d?.temp || 0;
    }

    getHourWeather(args) {
      const d = this._getHourData(args.HOURS);
      return d ? this._weatherCodeToStr(d.code) : "";
    }

    getHourIcon(args) {
      const d = this._getHourData(args.HOURS);
      return d ? this._codeToIcon(d.code) : "";
    }

    getLocationName() {
      const c = this._getCache();
      return c?.meta?.locationName || "";
    }

    getCoordinates() {
      const c = this._getCache();
      if (!c?.meta) return "";
      return `${c.meta.lat}, ${c.meta.lon}`;
    }
  }

  Scratch.extensions.register(new HidreamWeather());
})(Scratch);