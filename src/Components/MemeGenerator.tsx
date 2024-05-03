import { Box, Button, TextField, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import "./MemeGenerator.css";
interface Meme {
  id: string;
  name: string;
  url: string;
  height: number;
  captions: number;
  box_count: number;
}

interface IState {
  textTop: string;
  textBottom: string;
  textTopColor: Boolean;
  textBottomColor: Boolean;
  uploadedImg: string | null;
  memes: Meme[];
}
const MemeGenerator = () => {
  const [textTop, setTextTop] = useState<IState["textTop"]>("");
  const [textBottom, setTextBottom] = useState<IState["textBottom"]>("");
  const [textTopColor, setTextTopColor] =
    useState<IState["textTopColor"]>(true);
  const [textBottomColor, setTextBottomColor] =
    useState<IState["textBottomColor"]>(true);
  const [uploadedImg, setUploadedImg] = useState<IState["uploadedImg"]>(null);
  const [memes, setMemes] = useState<IState["memes"]>([]);
  const memeContainerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    if (memeContainerRef.current) {
      html2canvas(memeContainerRef.current, { useCORS: true }).then(
        (canvas) => {
          const dataURL = canvas.toDataURL();
          const a = document.createElement("a");
          a.href = dataURL;
          a.download = "meme.jpg";
          a.click();
        }
      );
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImg(imageUrl);
    }
  };

  const uploadButtonContent = () => {
    return (
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          onChange={handleImageChange}
          ref={imageInputRef}
          accept="image/*"
          hidden
        />
      </Button>
    );
  };

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        setMemes(data.data.memes);
      } catch (error) {
        console.log("Error fetching memes:", error);
      }
    };
    fetchMemes();
  }, []);

  const handleMemeClick = (meme: Meme) => {
    setUploadedImg(meme.url);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 3,
        justifyContent: "center",
        padding: "30px",
      }}
    >
      {uploadedImg ? (
        <Box>
          <Box className="img-text-block" ref={memeContainerRef}>
            <Box className="img-width">
              <Box component="img" src={uploadedImg} alt="spong"></Box>
            </Box>
            <Box className="text-on-img">
              <Typography
                variant="body1"
                className="text-top"
                sx={{ color: `${textTopColor ? "black" : "white"}` }}
              >
                {textTop}
              </Typography>
              <Typography
                variant="body1"
                className="text-bottom"
                sx={{ color: `${textBottomColor ? "black" : "white"}` }}
              >
                {textBottom}
              </Typography>
            </Box>
          </Box>
          {uploadButtonContent()}
        </Box>
      ) : (
        <Box
          sx={{
            border: "2px dotted grey",
            width: "400px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "2px",
          }}
        >
          {uploadButtonContent()}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "30px",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "200px", md: "500px" },
            overflowX: "scroll",
            visibility: "scroll",
          }}
        >
          {memes.slice(0, 10).map((meme) => (
            <Box
              key={meme.url}
              sx={{ width: "50px", height: "50px" }}
              onClick={() => handleMemeClick(meme)}
            >
              <img
                src={meme.url}
                alt={meme.url}
                style={{ width: "50px", height: "50px" }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            value={textTop}
            label="Top Text"
            onChange={(event) => setTextTop(event.target.value)}
            sx={{ width: "280px", fontSize: "5px!important" }}
          />
          <Box
            className="color-box"
            sx={{ background: `${textTopColor ? "black" : "white"}` }}
            onClick={() => setTextTopColor(!textTopColor)}
          ></Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            value={textBottom}
            label="Bottom Text"
            onChange={(event) => setTextBottom(event.target.value)}
            sx={{ width: "280px", fontSize: "5px!important" }}
          />
          <Box
            className="color-box"
            sx={{ background: `${textBottomColor ? "black" : "white"}` }}
            onClick={() => setTextBottomColor(!textBottomColor)}
          ></Box>
        </Box>
        <Button
          color="primary"
          variant="contained"
          sx={{ width: "40%" }}
          onClick={handleDownload}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
};

export default MemeGenerator;
