import { useEffect, useMemo, useRef, useState } from 'react';
import { STATIC_JWT, decodePayload } from './token';
import { Bell, Chat, ChevronDown, ChevronLeft, Gear, Help, IncaLogo, Search, SpainFlag } from './icons';

const EMBEDDED_APP_URL = import.meta.env.VITE_EMBEDDED_APP_URL;
const TOKEN_PARAM = import.meta.env.VITE_TOKEN_QUERY_PARAM || 'token';
const APP_VERSION = 'V.2.0.303';

export function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [semantica, setSemantica] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const embeddedOrigin = new URL(EMBEDDED_APP_URL).origin;
  const user = useMemo(() => decodePayload(STATIC_JWT), []);
  const initial = String(user.name ?? user.email ?? '?').charAt(0).toUpperCase();

  const src = useMemo(() => {
    const url = new URL(EMBEDDED_APP_URL);
    url.searchParams.set(TOKEN_PARAM, STATIC_JWT);
    return url.toString();
  }, []);

  // itcm-dp-sdr-do hoy lee la sesión SOLO por postMessage (UC-AC-01):
  // `{ type: 'AUTH_SESSION', token }`. Se envía también, además del query param.
  const sendSession = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'AUTH_SESSION', token: STATIC_JWT }, embeddedOrigin);
    setSessionExpired(false);
  };

  // RN-AC-006: la app embebida avisa con AUTH_EXPIRED ante un 401.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== embeddedOrigin) return;
      if (event.data?.type === 'AUTH_EXPIRED') setSessionExpired(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [embeddedOrigin]);

  return (
    <div className={`layout${collapsed ? ' is-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <IncaLogo />
          {!collapsed && <span className="brand-text">INCA</span>}
        </div>

        {!collapsed && (
          <>
            <button type="button" className="module-select">
              <span>Evaluación de Desempeño</span>
              <ChevronDown />
            </button>
            <nav>
              <a className="nav-item is-active" href="#">
                <span className="dot" />
                Evaluación
              </a>
            </nav>
          </>
        )}

        <div className="sidebar-footer">
          <button type="button" className="icon-btn" aria-label="Configuración"><Gear /></button>
          <button type="button" className="icon-btn" aria-label="Ayuda"><Help /></button>
          {!collapsed && (
            <span className="lang"><SpainFlag /> Español</span>
          )}
        </div>
      </aside>

      <button
        type="button"
        className="collapse-btn"
        aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
        onClick={() => setCollapsed((c) => !c)}
      >
        <ChevronLeft />
      </button>

      <div className="main">
        <header className="topbar">
          <div className="search">
            <Search />
            <input placeholder="Buscar y solicitar Acceso a Tablas" />
            <label className="mode">
              <span className={semantica ? '' : 'is-on'}>Clásica</span>
              <button
                type="button"
                role="switch"
                aria-checked={semantica}
                className={`switch${semantica ? ' is-on' : ''}`}
                onClick={() => setSemantica((s) => !s)}
              />
              <span className={semantica ? 'is-on' : ''}>Semántica</span>
            </label>
          </div>
          <div className="topbar-right">
            <button type="button" className="icon-btn" aria-label="Notificaciones"><Bell /></button>
            <span className="avatar" title={`${String(user.name ?? '')} · ${String(user.email ?? '')}`}>{initial}</span>
          </div>
        </header>

        <main className="content">
          <h1>Evaluación de Desempeño</h1>
          <section className="card">
            {sessionExpired && (
              <div className="banner">
                La sesión expiró o el token fue rechazado.
                <button type="button" onClick={sendSession}>Reintentar</button>
              </div>
            )}
            <iframe ref={iframeRef} title="Evaluación de Desempeño" src={src} onLoad={sendSession} />
          </section>
        </main>

        <footer className="version">{APP_VERSION} © INTERCORP</footer>
      </div>

      <button type="button" className="chat-fab" aria-label="Asistente"><Chat /></button>
    </div>
  );
}
