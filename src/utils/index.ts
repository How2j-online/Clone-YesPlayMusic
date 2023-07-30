import { ref } from "vue";
import type { Ref } from "vue";
import { isArray } from "lodash-es";
import { cloneDeep, mergeWith } from "lodash-es";

// 防抖
export const useDebounce = (func: Fn, delay: number): Fn => {
  const timer: Ref<ReturnType<typeof setTimeout> | null> = ref(null);
  return () => {
    if (timer.value) clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      func();
    }, delay);
  };
};

export function isFunction(val: unknown): val is Fn {
  return typeof val === "function";
}

// 用于判断是否是 对象类型或者函数类型
export const isObject = (value: object | Fn | null) => {
  const valueType = typeof value;
  return (valueType !== null && typeof value === "object") || typeof value === "function";
};
export interface SimpleKeyValueObject {
  [key: string]: any;
}

// 深拷贝
export const deepClone = (originValue: SimpleKeyValueObject) => {
  // 如果不是对象类型则直接将当前值返回
  if (!isObject(originValue)) return originValue;

  const newObject: SimpleKeyValueObject = {};
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  return newObject;
};

// 数组合并
export const deepMerge = <T extends object | null | undefined, U extends object | null | undefined>(
  target: T,
  source: U
): T & U => {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(cloneDeep(objValue), srcValue, (prevValue, nextValue) => {
        return isArray(prevValue) ? prevValue.concat(nextValue) : undefined;
      });
    }
  });
};

// 获取图片主题色
export const getImgColor = (imgUrl: string) => {
  const img = new Image();
  img.src = imgUrl;
  img.crossOrigin = "Anonymous";
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    img.onerror = () => {
      reject("获取图片失败");
    };
  });
};

export const splitSoundtrackAlbumTitle = (title: string, isAlbum: boolean = false) => {
  let keywords = [
    "Music from the Original Motion Picture Score",
    "The Original Motion Picture Soundtrack",
    "Original MGM Motion Picture Soundtrack",
    "Complete Original Motion Picture Score",
    "Original Music From The Motion Picture",
    "Music From The Disney+ Original Movie",
    "Original Music From The Netflix Film",
    "Original Score to the Motion Picture",
    "Original Motion Picture Soundtrack",
    "Soundtrack from the Motion Picture",
    "Original Television Soundtrack",
    "Original Motion Picture Score",
    "Music From the Motion Picture",
    "Music From The Motion Picture",
    "Complete Motion Picture Score",
    "Music from the Motion Picture",
    "Original Videogame Soundtrack",
    "La Bande Originale du Film",
    "Music from the Miniseries",
    "Bande Originale du Film",
    "Die Original Filmmusik",
    "Original Soundtrack",
    "Complete Score",
    "Original Score"
  ];
  const splitAlbumTitleKeywords = [
    "Bonus Tracks Edition",
    "Complete Edition",
    "Deluxe Edition",
    "Deluxe Version",
    "Tour Edition"
  ];
  if (isAlbum) {
    keywords = splitAlbumTitleKeywords;
  }
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue;
    return {
      title: title
        .replace(`(${keyword})`, "")
        .replace(`: ${keyword}`, "")
        .replace(`[${keyword}]`, "")
        .replace(`- ${keyword}`, "")
        .replace(`${keyword}`, ""),
      subtitle: keyword
    };
  }
  return {
    title: title,
    subtitle: ""
  };
};
