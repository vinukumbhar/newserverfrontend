import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
const Insights = () => {

  // jobs count
  const [jobCount, setJobCount] = useState(null);
  const [activeJobCount, setActiveJobCount] = useState(null);
  const [inactiveJobCount, setInactiveJobCount] = useState(null);
  useEffect(() => {
    // Fetch job count from API
    axios.get("http://127.0.0.1/workflow/jobs/jobscount")
      .then((response) => {
        setJobCount(response.data.count); // Assuming API returns { count: <job count> }
      })
      .catch((error) => {
        console.error("Error fetching job count:", error);
      });

       // Fetch count of active jobs
    axios.get("http://127.0.0.1/workflow/jobs/activejobcounts")
    .then((response) => {
      setActiveJobCount(response.data.count);
    })
    .catch((error) => {
      console.error("Error fetching active job count:", error);
    });

  // Fetch count of inactive jobs
  axios.get("http://127.0.0.1/workflow/jobs/inactivejobcounts")
    .then((response) => {
      setInactiveJobCount(response.data.count);
    })
    .catch((error) => {
      console.error("Error fetching inactive job count:", error);
    });
  }, []);
  return (
    <Box sx={{ padding: 2 }}>
     <Box>
      <Typography gutterBottom variant="h5" component="div">
        Jobs Details
      </Typography>
      <Box mt={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Total Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{jobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Active Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{activeJobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Archived Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{inactiveJobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      </Box>
      <Box mt={3}>
      <Typography gutterBottom variant="h5" component="div">
        Invoices Details
      </Typography>
      <Box mt={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Total Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Pending Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Paid Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </Box>
  );
};

export default Insights;
