import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, CircularProgress, Tooltip, alpha, useTheme } from "@mui/material";
import { uniq } from "lodash";
import DataFrame from "./DataFrame";

const ModelViewer = (props) => {
  const { data, showDimensions, dimensionsSelector, showHotspots, setReady: propagateReady, interactive, mobile, disableExternalLinks } = props;

  const theme = useTheme();

  /** Model is ready loading... */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    propagateReady(ready)
  }, [ready, propagateReady])

  /** */
  const [src, setSrc] = useState();

  /** Select node */
  const [selected, select] = useState();

  /**  */
  const dataframe = useRef();

  /** Define corners & sides for dimenstions */
  const dimensions = useMemo(() => {
    const corners = [
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, 1],
      [-1, 1, -1],
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, -1],
      [1, -1, 1],
    ].map((position) => {
      const [x, y, z] = position;
      return {
        name: `hotspot-${x < 0 ? "L" : "R"}${y < 0 ? "B" : "T"}${z < 0 ? "F" : "B"
          }`,
        position,
      };
    });
    const sides = uniq(
      corners
        .map(({ name: pName }) => {
          const pCode = pName.split("-")[1].split("");
          const connections = corners.map(({ name: cName }) => {
            const cCode = cName.split("-")[1].split("");
            const overlap = pCode.reduce(
              (prev, cur, i, a) => prev + (cur === cCode[i] ? 1 : 0),
              0
            );
            if (overlap === 2) {
              return [pCode.join(""), cCode.join("")].sort().join("-");
            }
            return undefined;
          });
          return connections;
        })
        .flat()
        .filter((n) => n)
    ).map((pointString) => {
      const [a, b] = pointString
        .split("-")
        .map(
          (str) => corners.filter(({ name }) => name === `hotspot-${str}`)[0]
        );
      const position = a.position.map((n, i) => (n + b.position[i]) * 0.5);
      return { pointString, position, name: `hotspot-${pointString}` };
    });
    return { corners, sides };
  }, []);

  /** Model load handler */
  useEffect(() => {
    setReady(false);
    setSrc();
    if (data) {
      /** Force src update (development) */
      setSrc(data.model.src + `?${Math.random()}`);

      const ModelViewerElement = customElements.get("model-viewer");
      ModelViewerElement.dracoDecoderLocation = "/static/draco/";

      const modelViewer = document.querySelector("model-viewer");

      /** Add material for beetle */
      const updateMaterials = () => {
        try {
          const [material] = modelViewer.model.materials;
          material.pbrMetallicRoughness.setBaseColorFactor("#444");
          material.pbrMetallicRoughness.setMetallicFactor(1);
          material.pbrMetallicRoughness.setRoughnessFactor(0.6);
        } catch (e) {
          /** */
        }
      };

      const onload = (e) => {

        console.log('ModelViewer.LOAD', e)

        updateMaterials();

        /** Update dimensions */
        const center = modelViewer.getBoundingBoxCenter();
        const size = modelViewer.getDimensions();
        const x2 = size.x / 2;
        const y2 = size.y / 2;
        const z2 = size.z / 2;
        dimensions.corners.forEach((corner) => {
          const {
            name,
            position: [x, y, z],
          } = corner;
          modelViewer.updateHotspot({
            name: name,
            position: `${center.x + x2 * x} ${center.y + y2 * y} ${center.z + z2 * z
              }`,
          });
        });

        dimensions.sides.forEach((side) => {
          const {
            name,
            position: [x, y, z],
          } = side;
          modelViewer.updateHotspot({
            name: name,
            position: `${center.x + x2 * x} ${center.y + y2 * y} ${center.z + z2 * z
              }`,
          });
        });

        setReady(true);
      };


      const onError = (e) => {
        console.log('ModelViewer.ERROR', e)
      }

      modelViewer.addEventListener("load", onload);
      modelViewer.addEventListener("error", onError);
      updateMaterials();
    }
  }, [data, dimensions]);

  /** Update dimension lines */
  useEffect(() => {
    let animationFrame;
    const updateDimensionLinesAndLabels = () => {
      const modelViewer = document.querySelector("model-viewer");
      const lines = modelViewer?.querySelectorAll("line.side");

      if (modelViewer) {
        const { theta, phi } = modelViewer.getCameraOrbit();

        let thetaN = theta % (Math.PI * 2);
        while (thetaN < 0) thetaN += Math.PI * 2;

        lines?.forEach((line) => {
          const pointString = line.getAttribute("data-points"),
            points = pointString.split("-");
          const fromElement = modelViewer.querySelector(
            `[slot="hotspot-${points[0]}"]`
          ),
            toElement = modelViewer.querySelector(
              `[slot="hotspot-${points[1]}"]`
            ),
            labelElement = modelViewer.querySelector(
              `[slot="hotspot-${pointString}"]`
            );

          let opacity = 1,
            [x1, y1, z1] = points[0].split(""),
            [x2, y2, z2] = points[1].split("");
          if (phi < Math.PI * 0.5) {
            if (y1 === "B" && y2 === "B") opacity = 0;
          } else {
            if (y1 === "T" && y2 === "T") opacity = 0;
          }

          if (thetaN < Math.PI) {
            if (x1 === "L" && x2 === "L") opacity = 0;
          } else {
            if (x1 === "R" && x2 === "R") opacity = 0;
          }

          if (thetaN < Math.PI * 0.5 || thetaN > Math.PI * 1.5) {
            if (z1 === "F" && z2 === "F") opacity = 0;
          } else {
            if (z1 === "B" && z2 === "B") opacity = 0;
          }

          if (fromElement && toElement) {
            const fromBounds = fromElement.getBoundingClientRect(),
              toBounds = toElement.getBoundingClientRect();

            line.setAttribute("x1", fromBounds.x);
            line.setAttribute("y1", fromBounds.y);
            line.setAttribute("x2", toBounds.x);
            line.setAttribute("y2", toBounds.y);
            line.setAttribute("opacity", opacity);

            labelElement.style.opacity = opacity;
          }
        });
      }
      animationFrame = requestAnimationFrame(updateDimensionLinesAndLabels);
    };

    if (showDimensions) {
      animationFrame = requestAnimationFrame(updateDimensionLinesAndLabels);
      select()
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [showDimensions, select]);



  /**
   * Update hotspot lines & content
   *
   * */
  useEffect(() => {
    const modelViewer = document.querySelector("model-viewer");
    if (!modelViewer) return;
    window.modelViewer = modelViewer;

    const container = modelViewer.getBoundingClientRect();
    const hotspotElement = modelViewer.querySelector(
      `[slot="hotspot-${selected}"]`
    );
    const line = modelViewer.querySelector("line.hotspot");

    const updateBorderStyle = (highlight) => {
      ["Top", "Right", "Bottom", "Left"].forEach((side) => {
        dataframe.current.style[`border${side}Style`] =
          side.toLowerCase() === highlight ? "solid" : "none";
      });
    };

    let animationFrame;
    const updateDataFramePosition = () => {
      const frame = dataframe.current.getBoundingClientRect();
      const hotspot = hotspotElement.getBoundingClientRect();
      const opacity = window
        .getComputedStyle(hotspotElement)
        .getPropertyValue("opacity");

      let cx = hotspot.x + hotspot.width * 0.5 - container.x,
        cy = hotspot.y + hotspot.height * 0.5 - container.y;

      const padding = {
        top: 75,
        left: 20,
        right: 20,
        bottom: (container.height - frame.height) * 0.5,
      },
        distance = 300;

      /** Position infobox */
      let bx = cx - distance - frame.width;

      if (cx < frame.width + padding.left + padding.right) bx = cx + distance;
      bx = Math.max(bx, padding.left);
      bx = Math.min(bx, container.width - padding.right - frame.width);

      let by = cy - frame.height * 0.5;
      by = Math.max(by, padding.top);
      by = Math.min(by, container.height - padding.bottom - frame.height);

      dataframe.current.style.left = 0;
      dataframe.current.style.top = 0;
      dataframe.current.style.transform = `translate(${bx}px, ${by}px)`;

      /** Get updated frame position */
      const nframe = dataframe.current.getBoundingClientRect();

      let tx = nframe.x - container.x + nframe.width * 0.5,
        ty = nframe.y - container.y + nframe.height * 0.5;

      if (cy < nframe.top - container.y - distance) {
        ty = nframe.top - container.y;
        updateBorderStyle("top");
      } else if (cy > nframe.bottom - container.y + distance) {
        ty = nframe.bottom - container.y;
        updateBorderStyle("bottom");
      } else {
        if (cx < tx) {
          tx -= nframe.width * 0.5;
          updateBorderStyle("left");
        } else {
          tx += nframe.width * 0.5;
          updateBorderStyle("right");
        }
      }

      /** Update hotspot line-start */
      const a = Math.atan2(cy - ty, cx - tx);
      cx = cx - Math.cos(a) * hotspot.width * 0.5;
      cy = cy + Math.sin(-a) * hotspot.width * 0.5;

      //dataframe.current.style.opacity = opacity

      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", tx);
      line.setAttribute("y2", ty);
      line.setAttribute("opacity", opacity);

      animationFrame = requestAnimationFrame(updateDataFramePosition);
    };

    if (selected && !mobile) {
      
      animationFrame = requestAnimationFrame(updateDataFramePosition);
    } else {
      dataframe.current.style.transform = `translate(-50%, -50%)`;
      dataframe.current.style.left = '50%';
      dataframe.current.style.top = '50%';
      
      
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [selected, dataframe, theme, data, mobile]);

  const resetCamera = useCallback(() => {
    if (data) {
      setCameraTarget("auto auto auto");
      setFieldOfView(data.model.fieldOfView);
      setCameraOrbit(data.model.cameraOrbit);
    }
  }, [data]);

  const [hasPrompted, setHasPrompted] = useState(false)

  useEffect(() => {

    const modelViewer = document.querySelector("model-viewer");
    if (!modelViewer) return;

    let animationFrame;
    const updateAutoRotation = () => {

      const current = modelViewer.cameraOrbit.split(' ')
      current[0] = parseFloat(current[0]) - 0.2 + 'deg'
      modelViewer.cameraOrbit = current.join(' ')

      animationFrame = requestAnimationFrame(updateAutoRotation);
    }

    resetCamera()
    if (interactive) {
      modelViewer.resetInteractionPrompt();

      /** Prompt duration is about 5s, allow max 3 prompts */
      setTimeout( () => 
      setHasPrompted(true), 3 * 5 * 1000 )
    } else {
      select()
      animationFrame = requestAnimationFrame(updateAutoRotation);
    }

    return () => cancelAnimationFrame(animationFrame)

  }, [interactive, resetCamera])

  

  const createOnClickTimer = (fn, maxClickTime = 80) => {
    return (e) => {
      const time = Date.now();
      const onPointerUp = () => {
        window.removeEventListener("pointerup", onPointerUp);
        const delta = Date.now() - time;
        //console.log({ delta });
        if (delta < maxClickTime) fn();
      };
      window.addEventListener("pointerup", onPointerUp);
    };
  };

  const setCameraOrbit = (cameraOrbit) => {
    const modelViewer = document.querySelector("model-viewer");
    if (!modelViewer) return;
    modelViewer.cameraOrbit = cameraOrbit;
  };

  const setFieldOfView = (fieldOfView) => {
    const modelViewer = document.querySelector("model-viewer");
    if (!modelViewer) return;
    modelViewer.fieldOfView = fieldOfView;
  };

  const setCameraTarget = (cameraTarget) => {
    const modelViewer = document.querySelector("model-viewer");
    if (!modelViewer) return;
    modelViewer.cameraTarget = cameraTarget;
  };



  useEffect(() => {
    if (!selected) resetCamera();
  }, [resetCamera, selected]);



  const traceCameraSettings = () => {
    // const modelViewer = document.querySelector("model-viewer");
    // console.log(JSON.stringify({
    //   cameraTarget: modelViewer.getCameraTarget().toString(),
    //   cameraOrbit: modelViewer.getCameraOrbit().toString(),
    //   fieldOfView: modelViewer.getFieldOfView().toString() + 'deg',
    // }));
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",

        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        "& model-viewer": {
          opacity: ready ? 1 : 0,

          position: "absolute",
          width: "100%",
          height: "100%",
          "& div.corner": {
            width: 0,
            height: 0,
          },
          "& div.hotspot": {
            width: "2em",
            height: "2em",
            borderRadius: "1em",
            cursor: "pointer",
            pointerEvents: selected || !showHotspots ? "none" : "all",

            border: (theme) => `1px solid ${theme.extra.modelHightlightColor}`,
            "--min-hotspot-opacity": 0.15,

            backgroundColor: (theme) =>
              alpha(theme.extra.modelHightlightColor, 0.2),
            transition: "background-color 0.3s, opacity 0.3s",
            "&:hover": {
              backgroundColor: (theme) =>
                alpha(theme.extra.modelHightlightColor, 0.5),
            },
            '&[data-current="false"]': {
              opacity: selected || !showHotspots ? 0 : undefined,
            },
            '&[data-current="true"]': {
              border: "none",
              backgroundColor: (theme) => theme.palette.primary.main,
              opacity: selected ? undefined : 0,
            },
          },
          "& div.sideLabel": {
            pointerEvents: "none",
            transition: "opacity 0.5s",
            bgcolor: "background.default",
            p: 0.5,
            ...(showDimensions ? {} : { opacity: "0 !important" }),
          },
          "& svg": {
            pointerEvents: "none",

            "& line.hotspot": {
              strokeLinecap: "round",
              stroke: theme.palette.primary.main,
              strokeWidth: 2,
              display: selected ? "block" : "none",
              ...(selected ? {} : { opacity: "0" }),
            },
            "& line.side": {
              transition: "opacity 0.5s",
              strokeLinecap: "round",
              stroke: theme.extra.modelDimensionsAxisColor,
              strokeWidth: 1,
              strokeDasharray: 5,
              ...(showDimensions ? {} : { opacity: "0 !important" }),
            },
          },
        },
      }}
      
      onPointerDown={
        selected
          ? () => {
            setHasPrompted(true)
            createOnClickTimer(() => {
              traceCameraSettings()
              select();
            })()
          }
          : traceCameraSettings
      }
    >
      {data && (
        <>
          <model-viewer
            {...(interactive ? {
              "camera-controls": true,
              "interaction-prompt": hasPrompted ? 'none' :  "auto",

            } : {
              //"auto-rotate":true,
              "interaction-prompt": "none",
              //"auto-rotate-delay":0
            })}

            disable-tap
            src={src}
            camera-orbit={data.model.cameraOrbit}
            field-of-view={data.model.fieldOfView}

          //camera-controls={interactive ? true : false}
          //interaction-prompt={ interactive ? "auto" : "none"}
          //auto-rotate={!interactive }
          //skybox-image="./static/skybox/skybox.hdr.jpg"
          >
            {
              /** Dimensions: Corners */
              dimensions.corners.map(({ name, position }) => {
                return (
                  <Box
                    key={name}
                    className="corner"
                    slot={name}
                    data-normal="0 0 0"
                  />
                );
              })
            }
            {
              /** Dimensions: Sides */
              dimensions.sides.map(({ name, position }) => {
                const measure =
                  position[0] === 0
                    ? "width"
                    : position[1] === 0
                      ? "height"
                      : "length";
                return (
                  <Box
                    key={name}
                    className="sideLabel"
                    slot={name}
                    data-normal="0 0 0"
                  >
                    {data.model.dimensions[dimensionsSelector][measure]}  {data.model.dimensions[dimensionsSelector].unit}
                    {/* Original: {data.model.dimensions[measure] / 200} cm */}
                  </Box>
                );
              })
            }
            {
              /** Hotspots */
              Object.keys(data.model.hotspots).map((key) => {
                return (
                  <Tooltip key={key} title={data.model.hotspots[key].title}>
                    <Box
                      className="hotspot"
                      slot={`hotspot-${key}`}
                      data-current={key === selected}
                      data-visibility-attribute="visible"
                      data-position={data.model.hotspots[key].position}
                      data-normal={data.model.hotspots[key].normal}
                      onClick={(e) => {
                        select(key);
                      }}
                    />
                  </Tooltip>
                );
              })
            }
            {/** SVG Overlay for lines */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {
                /** Add dimension lines */
                dimensions.sides.map(({ name, pointString }) => {
                  return (
                    <line
                      key={`line-${name}`}
                      data-points={pointString}
                      className="side"
                    />
                  );
                })
              }

              {/** Line to the current hotspot */}
              { !mobile && <line className="hotspot" /> }
            </svg>




          </model-viewer>
          <DataFrame
            ref={dataframe}
            mobile={mobile}
            onClose={select}
            data={data.model.hotspots[selected]}
            setCameraOrbit={setCameraOrbit}
            setCameraTarget={setCameraTarget}
            setFieldOfView={setFieldOfView}
            strings={data.strings}
            disableExternalLinks={disableExternalLinks}
          /></>
      )}


      {!ready && <CircularProgress size={60} thickness={3} />}
    </Box>
  );
};

export default ModelViewer;
