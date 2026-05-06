let kakaoSdkPromise: Promise<void> | null = null;

export function loadKakaoMapsSdk(appKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps SDK는 브라우저 환경에서만 로드할 수 있습니다."));
  }

  if (!appKey) {
    return Promise.reject(new Error("VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다."));
  }

  if (window.kakao?.maps) {
    return Promise.resolve();
  }

  if (kakaoSdkPromise) {
    return kakaoSdkPromise;
  }

  kakaoSdkPromise = new Promise<void>((resolve, reject) => {
    const completeLoad = () => {
      if (!window.kakao?.maps?.load) {
        kakaoSdkPromise = null;
        reject(new Error("Kakao Maps SDK를 초기화하지 못했습니다."));
        return;
      }

      window.kakao.maps.load(() => resolve());
    };

    const handleError = () => {
      kakaoSdkPromise = null;
      reject(new Error("Kakao Maps SDK 스크립트 로드에 실패했습니다."));
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]'
    );

    if (existingScript) {
      if (window.kakao?.maps?.load) {
        completeLoad();
        return;
      }

      existingScript.addEventListener("load", completeLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.dataset.kakaoMapsSdk = "true";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.addEventListener("load", completeLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  return kakaoSdkPromise;
}