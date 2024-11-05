import React from "react";
import { Box } from "@mui/material";

export function customPrompt(viewer) {
    const PROMT_MS = 5000;
    const REPEAT_MS = 8000;

    const finger0 = {
        x: {
            initialValue: 0.6,
            keyframes: [
                { frames: 1, value: 0.7 },
                { frames: 1, value: 0.5 },
                { frames: 1, value: 0.7 },
                { frames: 1, value: 0.6 }
            ]
        },
        y: {
            initialValue: 0.45,
            keyframes: [
                { frames: 1, value: 0.4 },
                { frames: 1, value: 0.3 },
                { frames: 1, value: 0.4 },
                { frames: 1, value: 0.45 }
            ]
        }
    };

    const finger1 = {
        x: {
            initialValue: 0.4,
            keyframes: [
                { frames: 1, value: 0.3 },
                { frames: 1, value: 0.1 },
                { frames: 1, value: 0.3 },
                { frames: 1, value: 0.4 }
            ]
        },
        y: {
            initialValue: 0.55,
            keyframes: [
                { frames: 1, value: 0.6 },
                { frames: 1, value: 0.5 },
                { frames: 1, value: 0.6 },
                { frames: 1, value: 0.55 }
            ]
        }
    };

    let hasInteracted = false;

    const prompt = () => {
        if (!hasInteracted) {
            viewer.interact(PROMT_MS, finger0, finger1);
            setTimeout(prompt, REPEAT_MS);
        }
    };

    viewer.addEventListener(
        "poster-dismissed",
        () => {
            prompt();
        },
        { once: true }
    );

    const interacted = event => {
        if (event.detail.source === "user-interaction") {
            hasInteracted = true;
            viewer.removeEventListener("camera-change", interacted);
        }
    };

    viewer.addEventListener("camera-change", interacted);

    const sx = {
        display: "block",
        position: "absolute",
        width: "1rem",
        height: "1rem",
        transform: "translateX(-50%) translateY(-50%)",
        borderRadius: "50%",
        //boxShadow: "0px 0px 10px 3px #fffb, 0px 0px 5px 1px #fff3",
        border: "0.5px solid #000", //theme => `1px solid ${theme.palette.background.default}`,
        bgcolor: "#ccc7"
    };

    return (
        <>
            <Box sx={sx} slot="finger0"></Box>
            <Box sx={sx} slot="finger1"></Box>
        </>
    );
}
