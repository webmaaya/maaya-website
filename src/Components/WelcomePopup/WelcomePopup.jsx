import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./WelcomePopup.css";

const getYouTubeId = (url = "") => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};

export default function WelcomePopup() {
  const [popup, setPopup] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("popupSeen")) return; // once per visit
    (async () => {
      const snap = await getDocs(collection(db, "welcomePopups"));
      const today = new Date().toLocaleDateString("en-CA");
      const valid = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.active &&
          (!p.startDate || p.startDate <= today) &&
          (!p.endDate || p.endDate >= today));
      if (valid.length) {
        setPopup(valid[0]);
        setTimeout(() => setOpen(true), 1000);   // 1 second delay
      }
    })();
  }, []);

  const close = () => { setOpen(false); sessionStorage.setItem("popupSeen", "1"); };
  if (!open || !popup) return null;

  const ytId = getYouTubeId(popup.videoUrl);
  const isExternal = popup.link?.startsWith("http");

  return (
    <div className="wpop__overlay" onClick={close}>
      <div className="wpop__box" onClick={e => e.stopPropagation()}>
        <button className="wpop__close" onClick={close} aria-label="Close">×</button>

        {ytId && (
          <div className="wpop__video">
            <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0`}
              title="video" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
          </div>
        )}
        {!ytId && popup.imageUrl && <img className="wpop__img" src={popup.imageUrl} alt={popup.title} />}

        <div className="wpop__body">
          {popup.title && <h2>{popup.title}</h2>}
          {popup.message && <p>{popup.message}</p>}
          <div className="wpop__actions">
            {popup.btnText && popup.link && (
              <a className="wpop__btn" href={popup.link}
                target={isExternal ? "_blank" : "_self"} rel="noreferrer" onClick={close}>
                {popup.btnText}
              </a>
            )}
            {/* <button className="wpop__btn wpop__btn--ghost" onClick={close}>Close</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}