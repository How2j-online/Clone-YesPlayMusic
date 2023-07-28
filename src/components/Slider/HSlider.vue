<script setup lang="ts">
import { computed, CSSProperties, nextTick, onMounted, reactive, ref, shallowRef, unref, watch } from "vue";
import { debounce } from "lodash-es";

defineOptions({
  name: "HSlider"
});
const logMessage = false;
//TODO: clickable lazy toolTipFormatter vertical
const props = withDefaults(
  defineProps<{
    dotSize?: number; // 滑块大小
    modelValue: number; // 滑块值
    min?: number; // 最小值
    max?: number; // 最大值
    height?: number; // 轨道高度
    interval?: number; // 步长
    disabled?: boolean; // 是否禁用
    clickable?: boolean; // 是否可点击改变值
    dragOnClick?: boolean; // 是否可拖拽改变值
    duration?: number; // 动画时长
    lazy?: boolean; // 是否懒加载, 在拖拽结束后才更新值
    tooltipFormatter?: (value: number) => string; // 提示框格式化
    railStyle?: CSSProperties; // 轨道样式
    dotStyle?: CSSProperties; // 滑块样式
    processStyle?: CSSProperties; // 进度条样式
    vertical?: boolean; // 是否垂直
    tooltip?: "none" | "always" | "hover" | "focus" | "active"; // 是否显示提示框
  }>(),
  {
    dotSize: 14,
    modelValue: 0,
    width: "auto",
    height: 4,
    min: 0,
    max: 100,
    interval: 1,
    disabled: false,
    clickable: true,
    dragOnClick: true,
    duration: 0.2,
    lazy: false,
    tooltip: "hover"
  }
);
const emits = defineEmits(["update:modelValue", "onDragEnd", "onClick"]);
const dragValue = ref(unref(props.modelValue)); // 拖拽值
const slider = shallowRef<HTMLElement>(); // 滑块dom
const buttonRef = shallowRef<HTMLElement>(); // 按钮dom
const tooltipValue = ref(""); // 提示框值
const initData = reactive({
  startPosition: 0, // 开始位置
  newPosition: 0, // 新位置
  startX: 0, // 开始x
  startY: 0, // 开始y
  oldValue: 0, // 旧值
  dragging: false, // 是否拖拽
  isClick: false, // 点击或拖拽
  currentX: 0, // 当前x
  currentY: 0, // 当前y
  sliderSize: 1, // 滑块轨道大小
  duration: 0.5 // 动画时长
});
const showTooltip = computed(() => {
  // 是否显示提示框
  return props.tooltip !== "none";
});
const tooltipVisible = ref(false); // 提示框显示
const dotVisible = ref(false); // 滑块显示
const firstDragTime = ref();

// 样式处理
const sliderStyle = computed(() => {
  const width = props.width === "auto" ? "100%" : props.width + "px";
  return {
    width,
    height: props.height + "px"
  };
});
const dotSizeStyle = computed(() => {
  return {
    width: props.dotSize + "px",
    height: props.dotSize + "px",
    ...props.dotStyle
  };
});
const dotPositionStyle = computed(() => {
  return props.vertical ? { bottom: currentPosition.value } : { left: currentPosition.value };
});
const processStyle = computed(() => {
  return { width: currentPosition.value, transitionDuration: props.duration + "s", ...props.processStyle };
});
const currentPosition = computed(() => {
  if (!initData.dragging) {
    return ((props.modelValue - props.min) / (props.max - props.min)) * 100 + "%";
  }
  return ((dragValue.value - props.min) / (props.max - props.min)) * 100 + "%";
});
// 精度
const precision = computed(() => {
  const precisions = [props.min, props.max, props.interval].map(item => {
    const decimal = `${item}`.split(".")[1];
    return decimal ? decimal.length : 0;
  });
  return Math.max.apply(null, precisions);
});

onMounted(() => {
  initData.sliderSize = props.vertical ? slider.value!.offsetHeight : slider.value!.offsetWidth;
  if (props.tooltipFormatter) {
    tooltipValue.value = props.tooltipFormatter(props.modelValue);
  } else {
    tooltipValue.value = props.modelValue + "";
  }
});
watch(
  () => props.modelValue,
  value => {
    if (initData.dragging) return;
    setTipToolValue(value);
  }
);

