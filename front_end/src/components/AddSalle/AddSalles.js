import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSalle } from "../../JS/actions/salleActions";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Helmet } from "react-helmet-async";

const theme = createTheme();

function AddSalles() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const user = userData.user;
  const [name, setName] = React.useState("");
  const [userId, setUserId] = React.useState(user._id);
  const [size, setSize] = React.useState("");
  const [localisation, setLocalisation] = React.useState("");
  const [prix, setPrix] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [previewImages, setPreviewImages] = React.useState([]);

  console.log(localisation);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    const selectedFileArray = Array.from(files);
    setImages(selectedFileArray);
    const imagePreviewArray = selectedFileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviewArray);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();

    // Add text data
    data.append("name", name);
    data.append("user", userId);
    data.append("roomSize", size);
    data.append("roomLocalisation", localisation);
    data.append("roomPrice", prix);
    data.append("roomDescription", description);

    // Append files
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      data.append("files", image); // Append each file individually
    }
    console.log(data);

    dispatch(addSalle(data, navigate));
  };

  return (
    <>
      <Helmet>
        <title>Take Book Salle | Add Salle</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Salle
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Salle name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                type="number"
                min="1"
                fullWidth
                id="size"
                label="Number of places"
                name="roomSize"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                type="text"
                fullWidth
                id="localisation"
                label="Localistion"
                name="roomLocalisation"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                type="number"
                fullWidth
                id="prix"
                label="Prix"
                name="roomPrice"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
              <TextareaAutosize
                minRows={3} // Adjust the number of rows as needed
                maxRows={10} // Set a maximum number of rows if desired
                placeholder="Description"
                id="description"
                name="roomDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', marginBottom: '16px' }} // Adjust styling as needed
              />


              <div>
                {previewImages.map((preview, index) => (
                  <span key={index}>
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ width: "100px", height: "80px", marginRight: "10px" }}
                    />
                  </span>
                ))}
              </div>
              <input
                accept="image/*"
                id="images"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                name="file"
              />
              <label htmlFor="images">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                >
                  Select Images
                </Button>
              </label>

              <Button
                disabled={
                  !name ||
                  !userId ||
                  !size ||
                  !localisation ||
                  !prix ||
                  !description ||
                  images.length === 0
                }
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
              >
                Add Salle
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default AddSalles;