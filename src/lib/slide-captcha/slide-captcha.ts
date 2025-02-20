(function () {
  'use strict';

  interface ExtendOptions {
    [key: string]: any;
  }

  interface SliderCaptchaOptions {
    width: number;
    height: number;
    PI: number;
    sliderL: number;
    sliderR: number;
    offset: number;
    loadingText: string;
    failedText: string;
    barText: string;
    repeatIcon: string;
    maxLoadCount: number;
    localImages: () => string;
    verify: (arr: number[], url: string | null) => boolean;
    remoteUrl: string | null;
    setSrc?: () => string;
    onRefresh?: () => void;
    onSuccess?: () => void;
    onFail?: () => void;
  }

  interface CanvasElements {
    canvas: HTMLCanvasElement;
    block: HTMLCanvasElement;
    sliderContainer: HTMLDivElement;
    refreshIcon: HTMLElement;
    slider: HTMLDivElement;
    sliderMask: HTMLDivElement;
    sliderIcon: HTMLElement;
    text: HTMLSpanElement;
    canvasCtx: CanvasRenderingContext2D;
    blockCtx: CanvasRenderingContext2D;
  }

  const extend = function (...args: ExtendOptions[]): ExtendOptions {
    const length = args.length;
    let target = args[0] || {};
    if (typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    if (length === 1) {
      target = this;
      args[1] = target;
    }
    for (let i = 1; i < length; i++) {
      const source = args[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

  const isFunction = function (obj: any): obj is Function {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
  };

  class SliderCaptcha {
    public static VERSION: string = '1.0';
    public static Author: string = 'argo@163.com';
    public static DEFAULTS: SliderCaptchaOptions = {
      width: 280,
      height: 155,
      PI: Math.PI,
      sliderL: 42,
      sliderR: 9,
      offset: 5,
      loadingText: 'Loading...',
      failedText: 'Try again',
      barText: 'Slide right to fill',
      repeatIcon: 'fa fa-repeat',
      maxLoadCount: 3,
      localImages: () => 'images/Pic' + Math.round(Math.random() * 4) + '.jpg',
      verify: (arr: number[], url: string | null) => {
        console.log("verify", arr, url);
        return false;
      },
      remoteUrl: null
    };

    public $element: HTMLElement;
    public options: SliderCaptchaOptions;
    public x: number = 0;
    public y: number = 0;
    public img: HTMLImageElement | null = null;
    public trail: number[] = [];
    public canvas: HTMLCanvasElement | null = null;
    public block: HTMLCanvasElement | null = null;
    public sliderContainer: HTMLDivElement | null = null;
    public refreshIcon: HTMLElement | null = null;
    public slider: HTMLDivElement | null = null;
    public sliderMask: HTMLDivElement | null = null;
    public sliderIcon: HTMLElement | null = null;
    public text: HTMLSpanElement | null = null;
    public canvasCtx: CanvasRenderingContext2D | null = null;
    public blockCtx: CanvasRenderingContext2D | null = null;

    constructor(element: HTMLElement, options: SliderCaptchaOptions) {
      this.$element = element;
      this.options = extend({}, SliderCaptcha.DEFAULTS, options) as SliderCaptchaOptions;
      this.$element.style.position = 'relative';
      this.$element.style.width = this.options.width + 'px';
      this.$element.style.margin = '0 auto';
      this.init();
    }

    init(): void {
      this.initDOM();
      this.initImg();
      this.bindEvents();
    }

    initDOM(): void {
      const createElement = (tagName: string, className: string): HTMLElement => {
        const element = document.createElement(tagName);
        element.className = className;
        return element;
      };

      const createCanvas = (width: number, height: number): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
      };

      const canvas = createCanvas(this.options.width - 2, this.options.height); // 画布
      const block = canvas.cloneNode(true) as HTMLCanvasElement; // Slider
      const sliderContainer = createElement('div', 'sliderContainer');
      const refreshIcon = createElement('i', 'refreshIcon ' + this.options.repeatIcon);
      const sliderMask = createElement('div', 'sliderMask');
      const sliderbg = createElement('div', 'sliderbg');
      const slider = createElement('div', 'slider');
      const sliderIcon = createElement('i', 'fa fa-arrow-right sliderIcon');
      const text = createElement('span', 'sliderText');

      block.className = 'block';
      text.innerHTML = this.options.barText;

      const el = this.$element;
      el.appendChild(canvas);
      el.appendChild(refreshIcon);
      el.appendChild(block);
      slider.appendChild(sliderIcon);
      sliderMask.appendChild(slider);
      sliderContainer.appendChild(sliderbg);
      sliderContainer.appendChild(sliderMask);
      sliderContainer.appendChild(text);
      el.appendChild(sliderContainer);

      const _canvas: CanvasElements = {
        canvas: canvas,
        block: block,
        sliderContainer: sliderContainer,
        refreshIcon: refreshIcon,
        slider: slider,
        sliderMask: sliderMask,
        sliderIcon: sliderIcon,
        text: text,
        canvasCtx: canvas.getContext('2d') as CanvasRenderingContext2D,
        blockCtx: block.getContext('2d') as CanvasRenderingContext2D
      };

      if (isFunction(Object.assign)) {
        Object.assign(this, _canvas);
      } else {
        extend(this, _canvas);
      }
    }

    initImg(): void {
      const that = this;
      const isIE = window.navigator.userAgent.indexOf('Trident') > -1;
      const L = this.options.sliderL + this.options.sliderR * 2 + 3; // 滑块实际边长

      const drawImg = (ctx: CanvasRenderingContext2D, operation: string): void => {
        const l = that.options.sliderL;
        const r = that.options.sliderR;
        const PI = that.options.PI;
        const x = that.x;
        const y = that.y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
        ctx.lineTo(x + l, y);
        ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
        ctx.lineTo(x + l, y + l);
        ctx.lineTo(x, y + l);
        ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
        ctx.lineTo(x, y);
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        ctx[operation]();
        ctx.globalCompositeOperation = isIE ? 'xor' : 'destination-over';
      };

      const getRandomNumberByRange = (start: number, end: number): number => {
        return Math.round(Math.random() * (end - start) + start);
      };

      const img = new Image();
      img.crossOrigin = "Anonymous";
      let loadCount = 0;

      img.onload = function () {
        // 随机创建滑块的位置
        that.x = getRandomNumberByRange(L + 10, that.options.width - (L + 10));
        that.y = getRandomNumberByRange(10 + that.options.sliderR * 2, that.options.height - (L + 10));
        drawImg(that.canvasCtx as CanvasRenderingContext2D, 'fill');
        drawImg(that.blockCtx as CanvasRenderingContext2D, 'clip');

        that.canvasCtx?.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
        that.blockCtx?.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
        const y = that.y - that.options.sliderR * 2 - 1;
        const ImageData = that.blockCtx?.getImageData(that.x - 3, y, L, L);
        if (that.block && ImageData) {
          that.block.width = L;
          that.blockCtx?.putImageData(ImageData, 0, y + 1);
        }
        if (that.text) {
          that.text.textContent = that.text.getAttribute('data-text');
        }
      };

      img.onerror = function () {
        loadCount++;
        if (window.location.protocol === 'file:') {
          loadCount = that.options.maxLoadCount;
          console.error("can't load pic resource file from File protocal. Please try http or https");
        }
        if (loadCount >= that.options.maxLoadCount) {
          if (that.text) {
            that.text.textContent = '加载失败';
            that.text.classList.add('text-danger');
          }
          return;
        }
        img.src = that.options.localImages();
      };

      img.setSrc = function () {
        let src = '';
        loadCount = 0;
        if (that.text) {
          that.text.classList.remove('text-danger');
        }
        if (isFunction(that.options.setSrc)) src = that.options.setSrc();
        if (!src || src === '') src = 'https://picsum.photos/' + that.options.width + '/' + that.options.height + '/?image=' + Math.round(Math.random() * 20);
        if (isIE) { // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
          const xhr = new XMLHttpRequest();
          xhr.onloadend = function (e) {
            const file = new FileReader(); // FileReader仅支持IE10+
            file.readAsDataURL(e.target.response);
            file.onloadend = function (e) {
              img.src = e.target.result as string;
            };
          };
          xhr.open('GET', src);
          xhr.responseType = 'blob';
          xhr.send();
        } else img.src = src;
      };

      img.setSrc();
      if (this.text) {
        this.text.setAttribute('data-text', this.options.barText);
        this.text.textContent = this.options.loadingText;
      }
      this.img = img;
    }

    clean(): void {
      this.canvasCtx?.clearRect(0, 0, this.options.width, this.options.height);
      this.blockCtx?.clearRect(0, 0, this.options.width, this.options.height);
      if (this.block) {
        this.block.width = this.options.width;
      }
    }

    bindEvents(): void {
      const that = this;
      this.$element.addEventListener('selectstart', function () {
        return false;
      });

      if (this.refreshIcon) {
        this.refreshIcon.addEventListener('click', function () {
          if (that.text) {
            that.text.textContent = that.options.barText;
          }
          that.reset();
          if (isFunction(that.options.onRefresh)) that.options.onRefresh.call(that.$element);
        });
      }

      let originX: number, originY: number, trail: number[] = [],
        isMouseDown = false;

      const handleDragStart = (e: MouseEvent | TouchEvent): void => {
        if (that.text && that.text.classList.contains('text-danger')) return;
        originX = (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX;
        originY = (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
        isMouseDown = true;
      };

      const handleDragMove = (e: MouseEvent | TouchEvent): void => {
        if (!isMouseDown) return;
        const eventX = (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX;
        const eventY = (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY;
        const moveX = eventX - originX;
        const moveY = eventY - originY;
        if (moveX < 0 || moveX + 40 > that.options.width) return;
        if (that.slider) {
          that.slider.style.left = (moveX - 1) + 'px';
        }
        if (that.block) {
          const blockLeft = (that.options.width - 40 - 20) / (that.options.width - 40) * moveX;
          that.block.style.left = blockLeft + 'px';
        }
        if (that.sliderContainer) {
          that.sliderContainer.classList.add('sliderContainer_active');
        }
        if (that.sliderMask) {
          that.sliderMask.style.width = (moveX + 4) + 'px';
        }
        trail.push(Math.round(moveY));
      };

      const handleDragEnd = (e: MouseEvent | TouchEvent): void => {
        if (!isMouseDown) return;
        isMouseDown = false;
        const eventX = (e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX;
        if (eventX === originX) return;
        if (that.sliderContainer) {
          that.sliderContainer.classList.remove('sliderContainer_active');
        }
        that.trail = trail;
        const data = that.verify();
        if (data.spliced && data.verified) {
          if (that.sliderContainer) {
            that.sliderContainer.classList.add('sliderContainer_success');
          }
          if (isFunction(that.options.onSuccess)) that.options.onSuccess.call(that.$element);
        } else {
          if (that.sliderContainer) {
            that.sliderContainer.classList.add('sliderContainer_fail');
          }
          if (isFunction(that.options.onFail)) that.options.onFail.call(that.$element);
          setTimeout(function () {
            if (that.text) {
              that.text.innerHTML = that.options.failedText;
            }
            that.reset();
          }, 1000);
        }
      };

      if (this.slider) {
        this.slider.addEventListener('mousedown', handleDragStart);
        this.slider.addEventListener('touchstart', handleDragStart);
      }
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);

      document.addEventListener('mousedown', function () { return false; });
      document.addEventListener('touchstart', function () { return false; });
      document.addEventListener('swipe', function () { return false; });
    }

    verify(): { spliced: boolean, verified: boolean } {
      const arr = this.trail; // 拖动时y轴的移动距离
      const left = parseInt(this.block?.style.left || '0', 10);
      let verified = false;
      if (this.options.remoteUrl !== null) {
        verified = this.options.verify(arr, this.options.remoteUrl);
      } else {
        const sum = (x: number, y: number): number => x + y;
        const square = (x: number): number => x * x;
        const average = arr.reduce(sum) / arr.length;
        const deviations = arr.map((x: number) => x - average);
        const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
        verified = stddev !== 0;
      }
      return {
        spliced: Math.abs(left - this.x) < this.options.offset,
        verified: verified
      };
    }

    reset(): void {
      if (this.sliderContainer) {
        this.sliderContainer.classList.remove('sliderContainer_fail');
        this.sliderContainer.classList.remove('sliderContainer_success');
      }
      if (this.slider) {
        this.slider.style.left = '0';
      }
      if (this.block) {
        this.block.style.left = '0';
      }
      if (this.sliderMask) {
        this.sliderMask.style.width = '0';
      }
      this.clean();
      if (this.text) {
        this.text.setAttribute('data-text', this.text.textContent || '');
        this.text.textContent = this.options.loadingText;
      }
      if (this.img) {
        this.img.setSrc();
      }
    }
  }

  const Plugin = function (option: { id?: string, element?: HTMLElement, [key: string]: any }): SliderCaptcha {
    const $this = option.id ? document.getElementById(option.id) : option.element;
    if (!$this) {
      throw new Error('Element not found');
    }
    const options = typeof option === 'object' && option;
    return new SliderCaptcha($this, options as SliderCaptchaOptions);
  };

  window.sliderCaptcha = Plugin;
  window.sliderCaptcha.Constructor = SliderCaptcha;
})();
