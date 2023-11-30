import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Fab,
  Toolbar,
  Typography,
} from "@mui/material";
import { QrCodeScanner, Stop } from "@mui/icons-material";
import QrScanner from "qr-scanner";
import React, { useState } from "react";
import logo from "./logo.png";

let stopScan = false;
let hasilScan = "";

function App() {
  const [btnScan, setBtnScan] = useState(true);

  const scanNow = async (isScan) => {
    setBtnScan(isScan);
    if (isScan) stopScan = true;
    if (btnScan === false) return;
    stopScan = false;
    await new Promise((r) => setTimeout(r, 100));
    const videoElement = document.getElementById("scanView");
    const scanner = new QrScanner(
      videoElement,
      (result) => {
        hasilScan = result.data;
        setBtnScan(true);
        stopScan = true;
      },
      {
        onDecodeError: (error) => {
          console.error(error);
        },
        maxScansPerSecond: 1,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      }
    );
    await scanner.start();
    while (stopScan === false) await new Promise((r) => setTimeout(r, 100));
    scanner.stop();
    scanner.destroy();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff", 
      },
      secondary: {
        main: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <img
              src={logo}
              style={{
                width: "80px",
                height: "auto",
              }}
              alt="Logo"
            />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            paddingTop: "64px",
          }}
        >
          {btnScan === false && (
            <video
              id="scanView"
              style={{
                width: "100%",
                height: "100%",
                borderStyle: "dotted",
              }}
            ></video>
          )}
          {btnScan && (
            <Typography variant="h6" style={{ marginTop: "50px" }}>
              Hasil Scan:
              <br />
              {hasilScan}
            </Typography>
          )}
        </Box>
        <Fab
          color={btnScan ? "primary" : "secondary"}
          onClick={() => scanNow(!btnScan)}
          sx={{ position: "absolute", bottom: 16, right: 16 }}
        >
          {btnScan && <QrCodeScanner />}
          {btnScan === false && <Stop />}
        </Fab>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
