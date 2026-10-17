import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    
    if (isInstalled) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (installed || !showInstall) return null;

  return (
    <div className="install-prompt">
      <div className="install-card">
        <div className="install-info">
          <img src="/icon-192.png" alt="App Icon" className="install-icon" />
          <div>
            <h3>Install Routine & Budget</h3>
            <p>Use app like Web WhatsApp. Install for faster access & offline use!</p>
          </div>
        </div>
        <div className="install-actions">
          <button className="btn ghost small" onClick={() => setShowInstall(false)}>
            Later
          </button>
          <button className="btn primary small" onClick={handleInstall}>
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
