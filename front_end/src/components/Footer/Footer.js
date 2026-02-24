import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Divider,
    Link as MuiLink
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./Footer.css";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#111",
                color: "#fff",
                mt: "auto",
                pt: 6,
                pb: 3,
                position: "relative",
                width: "100%",
                bottom: 0
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>

                    {/* LOGO / DESCRIPTION */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            mb: 2,
                            justifyContent: { xs: "center", md: "flex-start" }
                        }}>
                            <img 
                                src="/logo.png" 
                                alt="BookSalle Logo" 
                                style={{ 
                                    height: 50, 
                                    marginRight: 12 
                                }} 
                            />
                            <Typography variant="h5" fontWeight="bold">
                                BookSalle
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="gray" fontWeight="bold">
                            Book salle easily and efficiently.
                            Modern solution for professionals.
                        </Typography>
                    </Grid>

                    {/* QUICK LINKS */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom className="itm1" fontWeight="bold">
                            Quick Links
                        </Typography>
                        <Box sx={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: 1,
                            alignItems: { xs: "center", md: "flex-start" }
                        }}>
                            <MuiLink href="/" color="inherit" underline="hover" >
                                Home
                            </MuiLink>
                            <MuiLink href="/calendar" color="inherit" underline="hover">
                                Calendar
                            </MuiLink>
                            {!localStorage.getItem("token") && (
                                <>
                                    <MuiLink href="/login" color="inherit" underline="hover">
                                        Login
                                    </MuiLink>
                                    <MuiLink href="/register" color="inherit" underline="hover">
                                        Register
                                    </MuiLink>
                                </>
                            )}

                        </Box>
                    </Grid>

                    {/* SOCIAL */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Follow Us
                        </Typography>
                        <Box>
                            <IconButton color="inherit">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton color="inherit">
                                <InstagramIcon />
                            </IconButton>
                            <IconButton color="inherit">
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton color="inherit">
                                <TwitterIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#333" }} />

                {/* COPYRIGHT */}
                <Typography
                    variant="body2"
                    align="center"
                    color="gray"
                    fontWeight="bold"
                >
                    © {new Date().getFullYear()} BookSalle. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
