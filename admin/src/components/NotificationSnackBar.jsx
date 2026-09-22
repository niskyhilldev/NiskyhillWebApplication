import { Snackbar, Alert, Portal } from "@mui/material";


{/**This component is a very basic use of the Snackbar component from MUI. 
  Open determins when the snackbar will appear
  message it what it will say
  severity determins its color (error- red, success- green, warning- orange, info- white)
  onclose is what happens when it closes (typically setting a state to null)

  Portal is used to remove the bar from the DOM so that it can render above dialogs (like lotadd)
  The zindex is also set to an absurd value so that it is never overidden
*/}
function NotificationSnackbar({
  open,
  message,
  severity = "info",
  onClose,
}) {
  return (
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          zIndex: 99999,
        }}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Portal>
  );
}

export default NotificationSnackbar;