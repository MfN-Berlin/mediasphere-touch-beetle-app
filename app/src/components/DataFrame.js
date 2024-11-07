import {
  Typography,
  Box,
  IconButton,
  alpha,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Link,
  CircularProgress,
  Portal,
  Backdrop,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import WaveSurferComponent from "./WaveSurferComponent";
import AutoScrollContainer from "./AutoScrollContainer";
import { DataContext } from "../DataProvider";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Carousel from "react-material-ui-carousel";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const DataFrame = forwardRef((props, ref) => {
  const {
    mobile,
    strings,
    data,
    onClose,
    setCameraOrbit,
    setFieldOfView,
    setCameraTarget,
    sx,
    disableExternalLinks,
  } = props;

  /** Jump between nodes */
  const [node, setNode] = useState();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (data) {
      setIndex(0);
    } else {
      setNode();
    }
  }, [data]);

  const next = useCallback(() => {
    setIndex((p) => p + 1);
  }, []);

  const prev = useCallback(() => {
    setIndex((p) => Math.max(0, p - 1));
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
    setNode();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (data) {
      if (data.nodes[index]) {
        setNode(data.nodes[index]);
      }
    }
  }, [index, data, reset]);

  // useEffect(() => {
  //     console.log({ data, index, node })
  // }, [data, index, node])

  useEffect(() => {
    if (node) {
      if (node.cameraTarget) setCameraTarget(node.cameraTarget);
      if (node.fieldOfView) setFieldOfView(node.fieldOfView);
      if (node.cameraOrbit) setCameraOrbit(node.cameraOrbit);
    }
  }, [node, setCameraOrbit, setFieldOfView, setCameraTarget]);

  const wavesurfer = useRef();

  const { autoScroll, setAutoScroll, audioAutoplay, setAudioAutoplay } =
    useContext(DataContext);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const onAudioEnded = useCallback(() => next(), [next]);
  const onPlayPause = useCallback((_isPlaying) => setIsPlaying(_isPlaying), []);

  const [wavesurferHoverX, setWavesurferHoverX] = useState(0);
  const [waversureferReady, setWavesurferReady] = useState(false);
  const updateWSX = useCallback((e) => {
    if (!e) return;
    const b = e.target.getBoundingClientRect();
    setWavesurferHoverX(e.clientX - b.x - b.width * 0.5);
  }, []);

  if (!data || !node) return <Box ref={ref} />;
  //console.log( Boolean(node.audio) && autoScroll && isPlaying, Boolean(node.audio), autoScroll, isPlaying)

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: (theme) =>
          alpha(theme.palette.background.paper, mobile ? 1 : 0.7),
        position: "absolute",
        boxSizing: "border-box",

        zIndex: 200,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        height: "auto",
        maxHeight: mobile
          ? "calc(100% - 150px)"
          : node?.gallery
          ? "min( 800px, 80vh)"
          : "min( 500px, 70%)",

        width: "auto", //mobile ? 'calc(100% - 25px)' : 400,
        maxWidth: mobile
          ? "calc(100% - 40px)"
          : node?.gallery
          ? "min( 800px, 90vw )"
          : "min( 400px, calc( 60% - 40px ) )",
        transition: "max-width .35s, max-height .35s",

        //transition: 'transform 0.3s',
        //pointerEvents: 'none',
        display: "flex",
        flexDirection: "column",
        borderColor: (theme) => theme.palette.primary.main,
        borderWidth: 1,

        ...sx,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/** header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          mb: 2,
          mt: 3,
          mr: 1,
          ml: 4,
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ display: "inline-block" }}>
          {data.title}
        </Typography>
        <Tooltip title={strings.close}>
          <IconButton
            sx={{
              color: "text.primary",
              ml: "auto",
              mt: -1,
              pointerEvents: "all",
            }}
            size="small"
            onClick={() => onClose()}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/** Images */}
      {/* {node?.image && <Box sx={{
            background: `url(./static/img/${node.image})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            height: 300,
            mb: 0,
            //flexShrink:0
        }} />} */}

      {/** Autoscrolling text */}

      <AutoScrollContainer
        on={Boolean(node.audio) && autoScroll && isPlaying}
        relativeScrollY={
          Boolean(node.audio) && autoScroll && isPlaying
            ? audioProgress
            : -index
        }
      >
        <Typography
          component={Box}
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            px: 4,
            py: node.gallery ? 0 : 2,
            color: "text.secondary",
            "& .current": { color: "text.primary" },
            "& img": { maxWidth: "100%", my: 1, display: "block" },
            "& p": { m: 0 },
          }}
        >
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => (
                <span>
                  <Tooltip
                    placement="top"
                    title={
                      (props.title || "") +
                      (disableExternalLinks ? "\n" + strings?.linkDisabled : "")
                    }
                  >
                    <Link
                      {...props}
                      title={undefined}
                      {...(disableExternalLinks ? { href: null } : {})}
                    />
                  </Tooltip>
                </span>
              ),
              p: "div",
              figcaption: ({ node, ...props }) => (
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: -1, mb: 1 }}
                  {...props}
                />
              ),
              startbutton: ({ node, ...props }) => (
                <Box sx={{ my: 4, display: "flex" }}>
                  <Tooltip title={strings?.startHotspots}>
                    <IconButton
                      size="large"
                      onClick={() => onClose()}
                      sx={{
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "primary.dark" },
                        color: "white",
                        mx: "auto",
                        boxShadow: "none",
                      }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            }}
          >
            {node.text}
          </ReactMarkdown>
        </Typography>
        {/* {index < data.nodes.length - 1 && <Button variant="contained" onClick={next}>Next</Button>} */}
      </AutoScrollContainer>

      {node.gallery && (
        <Box sx={{ mx: 4, overflowX: "hidden" }}>
          {/** Stretcher */}
          <Box sx={{ width: "100vw" }} />

          {/** Carousel */}
          <Carousel
            height="100%"
            changeOnFirstRender
            sx={{
              width: "100%",
              aspectRatio: 1.5,
              overflowX: "clip",
              overflowY: "visible",
            }}
            navButtonsAlwaysVisible
            animation="slide"
            fullHeightHover
          >
            {node.gallery.map((props, i) => {
              const { src, caption } = props;
              return (
                <Box
                  key={`ci-${i}`}
                  sx={{
                    //bgcolor:"red",
                    display: "block",
                    width: "100%",
                    aspectRatio: 1.5,
                    position: "relative",
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "text.primary",
                      bgcolor: (theme) =>
                        alpha(theme.palette.background.paper, 0.5),
                      pb: 0.5,
                      pt: 1,
                      px: 1,
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                    }}
                  >
                    {caption}
                  </Typography>
                </Box>
              );
            })}
          </Carousel>
        </Box>
      )}

      {node?.audio && (
        <>
          {/** Waveform */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              mx: 4,
            }}
          >
            <Tooltip
              placement="top"
              PopperProps={{
                sx: {
                  ml: wavesurferHoverX + "px !important",
                  transition: "padding-left 0.25s",
                },
                left: 200,
              }}
              title={waversureferReady ? strings.setAudioPlayhead : ""}
            >
              <Box sx={{ flexGrow: 1 }} onMouseMove={updateWSX}>
                <WaveSurferComponent
                  ref={wavesurfer}
                  url={`./audio/${node.audio}`}
                  onAudioEnded={onAudioEnded}
                  onAudioProgress={setAudioProgress}
                  onPlayPause={onPlayPause}
                  autoplay={audioAutoplay}
                  onReady={(ready) => setWavesurferReady(ready)}
                />
              </Box>
            </Tooltip>
            {waversureferReady ? (
              <Tooltip title={strings[isPlaying ? "pause" : "play"]}>
                <IconButton
                  size="large"
                  onClick={() => {
                    //console.log(wavesurfer)
                    if (wavesurfer.current.isPlaying()) {
                      wavesurfer.current.pause();
                    } else {
                      wavesurfer.current.play();
                    }
                  }}
                  sx={{
                    ml: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Tooltip>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </>
      )}

      {(node?.audio || data?.nodes.length > 1) && (
        <>
          {/** Autoscroll UI */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              px: 3,
              mt: mobile || node?.image || !node?.audio ? 1 : 6,
              mb: mobile || node?.image || !node?.audio ? 1 : 2,
              "& > button": {
                pointerEvents: "all",
                boxShadow: "none",
                //color:'white',
                transform: "scale(75%)",

                // bgcolor: "transparent",
                // color: 'primary.main',
                // '& > svg': { fontSize: '2rem' },
                // '&:hover': {
                //     //bgcolor:'primary.light'
                // }
              },
            }}
          >
            <Tooltip title={strings.prevPage}>
              <Fab
                size="small"
                sx={{
                  flexShrink: 0,
                  visibility: index > 0 ? "visible" : "hidden",
                }}
                onClick={prev}
              >
                <NavigateBeforeIcon />
              </Fab>
            </Tooltip>

            {node.audio ? (
              <>
                <Tooltip title={strings.autoscrollTooltip}>
                  <FormControlLabel
                    sx={{ ml: "auto" }}
                    labelPlacement="end"
                    size="small"
                    slotProps={{
                      typography: {
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      },
                    }}
                    control={
                      <Checkbox
                        size="small"
                        sx={{ pr: 0.25 }}
                        checked={autoScroll}
                        onChange={(e) => {
                          setAutoScroll(e.target.checked);
                        }}
                      />
                    }
                    label={strings.autoscroll}
                  />
                </Tooltip>

                <Tooltip title={strings.autoplayTooltip}>
                  <FormControlLabel
                    sx={{ mr: "auto" }}
                    labelPlacement="end"
                    size="small"
                    slotProps={{
                      typography: {
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      },
                    }}
                    control={
                      <Checkbox
                        size="small"
                        sx={{ pr: 0.25 }}
                        checked={audioAutoplay}
                        onChange={(e) => {
                          setAudioAutoplay(!audioAutoplay);
                        }}
                      />
                    }
                    label={strings.autoplay}
                  />
                </Tooltip>
              </>
            ) : (
              <Box sx={{ mx: "auto" }} />
            )}

            <Tooltip title={strings.nextPage}>
              <Fab
                size="small"
                sx={{
                  flexShrink: 0,
                  visibility:
                    index < data.nodes.length - 1 ? "visible" : "hidden",
                }}
                onClick={next}
              >
                <NavigateNextIcon />
              </Fab>
            </Tooltip>
          </Box>

          {data.nodes.length > 1 && (
            <Box sx={{ pb: 1, textAlign: "center" }}>
              <Typography color="text.secondary" variant="caption">
                {strings.page} {index + 1}/{data.nodes.length}
              </Typography>
            </Box>
          )}
        </>
      )}

      <Portal container={document.body}>
        <Backdrop open={mobile} sx={{ zIndex: 99 }} onClick={() => onClose()} />
      </Portal>
    </Box>
  );
});

DataFrame.displayName = "DataFrame";

DataFrame.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
  setCameraOrbit: PropTypes.func,
  setFieldOfView: PropTypes.func,
  setCameraTarget: PropTypes.func,
  sx: PropTypes.object,
  mobile: PropTypes.bool,
};

DataFrame.defaultProps = {
  title: "Hello",
  description: "World",
  onClose: () => {},
  setCameraOrbit: () => {},
  setFieldOfView: () => {},
  setCameraTarget: () => {},
  sx: {},
};

export default DataFrame;
