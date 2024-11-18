import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserStats from "./UserStats";

const Home = () => {
  const { user, isAuthenticated, setIsAuthenticated, setUser } =
    useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [audienceCriteria, setAudienceCriteria] = useState({
    minSpending: "",
    maxSpending: "",
    minVisits: "",
    maxVisits: "",
  });
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // "success", "error", etc.
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    console.log(isAuthenticated);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
    } else {
      navigate("/"); // Redirect to login if user is not authenticated
    }
  }, [isAuthenticated, user]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/campaigns/${user.userId}`
      );
      setCampaigns(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !audienceCriteria || !user.userId) return;
    setCreatingCampaign(true);
    try {
      let queryCriteria = {};
      if (audienceCriteria.minSpending || audienceCriteria.maxSpending) {
        queryCriteria.totalSpending = {};
        if (audienceCriteria.minSpending) {
          queryCriteria.totalSpending.$gte = audienceCriteria.minSpending;
        }
        if (audienceCriteria.maxSpending) {
          queryCriteria.totalSpending.$lte = audienceCriteria.maxSpending;
        }
      }

      if (audienceCriteria.minVisits || audienceCriteria.maxVisits) {
        queryCriteria.visits = {};
        if (audienceCriteria.minVisits) {
          queryCriteria.visits.$gte = audienceCriteria.minVisits;
        }
        if (audienceCriteria.maxVisits) {
          queryCriteria.visits.$lte = audienceCriteria.maxVisits;
        }
      }

      await axios.post("http://localhost:3000/api/campaigns", {
        name: campaignName,
        description: campaignDescription,
        audienceCriteria: queryCriteria,
        userId: user.userId,
      });

      fetchCampaigns(); // Refresh campaigns after creation
      setCampaignName("");
      setCampaignDescription("");
      setAudienceCriteria({
        minSpending: "",
        maxSpending: "",
        minVisits: "",
        maxVisits: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setCreatingCampaign(false);
    }
  };

  const logoutCall = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/logout");
      console.log(response);
      setIsAuthenticated(false); // Update the authentication state to false
      setUser(null);
      navigate("/"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleLogout = () => {
    logoutCall();
  };

  const formatAudienceCriteria = (criteria) => {
    const formatted = [];

    if (criteria.age) {
      formatted.push(`Age: ${criteria.age.min} to ${criteria.age.max} years`);
    }
    if (criteria.location) {
      formatted.push(`Location: ${criteria.location}`);
    }
    if (criteria.totalSpending) {
      formatted.push(
        `Spending: ${criteria.totalSpending.$gte || "No lower limit"} to ${
          criteria.totalSpending.$lte || "No upper limit"
        }`
      );
    }
    if (criteria.visits) {
      formatted.push(
        `Visits: ${criteria.visits.$gte || "No lower limit"} to ${
          criteria.visits.$lte || "No upper Limit"
        }`
      );
    }

    return formatted.join(", ");
  };

  const handleSendMessage = async () => {
    if (!messageContent || !selectedCampaign) return;

    setSendingMessage(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/send-messages/${selectedCampaign._id}/${user.userId}`,
        {
          message: messageContent,
        }
      );

      console.log(response.data);

      // Show success alert
      setAlertMessage(
        `Message : "${response.data.message}", Sent to : ${response.data.summary.sent} customers, Failed to send to ${response.data.summary.failed} , Total : ${response.data.summary.totalCustomers} `
      );
      setAlertSeverity("success");
      setAlertOpen(true);

      setMessageContent("");
      setOpenMessageDialog(false);
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error alert
      setAlertMessage(
        error.response?.data?.message || "Failed to send the message."
      );
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Container sx={{ marginTop: 3 }}>
        <h2>Welcome to the dashboard</h2>
        <div>
          <h3>Your Previous Campaigns:</h3>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              {campaigns.length === 0 ? (
                <p>No campaigns found</p>
              ) : (
                <ul>
                  {campaigns.map((campaign) => (
                    <li key={campaign._id}>
                      <strong>{campaign.name}</strong>
                      <p>{campaign.description}</p>
                      <p>{formatAudienceCriteria(campaign.audienceCriteria)}</p>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setOpenMessageDialog(true);
                        }}
                      >
                        Send Message
                      </Button>
                      {/* Send Message Dialog */}
                      <Dialog
                        open={openMessageDialog}
                        onClose={() => setOpenMessageDialog(false)}
                      >
                        <DialogTitle>Send Message</DialogTitle>
                        <DialogContent>
                          <TextField
                            label="Message Content"
                            fullWidth
                            multiline
                            rows={4}
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            disabled={sendingMessage}
                            sx={{ marginBottom: 2 }}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenMessageDialog(false)}
                            disabled={sendingMessage}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSendMessage(campaign._id)}
                            color="primary"
                            disabled={sendingMessage || !messageContent}
                          >
                            {sendingMessage ? "Sending..." : "Send"}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create New Campaign
        </Button>

        {/* Create Campaign Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogContent>
            <TextField
              label="Campaign Name"
              fullWidth
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              disabled={creatingCampaign}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              disabled={creatingCampaign}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Min Spending"
              fullWidth
              type="number"
              value={audienceCriteria.minSpending}
              onChange={(e) =>
                setAudienceCriteria({
                  ...audienceCriteria,
                  minSpending: e.target.value,
                })
              }
              disabled={creatingCampaign}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Max Spending"
              fullWidth
              type="number"
              value={audienceCriteria.maxSpending}
              onChange={(e) =>
                setAudienceCriteria({
                  ...audienceCriteria,
                  maxSpending: e.target.value,
                })
              }
              disabled={creatingCampaign}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Min Visits"
              fullWidth
              type="number"
              value={audienceCriteria.minVisits}
              onChange={(e) =>
                setAudienceCriteria({
                  ...audienceCriteria,
                  minVisits: e.target.value,
                })
              }
              disabled={creatingCampaign}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Max Visits"
              fullWidth
              type="number"
              value={audienceCriteria.maxVisits}
              onChange={(e) =>
                setAudienceCriteria({
                  ...audienceCriteria,
                  maxVisits: e.target.value,
                })
              }
              disabled={creatingCampaign}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              disabled={creatingCampaign}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              color="primary"
              disabled={creatingCampaign || !campaignName || !audienceCriteria}
            >
              {creatingCampaign ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Alert */}
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000} // Closes after 6 seconds
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            margin: "20px", // Adds margin around the box
            padding: "20px", // Adds padding inside the box
            
            top: "20px", // Distance from the top of the viewport
            right: "20px", // Distance from the right of the viewport
            zIndex: 1000, // Ensures it stays on top of other elements
            boxShadow: 3, // Adds a shadow for better visibility
            backgroundColor: "white", // Background color to make it stand out
            borderRadius: "8px", // Rounded corners
            width: "auto", // Let it resize based on content
          }}
        >
          <UserStats userId={user}/>
        </Box>
      </Container>
    </>
  );
};

export default Home;
