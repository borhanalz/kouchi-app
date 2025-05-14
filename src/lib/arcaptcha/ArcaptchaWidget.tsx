import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";

declare global {
  interface Window {
    arcaptcha?: any;
    arcaptchaWidgetLoading?: Promise<void>;
  }
}

interface ArCaptchaProps {
  domain?: string;
  api_url?: string;
  callback: (token: string) => void;
  rendered_callback?: () => void;
  closed_callback?: () => void;
  opened_callback?: () => void;
  error_callback?: () => void;
  reset_callback?: () => void;
  expired_callback?: () => void;
  chlexpired_callback?: () => void;
  lang?: string;
  theme?: string;
  color?: string;
  invisible?: boolean;
  "site-key": string;
}

export interface ArCaptchaHandle {
  execute: () => void;
  reset: () => void;
  close: () => void;
}

const ArCaptcha = forwardRef<ArCaptchaHandle, ArCaptchaProps>(
  (
    {
      domain,
      api_url,
      callback,
      rendered_callback,
      closed_callback,
      opened_callback,
      error_callback,
      reset_callback,
      expired_callback,
      chlexpired_callback,
      lang,
      theme,
      color,
      invisible,
      "site-key": siteKey,
    },
    ref
  ) => {
    const [widgetId, setWidgetId] = useState<string>("");
    const [elementId, setElementId] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    const generateRandomID = useCallback(() => `arcaptcha-widget-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, []);

    // eslint-disable-next-line consistent-return
    const execute = useCallback(() => {
      if (window.arcaptcha && widgetId) {
        return window.arcaptcha.execute(widgetId);
      }
    }, [widgetId]);

    const resetCaptcha = useCallback(() => {
      if (window.arcaptcha && widgetId) {
        window.arcaptcha.reset(widgetId);
      }
    }, [widgetId]);

    const closeCaptcha = useCallback(() => {
      if (window.arcaptcha && widgetId) {
        window.arcaptcha.close(widgetId);
      }
    }, [widgetId]);

    const loadCaptcha = useCallback(() => {
      if (!window.arcaptcha || !elementId) return;

      const id = window.arcaptcha.render(`#${elementId}`, {
        "site-key": siteKey,
        size: invisible ? "invisible" : "",
        callback,
        rendered_callback,
        closed_callback,
        opened_callback,
        error_callback,
        reset_callback,
        expired_callback,
        chlexpired_callback,
        lang,
        theme,
        color,
      });

      setWidgetId(id);

      window.addEventListener(`arcaptcha-token-changed-${id}`, (event: any) => {
        // Optional: token change handler
      });
    }, [
      elementId,
      siteKey,
      invisible,
      callback,
      rendered_callback,
      closed_callback,
      opened_callback,
      error_callback,
      reset_callback,
      expired_callback,
      chlexpired_callback,
      lang,
      theme,
      color,
    ]);

    useImperativeHandle(ref, () => ({
      execute,
      reset: resetCaptcha,
      close: closeCaptcha,
    }));

    useEffect(() => {
      const id = generateRandomID();
      setElementId(id);

      const existingScript = document.head.querySelector("#arcptcha-script");
      const script = existingScript || document.createElement("script");
      const domainQuery = domain ? `?${domain}` : "";
      script.src = api_url || `https://widget.arcaptcha.ir/1/api.js${domainQuery}`;
      script.id = "arcptcha-script";
      script.defer = true;

      if (!existingScript) {
        window.arcaptchaWidgetLoading = new Promise((resolve) => {
          script.onload = () => {
            resolve();
            loadCaptcha();
          };
        });
        document.head.appendChild(script);
      } else if (window.arcaptcha) {
        window.arcaptchaWidgetLoading?.then(loadCaptcha);
      }
    }, [domain, api_url, generateRandomID, loadCaptcha]);

    return <div ref={containerRef} id={elementId} />;
  }
);

ArCaptcha.displayName = "ArCaptcha";

export default ArCaptcha;
