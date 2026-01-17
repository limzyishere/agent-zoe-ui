import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function AppShell({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Property CRM
          </Typography>

          <Button color="inherit" component={Link} to="/contacts">
            Contacts
          </Button>

          <Button color="inherit" component={Link} to="/messages">
            Messages
          </Button>

          <Button color="inherit" component={Link} to="/templates">
            Templates
          </Button>

          <Button color="inherit" component={Link} to="/jobs">
            Jobs
          </Button>



          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

   <Box sx={{ p: 3, width: "100%" }}>
  {children}
</Box>
    </>
  );
}
