/// <reference types="google.maps" />

let loading: Promise<void> | null = null;

/**
 * Loads the Google Maps JavaScript API (with the marker library) once per page. The key comes
 * from the host app's configuration and should be restricted to the app's domains.
 */
export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only load in a browser.'));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve();
  }

  loading ??= new Promise<void>((resolve, reject) => {
    const callbackName = '__ucGoogleMapsLoaded';
    (window as unknown as Record<string, () => void>)[callbackName] = () => resolve();

    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js' +
      `?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=marker&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      loading = null;
      reject(new Error('Google Maps failed to load.'));
    };
    document.head.appendChild(script);
  });

  return loading;
}
