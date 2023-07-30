import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

export const formatPlayCount = (count: number, localeLang: string = "zh_CH") => {
  if (!count) return "";
  if (localeLang === "zh_CN") {
    if (count > 100000000) {
      return `${Math.floor((count / 100000000) * 100) / 100}亿`; // 2.32 亿
    }
    if (count > 100000) {
      return `${Math.floor((count / 10000) * 10) / 10}万`; // 232.1 万
    }
    if (count > 10000) {
      return `${Math.floor((count / 10000) * 100) / 100}万`; // 2.3 万
    }
    return count;
  } else {
    if (count > 10000000) {
      return `${Math.floor((count / 1000000) * 10) / 10}M`; // 233.2M
    }
    if (count > 1000000) {
      return `${Math.floor((count / 1000000) * 100) / 100}M`; // 2.3M
    }
    if (count > 1000) {
      return `${Math.floor((count / 1000) * 100) / 100}K`; // 233.23K
    }
    return count;
  }
};

export const resizeImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return "";
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== "https") {
    httpsImgUrl = "https" + imgUrl.slice(4);
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
};

export const formatTrackTime = (value: number) => {
  if (!value) return "0:00";
  let min = ~~(value / 60);
  let sec = (~~(value % 60)).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

export const formatDate = (timestamp: number, format = "MMM D, YYYY") => {
  if (!timestamp) return "";
  // if (locale.locale === "zh-CN") format = "YYYY年MM月DD日";
  format = "YYYY年MM月DD日";
  return dayjs(timestamp).format(format);
};

export const formatTime = (Milliseconds: number, format = "HH:MM:SS", localLang: string = "zh_CN") => {
  if (!Milliseconds) return "";
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  let time = dayjs.duration(Milliseconds);
  let hours = time.hours().toString();
  let minus = time.minutes().toString();
  let seconds = time.seconds().toString().padStart(2, "0");

  if (format === "HH:MM:SS") {
    return hours !== "0" ? `${hours}:${minus.padStart(2, "0")}:${seconds}` : `${minus}:${seconds}`;
  } else if (format === "Human") {
    let hoursUnit, minutesUnit;
    switch (localLang) {
      case "zh_CN":
        hoursUnit = "小时";
        minutesUnit = "分钟";
        break;
      default:
        hoursUnit = "hr";
        minutesUnit = "min";
        break;
    }
    return hours !== "0" ? `${hours} ${hoursUnit} ${minus} ${minutesUnit}` : `${minus} ${minutesUnit}`;
  }
};

export const formatAlbumType = (type: string, albumSize: number) => {
  if (!type) return "";
  if (type === "EP/Single") {
    return albumSize === 1 ? "Single" : "EP";
  } else if (type === "Single") {
    return "Single";
  } else if (type === "专辑") {
    return "Album";
  } else {
    return type;
  }
};
