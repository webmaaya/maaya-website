import { useState, useEffect } from "react";
import { collection, getDocs,} from "firebase/firestore";
import { db } from "../../firebase";
import "./AnnouncementBar.css";

export default function AnnouncementBar({onOpenPopup,  onAnnouncementChange,}) {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
  const fetch = async () => {
    try {
      const snap = await getDocs(collection(db, "announcements"));
      const today = new Date().toISOString().split("T")[0];
      const active = snap.docs
        .map(d => d.data())
        .filter(a => a.active === true && a.endDate >= today);
      if (active.length > 0) {
  setAnnouncement(active[0]);
  onAnnouncementChange?.(true);
} else {
  onAnnouncementChange?.(false);
}
    } catch(e) { console.error(e);
      onAnnouncementChange?.(false);
     }
  };
  fetch();
}, []);

  if (!announcement) return null;

  return (
    <div className="announce-bar" onClick={onOpenPopup}>
      <div className="announce-bar__track">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="announce-bar__text">
            📢 {announcement.text} &nbsp;&nbsp;&nbsp; 🔥 &nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}