const handleSliderPointerEvent = async (event: MouseEvent) => {
  if (initData.dragging || props.disabled) return;
  resetSize();
  let newPercent: number;
  if (props.vertical) {
    const clientY = (event as MouseEvent).clientY;
    const sliderOffsetBottom = slider.value!.getBoundingClientRect().bottom;
    newPercent = ((sliderOffsetBottom - clientY) / initData.sliderSize) * 100;
  } else {
    const clientX = (event as MouseEvent).clientX;
    const sliderOffsetLeft = slider.value!.getBoundingClientRect().left;
    newPercent = ((clientX - sliderOffsetLeft) / initData.sliderSize) * 100;
  }
  if (newPercent < 0 || newPercent > 100) return;
  displayDot();
  await setPosition(newPercent);
  onButtonDown(event);
};

// 轨道移入
const onSliderWrapperEnter = () => {
  if (logMessage) console.log("轨道移入");
  if (props.disabled) return;
  displayDot();
};
// 轨道移出
const onSliderWrapperLeave = () => {
  if (logMessage) console.log("轨道移出");
  if (props.disabled) return;
  if (!initData.dragging) {
    hideDot();
  }
};

// 鼠标移入按钮
const handleMouseEnter = () => {
  if (logMessage) console.log("鼠标移入");
  if (props.disabled) return;
  displayTooltip();
};
// 鼠标移出按钮
const handleMouseLeave = () => {
  if (logMessage) console.log("鼠标移出");
  if (!initData.dragging) {
    hideTooltip();
  }
};

const onSliderDown = (event: MouseEvent) => {
  handleSliderPointerEvent(event);
};
// 鼠标按下和移动
const onButtonDown = (event: MouseEvent) => {
  if (logMessage) console.log("鼠标按下");
  if (props.disabled) return; // 禁用状态
  if (event.type === "mousedown") {
    event.preventDefault();
  }
  onDragStart(event);
  window.addEventListener("mousemove", onDragging);
  window.addEventListener("mouseup", onDragEnd);
  window.addEventListener("contextmenu", onDragEnd);
};
const onDragStart = (event: MouseEvent) => {
  initData.dragging = true;
  initData.isClick = true;
  const { clientX, clientY } = getClientXY(event);
  if (props.vertical) {
    initData.startY = clientY;
  } else {
    initData.startX = clientX;
  }
  initData.startPosition = Number.parseFloat(currentPosition.value);
  initData.newPosition = initData.startPosition;
  firstDragTime.value = new Date().getTime();
};
const onDragging = (event: MouseEvent) => {
  if (initData.dragging) {
    if (logMessage) console.log("鼠标移动");
    initData.isClick = false;
    // displayTooltip();
    resetSize();
    let diff: number;
    const { clientX, clientY } = getClientXY(event);
    if (props.vertical) {
      // 垂直
      initData.currentY = clientY;
      diff = ((initData.startY - initData.currentY) / initData.sliderSize) * 100;
    } else {
      // 水平
      initData.currentX = clientX;
      diff = ((initData.currentX - initData.startX) / initData.sliderSize) * 100;
    }
    initData.newPosition = initData.startPosition + diff;
    setPosition(initData.newPosition);
  }
};
const onDragEnd = () => {
  if (initData.dragging) {
    if (logMessage) console.log("鼠标抬起");
    setTimeout(() => {
      initData.dragging = false;
      hideTooltip();
      hideDot();
      if (new Date().getTime() - firstDragTime.value < 400) {
        setPosition(initData.newPosition);
        emits("onDragEnd", dragValue.value);
      }
      if (!initData.isClick) {
        setPosition(initData.newPosition);
        emits("onDragEnd", dragValue.value);
      }
    }, 0);

    window.removeEventListener("mousemove", onDragging);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("contextmenu", onDragEnd);
  }
};
// 设置位置
const setPosition = async (newPosition: number) => {
  if (newPosition === null || Number.isNaN(newPosition)) return;
  if (newPosition < 0) {
    newPosition = 0;
  } else if (newPosition > 100) {
    newPosition = 100;
  }
  // 计算步长
  const lengthPerStep = 100 / ((props.max - props.min) / props.interval);
  // 计算步数
  const steps = Math.round(newPosition / lengthPerStep);
  // 计算值
  let value = steps * lengthPerStep * ((props.max - props.min) / 100) + props.min;
  console.log(value);
  value = Number.parseFloat(value.toFixed(precision.value));
  // 设置值
  dragValue.value = value;
  setTipToolValue(value);
  if (value !== props.modelValue) {
    if (initData.dragging && !props.lazy) {
      emits("update:modelValue", value);
    }
    if (!initData.dragging) {
      emits("update:modelValue", value);
    }
  }

  if (!initData.dragging && props.modelValue !== initData.oldValue) {
    initData.oldValue = dragValue.value;
  }

  await nextTick();
  initData.dragging && displayTooltip();
};

