import axisBank from "../../assets/clients-logo/axis_bank.png";
import bajajFinserv from "../../assets/clients-logo/bajaj_finserv.png";
import dcc from "../../assets/clients-logo/dcc.png";
import delhivery from "../../assets/clients-logo/delhivery.png";
import delta from "../../assets/clients-logo/delta.png";
import dyncons from "../../assets/clients-logo/dyncons.png";
import lenskart from "../../assets/clients-logo/lenskart.png";
import cognizant from "../../assets/clients-logo/cognizant.png";
import sainik from "../../assets/clients-logo/sainik.png";
import sbi from "../../assets/clients-logo/sbi.png";
import tata from "../../assets/clients-logo/tata.png";
import tcs from "../../assets/clients-logo/tcs.png";
import optimus from "../../assets/clients-logo/Optimus Logo.png";
import "./Company.css";

// `scale` is optional — bump it up (e.g. 1.2) for logos that look too small
// inside their box, or bring it down (e.g. 0.8) for ones that look too big.
// Tune these per-logo once you see them rendered.
const rowOne = [
  { name: "Axis Bank", logo: axisBank },
  { name: "Bajaj Finserv", logo: bajajFinserv },
  { name: "DCC", logo: dcc },
  { name: "Delhivery", logo: delhivery },
  { name: "Delta Corp", logo: delta },
  { name: "Dynacons", logo: dyncons },
  { name: "Lenskart", logo: lenskart },
  { name: "Cognizant", logo: cognizant },
  { name: "Sainik", logo: sainik },
  { name: "SBI", logo: sbi },
  { name: "Tata", logo: tata },
  { name: "TCS", logo: tcs },
  { name: "Optimus", logo: optimus },
];

const LaurelLeft = () => (
  <svg
    className="laurel-svg"
    viewBox="0 0 77 168"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.3">
      <path d="M46.9868 142.48C43.1248 144.665 33.1818 146.914 24.3059 138.433C30.3134 135.035 43.2601 131.086 46.9868 142.48Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M43.1713 131.595C47.4874 130.566 56.3629 125.703 57.3368 114.487C50.623 116.089 38.3905 121.753 43.1713 131.595Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M36.7869 110.723C41.224 110.722 50.985 107.7 54.532 95.6214C47.6298 95.623 34.4177 98.6455 36.7869 110.723Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M38.1502 118.819C33.9486 120.245 23.7606 120.601 16.6214 110.614C23.1572 108.395 36.613 106.93 38.1502 118.819Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M33.4558 96.1212C30.5359 96.595 23.8341 95.9239 20.3857 89.4483C24.9277 88.7112 33.9006 89.0138 33.4558 96.1212Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M33.0137 84.826C33.0678 81.9089 34.9646 75.5241 42.1194 73.3221C42.0354 77.8599 40.0966 86.5136 33.0137 84.826Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M31.6051 73.6114C28.7001 73.3402 22.4743 70.9732 20.8113 63.6742C25.3302 64.096 33.8155 66.6739 31.6051 73.6114Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M33.1769 60.0663C33.6162 57.1819 36.3405 51.1039 43.7237 49.8672C43.0404 54.3541 39.9745 62.6755 33.1769 60.0663Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M33.8323 49.0572C30.9472 49.4916 24.3351 48.6886 20.9682 42.0025C25.4562 41.3269 34.3123 41.792 33.8323 49.0572Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M36.3539 32.4555C38.017 30.0582 43.1369 25.7979 50.3116 27.9345C47.7245 31.6635 41.3111 37.7884 36.3539 32.4555Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M63.038 161.925C46.4397 149.046 18.681 101.31 40.4331 13.3896" stroke="#979797" strokeWidth="2.46033" strokeLinecap="round" />
      <path d="M36.0334 29.3588C33.2673 28.4306 27.7477 24.7026 27.7978 17.2167C32.1006 18.6607 39.7715 23.1106 36.0334 29.3588Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
      <path d="M40.1298 14.2683C42.9036 14.1584 48.9072 11.4204 50.7309 1.34715C46.416 1.51802 38.255 4.34146 40.1298 14.2683Z" fill="#979797" stroke="#979797" strokeWidth="1.23016" strokeLinecap="round" />
    </g>
  </svg>
);

