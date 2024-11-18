import React, { useState, useEffect, useContext } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const UserStats = () => {
  const { user, isAuthenticated, setIsAuthenticated, setUser } =
    useContext(AuthContext);
  const [stats, setStats] = useState({
    uniqueCampaigns: 0,
    sentMessages: 0,
    failedMessages: 0,
    customersSentMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [user, isAuthenticated]); // Fetch logs whenever userId changes

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/logs/${user.userId}`
      );
      const logs = response.data.logs;

      // Process the logs to calculate stats
      const uniqueCampaigns = new Set(logs.map((log) => log.campaignId)).size;
      const sentMessages = logs.filter((log) => log.status === "SENT").length;
      const failedMessages = logs.filter(
        (log) => log.status === "FAILED"
      ).length;
      const customersSentMessages = new Set(logs.map((log) => log.customerId))
        .size;

      setStats({
        uniqueCampaigns,
        sentMessages,
        failedMessages,
        customersSentMessages,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Early return if userId is not available
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Container sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Statistics
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3, // Spacing between items
            justifyContent: "space-between",
          }}
        >
          {/* Unique Campaigns */}
          <Box sx={{ flex: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Unique Campaigns</Typography>
              <Typography variant="h4">{stats.uniqueCampaigns}</Typography>
            </Paper>
          </Box>

          {/* Sent Messages */}
          <Box sx={{ flex: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Sent Messages</Typography>
              <Typography variant="h4" sx={{ color: "green" }}>
                {stats.sentMessages}
              </Typography>
            </Paper>
          </Box>

          {/* Failed Messages */}
          <Box sx={{ flex: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Failed Messages</Typography>
              <Typography variant="h4" sx={{ color: "red" }}>
                {stats.failedMessages}
              </Typography>
            </Paper>
          </Box>

          {/* Customers Sent Messages */}
          <Box sx={{ flex: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Customers Reached</Typography>
              <Typography variant="h4">
                {stats.customersSentMessages}
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default UserStats;
