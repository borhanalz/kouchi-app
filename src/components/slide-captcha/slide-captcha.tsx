import 'src/lib/slide-captcha/slide-captcha';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    sliderCaptcha: (options: any) => any;
  }
}

function SlideCaptcha() {
  const ref = useRef<HTMLDivElement | null>(null);
  const captcha = useRef<any>(null);
  const [keyRender, resetKeyRender] = useState<number>(0);

  const toggleCaptcha = () => {
    if (captcha.current) {
      captcha.current = null;
      resetKeyRender((prev) => prev + 1);
      return;
    }

    if (ref.current && !captcha.current) {
      captcha.current = window.sliderCaptcha({
        element: ref.current,
        loadingText: 'لطفا صبر کنید',
        failedText: 'مجدد تلاش کنید',
        barText: 'پازل را سر جایس بگذارید',
        repeatIcon: 'fa fa-redo',
        onSuccess() {
          setTimeout(() => {
            alert('Your captcha is successfully verified.');
            captcha.current?.reset();
          }, 1000);
        },
      });
    }
  };

  useEffect(() => {
    if (ref.current && !captcha.current) {
      captcha.current = window.sliderCaptcha({
        element: ref.current,
        loadingText: 'لطفا صبر کنید',
        failedText: 'مجدد تلاش کنید',
        barText: 'پازل را سر جایس بگذارید',
        repeatIcon: 'fa fa-redo',
        onSuccess: function () {
          setTimeout(function () {
            alert('Your captcha is successfully verified.');
            captcha.current?.reset();
          }, 1000);
        },
      });
    }
  }, []);

  return (
    <>
      <div key={keyRender} ref={ref}></div>
      <div className="card">
        <button onClick={toggleCaptcha}>Toggle Captcha</button>
      </div>
    </>
  );
}

export default SlideCaptcha;
