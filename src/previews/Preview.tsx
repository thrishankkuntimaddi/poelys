import { useState, type ReactNode } from 'react';
import { Icon } from '../components/Icon';
import type { Product } from '../data/products';
import { track } from '../lib/track';
import { frameFor } from './frame';
import { Scene } from './Scenes';

type Tab = 'inside' | 'run' | 'watch';

function host(u?: string) {
  try { return u ? new URL(u).host : ''; } catch { return ''; }
}

export function Frame({ p, children, url }: { p: Product; children: ReactNode; url?: string }) {
  const kind = frameFor(p.preview);
  if (kind === 'browser') {
    return (
      <div className="frame frame--browser">
        <div className="frame__chrome">
          <span className="frame__dots"><i /><i /><i /></span>
          <span className="frame__url"><Icon name="lock" size={11} />{host(url || p.links.open || p.links.site) || `${p.id}.poelys.com`}</span>
          {url && <a className="frame__pop" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name} in a new tab`} onClick={() => track('open', p.id)}><Icon name="ext" size={14} /></a>}
        </div>
        <div className="frame__screen">{children}</div>
      </div>
    );
  }
  return <div className={`frame frame--${kind}`}><div className="frame__screen">{children}</div></div>;
}

/** Product preview: a coded scene, the product itself running in the page, and its film. */
export function Preview({ p, compact = false }: { p: Product; compact?: boolean }) {
  const [tab, setTab] = useState<Tab>('inside');
  const [videoOn, setVideoOn] = useState(false);
  const tabs: [Tab, string][] = [['inside', 'Inside'], ...(p.embed ? [['run', 'Try it here'] as [Tab, string]] : []), ...(p.youtube ? [['watch', 'Watch'] as [Tab, string]] : [])];

  return (
    <div className={`preview ${compact ? 'preview--compact' : ''}`}>
      {tabs.length > 1 && (
        <div className="preview__tabs" role="tablist" aria-label={`${p.name} preview`}>
          {tabs.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''}
              onClick={() => { setTab(id); if (id !== 'inside') track(id === 'run' ? 'preview' : 'film', p.id); }}>
              {id === 'watch' && <Icon name="play" size={12} />}{label}
            </button>
          ))}
        </div>
      )}

      {tab === 'inside' && <Frame p={p}><Scene kind={p.preview} p={p} /></Frame>}

      {tab === 'run' && p.embed && (
        <Frame p={{ ...p, preview: 'workspace' }} url={p.embed}>
          <iframe
            className="preview__iframe" src={p.embed} title={`${p.name}, running inside poelys.com`} loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin" allow="fullscreen"
          />
        </Frame>
      )}

      {tab === 'watch' && p.youtube && (
        <div className="frame frame--video">
          {videoOn ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${p.youtube}?autoplay=1&rel=0&modestbranding=1`}
              title={`${p.name} film`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button className="video-facade" onClick={() => setVideoOn(true)} aria-label={`Play the ${p.name} film`}>
              <img src={`https://i.ytimg.com/vi/${p.youtube}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="video-facade__play"><Icon name="play" size={22} /></span>
              <span className="video-facade__note t-mono">Plays from YouTube (no cookies until you press play)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
