import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class LoadingCubes extends React.PureComponent {
  static propTypes = {
    middle: PropTypes.bool,
  };

  static defaultProps = {
    middle: true
  };

  /**
   * @returns {*}
   */
  render() {
    const { middle } = this.props;

    const classes = classNames('loading-cube', {
      'middle': middle
    });

    return (
      <div className={classes}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            WebkitAnimationPlayState: "running",
            animationPlayState:       "running",
            WebkitAnimationDelay:     "0s",
            animationDelay:           "0s",
            background:               "none"
          }}
          className="lds-gooeyring"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 100 100"
        >
          <defs
            style={{
              WebkitAnimationPlayState: "running",
              animationPlayState:       "running",
              WebkitAnimationDelay:     "0s",
              animationDelay:           "0s"
            }}
          >
            <filter
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
              id="a"
              width="300%"
              height="300%"
              x="-100%"
              y="-100%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                in="SourceGraphic"
                stdDeviation="4"
              />
              <feComponentTransfer
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                result="cutoff"
              >
                <feFuncA intercept="-5" slope="10" type="linear"/>
              </feComponentTransfer>
            </filter>
          </defs>
          <g
            style={{
              WebkitAnimationPlayState: "running",
              animationPlayState:       "running",
              WebkitAnimationDelay:     "0s",
              animationDelay:           "0s"
            }}
            filter="url(#a)"
            transform="translate(50 50)"
          >
            <g
              transform="rotate(80.968)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="9.599"
                fill="#fff"
              >
                <animate
                  attributeName="r"
                  begin="-10s"
                  dur="10s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="0s"
                dur="10s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(233.936)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="9.997"
                fill="#f4f226"
              >
                <animate
                  attributeName="r"
                  begin="-9s"
                  dur="5s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-1s"
                dur="5s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(98.903)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="7.196"
                fill="#00dfff"
              >
                <animate
                  attributeName="r"
                  begin="-8s"
                  dur="3.3333333333333335s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-2s"
                dur="3.3333333333333335s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(35.871)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="10.806"
                fill="#42ce74"
              >
                <animate
                  attributeName="r"
                  begin="-7s"
                  dur="2.5s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-3s"
                dur="2.5s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(44.84)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="7.993"
                fill="#e10175"
              >
                <animate
                  attributeName="r"
                  begin="-6s"
                  dur="2s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-4s"
                dur="2s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(125.807)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="11.591"
                fill="#fff"
              >
                <animate
                  attributeName="r"
                  begin="-5s"
                  dur="1.6666666666666667s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-5s"
                dur="1.6666666666666667s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(278.775)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="11.99"
                fill="#f4f226"
              >
                <animate
                  attributeName="r"
                  begin="-4s"
                  dur="1.4285714285714286s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-6s"
                dur="1.4285714285714286s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(143.743)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="9.189"
                fill="#00dfff"
              >
                <animate
                  attributeName="r"
                  begin="-3s"
                  dur="1.25s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-7s"
                dur="1.25s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(80.71)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="8.813"
                fill="#42ce74"
              >
                <animate
                  attributeName="r"
                  begin="-2s"
                  dur="1.1111111111111112s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-8s"
                dur="1.1111111111111112s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
            <g
              transform="rotate(89.678)"
              style={{
                WebkitAnimationPlayState: "running",
                animationPlayState:       "running",
                WebkitAnimationDelay:     "0s",
                animationDelay:           "0s"
              }}
            >
              <circle
                style={{
                  WebkitAnimationPlayState: "running",
                  animationPlayState:       "running",
                  WebkitAnimationDelay:     "0s",
                  animationDelay:           "0s"
                }}
                cx="30"
                r="9.986"
                fill="#e10175"
              >
                <animate
                  attributeName="r"
                  begin="-1s"
                  dur="1s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="6;14;6"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                begin="-9s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;360"
              />
            </g>
          </g>
        </svg>
      </div>
    );
  }
}
