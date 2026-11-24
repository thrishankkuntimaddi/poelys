import { useState } from 'react';
import { safeUrl, useSite } from '../lib/config';
import { Link } from '../lib/router';
import { store } from '../lib/track';
import { Icon } from './Icon';

/** The announcement strip, controlled from the Console. */
export function Banner() {
  const { cfg } = useSite();
  const b = cfg.banner;
  const [closed, setClosed] = useState(() => store.get('poelys.banner'));
  if (!b?.on || !b.text || closed === b.id) return null;
  const link = safeUrl(b.link);
  return (
    <div className={`banner banner--${b.tone || 'red'}`} role="region" aria-label="Announcement">
      <div className="wrap banner__inner">
        <span className="banner__dot" aria-hidden="true" />
        <p>{b.text}</p>
        {link && <Link to={link} className="banner__link">{b.linkText || 'Read more'} →</Link>}
        <button className="banner__x" aria-label="Dismiss announcement" onClick={() => { store.set('poelys.banner', b.id); setClosed(b.id); }}>
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
