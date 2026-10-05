import { useId } from "react";
import "./gems-button.css";

function GemsArt() {
  const uid = useId().replace(/:/g, "");
  const plusGlow = `gemsPlusGlow-${uid}`;
  const specTex = `gemsSpecTex-${uid}`;
  const plusStroke = `gemsPlusStroke-${uid}`;
  const rim = `gemsRim-${uid}`;

  return (
    <svg
      className="gems-art"
      viewBox="15.4004 15.3999 42 42"
      width="52"
      height="52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={plusGlow}
          x="28.6832"
          y="28.7266"
          width="15.4412"
          height="15.6467"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.2" />
          <feGaussianBlur stdDeviation="0.05" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.13 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter
          id={specTex}
          x="35.0535"
          y="8.79766"
          width="30.5736"
          height="33.4052"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5.15" result="effect1_foregroundBlur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5 0.5" numOctaves="3" seed="6985" />
          <feDisplacementMap
            in="effect1_foregroundBlur"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedImage"
            width="100%"
            height="100%"
          />
          <feMerge result="effect2_texture">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <linearGradient
          id={plusStroke}
          x1="36.4711"
          y1="36.4349"
          x2="36.4711"
          y2="38.8265"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.235828" stopColor="white" />
          <stop offset="0.0376415" stopColor="white" stopOpacity="0.159614" />
          <stop offset="1" stopColor="white" stopOpacity="0.159614" />
        </linearGradient>
        <linearGradient
          id={rim}
          x1="50.6912"
          y1="22.454"
          x2="22.6626"
          y2="51.747"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4F4F4" />
          <stop offset="0.287772" stopColor="#F4F4F4" stopOpacity="0" />
          <stop offset="0.689458" stopColor="#F4F4F4" stopOpacity="0" />
          <stop offset="1" stopColor="#F4F4F4" />
        </linearGradient>
      </defs>
      <g filter={`url(#${plusGlow})`}>
        <path
          d="M35.2092 42.8075V37.764C35.2092 37.6536 35.1197 37.564 35.0092 37.564H30.0749C29.4164 37.564 28.8828 37.0426 28.8828 36.3992C28.8829 35.7558 29.4165 35.2343 30.0749 35.2343H35.0092C35.1197 35.2343 35.2092 35.1448 35.2092 35.0343V29.9915C35.2092 29.3481 35.7429 28.8268 36.4013 28.8267C37.0599 28.8267 37.5935 29.3481 37.5935 29.9915V35.0343C37.5935 35.1448 37.683 35.2343 37.7935 35.2343L42.7309 35.2343C43.3893 35.2343 43.924 35.7558 43.9241 36.3992C43.9241 37.0426 43.3894 37.564 42.7309 37.564L37.7935 37.564C37.683 37.564 37.5935 37.6536 37.5935 37.764V42.8075C37.5935 43.451 37.0599 43.9735 36.4013 43.9735C35.7429 43.9733 35.2092 43.4509 35.2092 42.8075Z"
          fill="black"
          fillOpacity="0.26"
        />
        <path
          d="M36.4014 28.7769C37.0864 28.7769 37.6436 29.3196 37.6436 29.9917V35.0347C37.6437 35.1174 37.7112 35.1841 37.7939 35.1841H42.7305C43.4153 35.1841 43.9734 35.7269 43.9736 36.3989C43.9736 37.0711 43.4154 37.6138 42.7305 37.6138H37.7939C37.7111 37.6138 37.6436 37.6813 37.6436 37.7642V42.8071C37.6436 43.4792 37.0865 44.0239 36.4014 44.0239C35.7164 44.0238 35.1592 43.4792 35.1592 42.8071V37.7642C35.1592 37.6813 35.0916 37.6138 35.0088 37.6138H30.0752C29.3902 37.6138 28.833 37.0711 28.833 36.3989C28.8333 35.727 29.3903 35.1841 30.0752 35.1841H35.0088C35.0915 35.1841 35.159 35.1174 35.1592 35.0347V29.9917C35.1592 29.3196 35.7165 28.777 36.4014 28.7769Z"
          stroke={`url(#${plusStroke})`}
          strokeOpacity="0.6"
          strokeWidth="0.1"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M35.3506 42.6997V37.4497H30.1006C29.5207 37.4497 29.0508 36.9798 29.0508 36.3999C29.0509 35.8201 29.5208 35.3501 30.1006 35.3501H35.3506V30.1001C35.3506 29.5203 35.8206 29.0504 36.4004 29.0503C36.9803 29.0503 37.4502 29.5202 37.4502 30.1001V35.3501H42.7002C43.28 35.3501 43.7509 35.8201 43.751 36.3999C43.751 36.9798 43.2801 37.4497 42.7002 37.4497H37.4502V42.6997C37.4502 43.2796 36.9803 43.7505 36.4004 43.7505C35.8206 43.7504 35.3506 43.2795 35.3506 42.6997Z"
        fill="white"
      />
      <g filter={`url(#${specTex})`}>
        <ellipse
          cx="2.37523"
          cy="7.75803"
          rx="2.37523"
          ry="7.75803"
          transform="matrix(-0.804819 0.59352 0.59352 0.804819 47.6475 17.8467)"
          fill="white"
          fillOpacity="0.67"
        />
      </g>
      <rect
        x="15.9004"
        y="15.8999"
        width="41"
        height="41"
        rx="20.5"
        stroke={`url(#${rim})`}
        strokeOpacity="0.77"
        fill="none"
      />
    </svg>
  );
}

export function GemsButton({ onClick, ...rest }) {
  return (
    <button
      type="button"
      className="gems-btn"
      aria-label="Add"
      data-gems=""
      onClick={onClick}
      {...rest}
    >
      <span className="gems-face">
        <GemsArt />
      </span>
    </button>
  );
}

export function GemsButtonPreview() {
  return (
    <div className="gems-root" data-gems="">
      <GemsButton />
    </div>
  );
}

export default GemsButton;