const LaurelRight = () => (
  <svg
    className="laurel-svg"
    viewBox="0 0 72 164"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.3">
      <path d="M28.4218 139.219C32.2443 141.272 42.0132 143.257 50.5088 134.776C44.5627 131.582 31.8207 128 28.4218 139.219Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M31.9201 128.495C27.6785 127.581 18.8971 123.018 17.7044 112.074C24.3024 113.495 36.3828 118.77 31.9201 128.495Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M37.7137 107.953C33.3758 108.047 23.7682 105.302 20.0415 93.5693C26.7894 93.4227 39.7709 96.0942 37.7137 107.953Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M36.553 115.896C40.6912 117.201 50.6591 117.331 57.4245 107.414C50.9872 105.385 37.8008 104.24 36.553 115.896Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M40.6585 93.6066C43.5232 94.0073 50.0608 93.2074 53.2932 86.8026C48.8369 86.1794 40.0711 86.6677 40.6585 93.6066Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M40.847 82.5548C40.7316 79.7041 38.7402 73.5027 31.6981 71.5034C31.8776 75.9379 33.9587 84.3566 40.847 82.5548Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M41.9822 71.5596C44.8165 71.2322 50.8523 68.7846 52.3216 61.6131C47.9127 62.1224 39.6725 64.8247 41.9822 71.5596Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M40.1556 58.3518C39.6642 55.5413 36.8705 49.6577 29.6258 48.607C30.3901 52.9789 33.566 61.0485 40.1556 58.3518Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M39.2794 47.6023C42.1093 47.965 48.5563 47.0382 51.7045 40.4293C47.3023 39.8651 38.6543 40.5098 39.2794 47.6023Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M36.4576 31.4265C34.7803 29.1185 29.6835 25.0633 22.7151 27.306C25.3243 30.8962 31.7256 36.7466 36.4576 31.4265Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M13.1483 158.573C29.0992 145.626 55.2132 98.3617 32.0615 12.874" stroke="#979797" strokeWidth="2.40589" strokeLinecap="round" />
      <path d="M36.7045 28.3919C39.3888 27.4251 44.705 23.6621 44.4955 16.3447C40.3199 17.8486 32.9159 22.3636 36.7045 28.3919Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
      <path d="M32.3759 13.7268C29.6617 13.6789 23.7337 11.1309 21.7347 1.32204C25.9568 1.39653 33.9959 3.98177 32.3759 13.7268Z" fill="#979797" stroke="#979797" strokeWidth="1.20295" strokeLinecap="round" />
    </g>
  </svg>
);

const LogoRow = ({ clients, direction = "left", speed = 35 }) => {
  const doubled = [...clients, ...clients];
  return (
    <div className="logo-row-wrapper">
      <div className="logo-fade-left" />
      <div className="logo-fade-right" />
      <div
        className={`logo-track logo-track--${direction}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((client, index) => (
          <div key={`${client.name}-${index}`} className="logo-item">
            <img
              src={client.logo}
              alt={client.name}
              className="logo-img"
              title={client.name}
              style={client.scale ? { transform: `scale(${client.scale})` } : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Company = () => {
  return (
    <section className="clients2-section">
      <div className="clients2-heading-wrap">
        <span className="clients2-label">TOP RECRUITERS</span>
        <h2 className="clients2-title">Our Students Working With</h2>
      </div>

      <div className="clients2-carousel-wrap">
        <div className="laurel-left">
          <LaurelLeft />
        </div>

        <div className="clients2-rows">
          <LogoRow clients={rowOne} direction="left" speed={35} />
        </div>

        <div className="laurel-right">
          <LaurelRight />
        </div>
      </div>
    </section>
  );
};

export default Company;