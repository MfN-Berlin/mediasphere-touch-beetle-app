import React, { useCallback, useContext, useEffect, useState } from "react";
import ModelViewer from "./components/ModelViewer";
import { ReactSVG } from "react-svg";
import {
  Box,
  Divider,
  Fab,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { DataContext } from "./DataProvider";

import ViewInArIcon from "@mui/icons-material/ViewInAr";
import CircleIcon from "@mui/icons-material/Circle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";

import DataFrame from "./components/DataFrame";
import { get } from "lodash";

function App() {
  const disableExternalLinks = !new URLSearchParams(window.location.search).has(
    "enableExternalLinks"
  );

  /** Load data.json */
  const [data, setData] = useState();
  const [ready, setReady] = useState(false);

  /** Enable autoplay */
  const [hasStarted, setHasStarted] = useState(false);
  const [infoFrameId, setInfoFrameId] = useState();

  /**  */
  const mobile = useMediaQuery("(max-width:600px) or (max-height:600px)");
  // useEffect(() => {
  //   console.log({ mobile })
  // }, [mobile])

  useEffect(() => {
    setData();
    fetch("./data.autotranslated.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((e) => {
        setData();
      });
  }, []);

  // Use browserlang as default
  const [language, setLanguage] = useState(
    (navigator.language || navigator.userLanguage).split("-")[0]
  );
  const getString = useCallback(
    (key, path = "strings") => {
      if (!data) return "";
      const address = `${path}.${key}.${language}`;
      const value = get(data, address);
      if (typeof value !== "string")
        console.warn("Missing or invalid translation: " + address);
      return value;
    },
    [data, language]
  );

  useEffect(() => {
    if (data) {
      if (!Object.keys(data.languages).includes(language)) setLanguage("de");
    }
  }, [data, language]);

  useEffect(() => {
    document.title = getString("documentTitle");
  }, [getString]);

  const [showDimensions, setShowDimensions] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [showModelDimensions, setShowModelDimensions] = useState(false);
  const [modelInteractive, setModelInteractive] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (infoFrameId) setHistory((prev) => [...prev, infoFrameId]);
    if (hasStarted && !infoFrameId) {
      setModelInteractive(true);
    } else if (!hasStarted && infoFrameId) {
      setHasStarted(true);
    } else if (hasStarted && infoFrameId) {
      setModelInteractive(false);
    }
  }, [hasStarted, infoFrameId]);

  useEffect(() => {
    if (modelInteractive && !showHotspots && !showDimensions) {
      setShowHotspots(true);
    } else if (!modelInteractive && (showHotspots || showDimensions)) {
      if (showHotspots) setShowHotspots(false);
      if (showDimensions) setShowDimensions(false);
    }
  }, [modelInteractive, showHotspots, showDimensions]);

  const { toggleTheme, theme: themeId } = useContext(DataContext);

  const [menuAnchor, setMenuAnchor] = useState();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/** Header */}
      <Box
        component={"header"}
        sx={{
          py: 2,
          px: "25px",
          width: "100%",
          //overflow:'hidden',
          zIndex: 10,
          position: "absolute",
          display: "flex",
          gap: 1,
          alignItems: "flex-start",

          flexWrap: "wrap",
          "& button": {
            ":hover": {
              color: (theme) => theme.palette.primary.light,
            },
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            flexShrink: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            mt: "5px",
          }}
        >
          {getString("title")}
        </Typography>

        <Box sx={{ ml: "auto" }}>
          {/** Dimensions toggle */}
          {(() => {
            const btn = (
              <Box display={"inline-block"}>
                <IconButton
                  disabled={!modelInteractive}
                  size="small"
                  sx={{
                    color: showDimensions ? "primary.main" : "text.secondary",
                  }}
                  onClick={() => {
                    setShowHotspots(false);
                    setShowDimensions(true);
                  }}
                >
                  <ViewInArIcon />
                </IconButton>
              </Box>
            );
            if (showDimensions) {
              return (
                <Tooltip
                  key="dimensions-tooltip-showing"
                  open={!Boolean(menuAnchor)}
                  title={
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{}} variant="body1">
                          {getString("dimensions")}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ cursor: "pointer" }}
                          onClick={() => setShowModelDimensions(false)}
                        >
                          {getString("original")}
                        </Typography>
                        <Switch
                          checked={showModelDimensions}
                          onChange={(e) =>
                            setShowModelDimensions(e.currentTarget.checked)
                          }
                          sx={{
                            "& .MuiSwitch-track": {
                              bgcolor: "primary.main",
                            },
                            "& .MuiSwitch-switchBase": {
                              color: "primary.main",
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ cursor: "pointer" }}
                          onClick={() => setShowModelDimensions(true)}
                        >
                          {getString("model")}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          title={getString("close")}
                          onClick={() => {
                            setShowHotspots(true);
                            setShowDimensions(false);
                          }}
                          size="small"
                          sx={{ color: "text.primary", m: -0.5, ml: 1 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                >
                  {btn}
                </Tooltip>
              );
            } else {
              return (
                <Tooltip
                  key="dimensions-tooltip-default"
                  title={getString("showDimensions")}
                >
                  {btn}
                </Tooltip>
              );
            }
          })()}

          {/** Hotspots toggle */}
          <Tooltip title={getString("showHotspots")}>
            <Box display={"inline-block"}>
              <IconButton
                disabled={!modelInteractive}
                size="small"
                sx={{ color: showHotspots ? "primary.main" : "text.secondary" }}
                onClick={() => {
                  setShowHotspots(true);
                  setShowDimensions(false);
                }}
              >
                <CircleIcon />
              </IconButton>
            </Box>
          </Tooltip>

          {/** Theme toggle */}
          <Tooltip
            title={getString(`theme${themeId === "dark" ? "Light" : "Dark"}`)}
          >
            <IconButton
              size="small"
              sx={{ color: "text.secondary" }}
              onClick={toggleTheme}
            >
              {themeId === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Divider
            component="span"
            sx={{
              mx: 1,
              bgcolor: themeId === "dark" ? alpha("#fff", 0.5) : undefined,
            }}
            orientation="vertical"
          />

          <Tooltip title={getString("mainMenu")}>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                mr: 1,
              }}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            disableScrollLock
            slotProps={{
              paper: { square: true, sx: { mt: 1.8, maxWidth: 300 } },
            }}
            elevation={1}
            marginThreshold={35}
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor()}
          >
            {data &&
              ready &&
              Object.keys(data.languages).length > 1 &&
              Object.keys(data.languages)
                .map((lang, index ) => {
                  return (
                    <MenuItem
                      key={`menuitem-language-${lang}`}
                      onClick={() => setLanguage(lang)}
                      sx={{
                        color: lang === language ? theme => theme.palette.primary.main : "text.secondary",
                        //textDecoration:(lang === language ? 'underline' : 'none') ,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:'text.secondary',
                          visibility:index === 0 ? 'visible' : 'hidden'
                        }}
                        fontSize="small"
                      >
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText>{data.languages[lang]}</ListItemText>
                    </MenuItem>
                  );
                })
                .concat([<Divider key="divider" />])}

            {data &&
              ready &&
              Object.keys(data.info)
                .sort((a, b) => data.info[a].index > data.info[b].index)
                .map((id, i) => {
                  return (
                    <MenuItem
                      key={`menuitem-${i}`}
                      disabled={id === infoFrameId}
                      onClick={() => {
                        setInfoFrameId(id);
                        setMenuAnchor();
                      }}
                    >
                      <ListItemIcon
                        sx={{ color: "text.secondary" }}
                        fontSize="small"
                      >
                        {{
                          aboutIntro: <InfoIcon />,
                          aboutAmulet: <BugReportIcon />,
                          aboutCreature: <SchoolIcon />,
                          aboutProject: <HelpIcon />,
                        }[id] || <ChevronRightIcon />}
                      </ListItemIcon>
                      <ListItemText
                        color="text.primary"
                        primary={getString("title", `info.${id}`)}
                      />
                    </MenuItem>
                  );
                })}
            {data &&
              ready &&
              !disableExternalLinks && [
                <Divider key="divider" />,
                <MenuItem
                  key="item"
                  component={Link}
                  href={getString("searchUrl")}
                >
                  <ListItemIcon
                    sx={{ color: "text.secondary", alignSelf: "flex-start" }}
                    fontSize="small"
                  >
                    {" "}
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      "& .MuiListItemText-secondary": {
                        whiteSpace: "break-spaces",
                      },
                    }}
                    color="text.primary"
                    primary={getString("searchPrimaryText")}
                    secondary={getString("searchSecondaryText")}
                  />
                </MenuItem>,
              ]}
          </Menu>
        </Box>
      </Box>

      {/** Model */}
      {data && (
        <ModelViewer
          data={data}
          getString={getString}
          showDimensions={showDimensions}
          dimensionsSelector={showModelDimensions ? "model" : "original"}
          showHotspots={showHotspots}
          setReady={setReady}
          interactive={modelInteractive}
          mobile={mobile}
          disableExternalLinks={disableExternalLinks}
        />
      )}

      {/** Footer */}
      <Box
        component={"footer"}
        sx={{
          position: "absolute",
          bottom: 0,
          zIndex: 10,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          gap: "2rem",
          padding: "1rem",
          alignItems: "center",
          boxSizing: "border-box",
          justifyContent: "center",
          flexWrap: "wrap",
          "& > a, div": {
            height: "calc( 75px - 2rem )",
            display: "flex",
            alignItems: "center",
            "& div": {
              height: "100%",
            },
            "& > div > div ": {
              "& > svg": {
                width: "auto",
                height: "100%",
                fill: (theme) => theme.palette.text.secondary,
                "&:hover": {
                  fill: (theme) => theme.palette.text.primary,
                },
              },
            },
          },
        }}
      >
        <Tooltip title="Museum für Naturkunde Berlin">
          <Link
            component={disableExternalLinks ? "div" : undefined}
            target="_blank"
            href="https://www.museumfuernaturkunde.berlin"
          >
            <ReactSVG
              alt="Museum für Naturkunde Berlin logo"
              src="./logo/mfn.svg"
            />
          </Link>
        </Tooltip>

        {!disableExternalLinks && (
          <Tooltip title={"Datenportal, Museum für Naturkunde Berlin"}>
            <Link
              component={disableExternalLinks ? "div" : undefined}
              target="_blank"
              href="https://portal.museumfuernaturkunde.berlin/"
            >
              <ReactSVG
                alt="Datenportal logo"
                src="./logo/dataportal.svg"
                style={{ height: "80%" }}
              />
            </Link>
          </Tooltip>
        )}

        <Tooltip title="werk5">
          <Link
            component={disableExternalLinks ? "div" : undefined}
            target="_blank"
            href="https://werk5.com/"
          >
            <ReactSVG
              alt="Werk 5 logo"
              src="./logo/werk5.svg"
              style={{ height: "65%" }}
            />
          </Link>
        </Tooltip>
      </Box>

      {/** Start Button */}
      {ready && !hasStarted && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* <Button variant='contained' onClick={() => {
            setHasStarted(true);
            setInfoFrameId('aboutCreature')
          }}  >{getString("start}</Button> */}
          <Tooltip placement="top" title={getString("start")}>
            <Fab
              color="primary"
              size="large"
              sx={{
                p: 8,
                color: "white",
                "& svg": {
                  fontSize: "5rem",
                },
              }}
              onClick={() => {
                setHasStarted(true);
                setInfoFrameId("aboutIntro");
              }}
            >
              <PlayArrowIcon />
            </Fab>
          </Tooltip>
        </Box>
      )}

      {/** Model-independent info frame */}
      {data && infoFrameId && ready && (
        <DataFrame
          disableExternalLinks={disableExternalLinks}
          mobile={mobile}
          getString={getString}
          getStringPath={`info.${infoFrameId}`}
          data={data.info[infoFrameId]}
          onClose={() =>
            setInfoFrameId(
              history.includes("aboutCreature") ? undefined : "aboutCreature"
            )
          }
        />
      )}
    </Box>
  );
}

export default App;
