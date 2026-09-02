import React, { useState } from "react";
import "./arjun-social-buttons.css";

const SOCIAL_ITEMS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    baseRot: -3,
    hoverRot: 3,
    delay: "0ms",
    viewBox: "0 0 1024 1024",
    path: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434a68.8 68.8 0 1 1 68.8-68.8c-.1 38-30.9 68.8-68.8 68.8zm503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z",
  },
  {
    id: "github",
    label: "GitHub",
    baseRot: 3,
    hoverRot: -3,
    delay: "40ms",
    viewBox: "0 0 1024 1024",
    path: "M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z",
  },
  {
    id: "email",
    label: "Email",
    baseRot: -3,
    hoverRot: 3,
    delay: "80ms",
    viewBox: "0 0 1024 1024",
    path: "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-80.8 108.9L531.7 514.4c-7.8 6.1-18.7 6.1-26.5 0L189.6 268.9A7.2 7.2 0 0 1 194 256h648.8a7.2 7.2 0 0 1 4.4 12.9z",
  },
  {
    id: "twitter",
    label: "Twitter",
    baseRot: 3,
    hoverRot: -3,
    delay: "120ms",
    viewBox: "0 0 512 512",
    path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
  },
];

export function ArjunSocialButtons({ onSelect }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedId, setClickedId] = useState(null);

  return (
    <div className="as-cluster" role="group" aria-label="Social links">
      {SOCIAL_ITEMS.map((item, index) => {
        let translateX = 0;
        let scale = 1;
        let rot = item.baseRot;
        let counterRot = 0;

        if (hoveredIndex !== null) {
          if (hoveredIndex === index) {
            scale = 1.28;
            rot = item.hoverRot;
            counterRot = -item.hoverRot;
          } else if (index < hoveredIndex) {
            translateX = hoveredIndex - index === 1 ? -6 : -3;
          } else if (index > hoveredIndex) {
            translateX = index - hoveredIndex === 1 ? 6 : 3;
          }
        }

        const transformStyle = `translateX(${translateX}px) rotate(${rot}deg) scale(${scale})`;

        return (
          <button
            key={item.id}
            type="button"
            className="as-stamp-btn"
            aria-label={item.label}
            style={{
              transform: transformStyle,
              zIndex: hoveredIndex === index ? 10 : 1,
              "--as-delay": item.delay,
              "--as-base-rot": `rotate(${item.baseRot}deg)`,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onClick={(e) => {
              e.preventDefault();
              setClickedId(item.id);
              if (onSelect) onSelect(item.id);
            }}
          >
            <span className="as-ring" aria-hidden="true" />
            <svg
              viewBox={item.viewBox}
              className="as-icon"
              aria-hidden="true"
              style={{
                transform: `rotate(${counterRot}deg)`,
              }}
            >
              <path d={item.path} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ArjunSocialButtonsPreview() {
  return (
    <div className="arjun-social-root" data-arjun-social>
      <ArjunSocialButtons />
    </div>
  );
}

export default ArjunSocialButtons;