// 获取位置
const getClientXY = (event: MouseEvent | TouchEvent) => {
  let clientX: number;
  let clientY: number;
  if (event.type.startsWith("touch")) {
    clientY = (event as TouchEvent).touches[0].clientY;
    clientX = (event as TouchEvent).touches[0].clientX;
  } else {
    clientY = (event as MouseEvent).clientY;
    clientX = (event as MouseEvent).clientX;
  }
  return {
    clientX,
    clientY
  };
};

// 获取轨道长度
const resetSize = () => {
  if (slider.value) {
    initData.sliderSize = props.vertical ? slider.value.clientHeight : slider.value.clientWidth;
  }
};

const setTipToolValue = (value: number) => {
  if (props.tooltipFormatter) {
    tooltipValue.value = props.tooltipFormatter(value);
  } else {
    tooltipValue.value = props.modelValue + "";
  }
};

const displayTooltip = debounce(() => {
  showTooltip.value && (tooltipVisible.value = true);
}, 50);

const hideTooltip = debounce(() => {
  showTooltip.value && (tooltipVisible.value = false);
}, 500);

const displayDot = debounce(() => {
  dotVisible.value = true;
}, 50);

const hideDot = debounce(() => {
  dotVisible.value = false;
}, 500);
</script>

<template>
  <div class="slider user-select-none" :style="sliderStyle" @mouseenter="onSliderWrapperEnter" @mouseleave="onSliderWrapperLeave">
    <!--滑块轨道-->
    <div class="slider-rail" :style="railStyle" ref="slider" @mousedown="onSliderDown">
      <!--已经划过的轨道-->
      <div class="slider-process" :style="processStyle"></div>
      <!--滑块按钮-->
      <div
        v-show="dotVisible"
        ref="buttonRef"
        class="slider-dot"
        :style="[dotSizeStyle, dotPositionStyle]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="onButtonDown"
        @focus="handleMouseEnter"
        @blur="handleMouseLeave"
      >
        <div class="slider-top-tip" v-show="tooltipVisible">
          <slot name="tip">
            <div class="slider-tip">
              <span>{{ tooltipValue }}</span>
            </div>
          </slot>
          <div class="slider-arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.slider {
  width: 100%;
  user-select: none;
  touch-action: none;
  position: relative;
  box-sizing: border-box;
  display: flex;
  .slider-rail {
    flex: 1;
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    //background-color: #e6e6e6;
    background-color: red;
    transition-property: width, height, left, right, top, bottom;

    .slider-process {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: blue;
      border-radius: 15px;
      transition-property: width, height, left, right, top, bottom;
    }

    .slider-dot {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.12);
      border-radius: 50%;
      background-color: #ffffff;
      &:hover {
        cursor: pointer;
      }

      .slider-top-tip {
        position: absolute;
        font-size: 14px;
        color: #000;
        top: -30px;
        padding: 2px 4px;
        border-radius: 4px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff;
        box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.08);
        .slider-arrow {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background-color: red;
          //&::before {
          //  position: absolute;
          //  top: 100%;
          //  left: 50%;
          //  transform: translateX(-50%) rotate(45deg);
          //  content: "";
          //  width: 10px;
          //  height: 10px;
          //  box-sizing: border-box;
          //  border: 1px solid #ffffff;
          //  border-top-color: transparent !important;
          //  border-left-color: transparent !important;
          //  background: #ffffff;
          //  border-bottom-right-radius: 2px;
          //  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.08);
          //  //box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.08);
          //}
        }
      }
    }
  }
}
</style>
