import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import RegionForm from "../createForm/RegionForm";
import { Grow, Slide } from "@mui/material";
import WorkerForm from "../createForm/WorkerForm";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CreateDialog({
  title,
  isDialogOpen,
  handleDialogClose,
  path,
}) {
  const [close, setClose] = React.useState();

  const handleClose = () => {
    handleDialogClose();
    setClose(!close);
  };

  return (
    <React.Fragment>
      <Grow
        in={isDialogOpen}
        style={{ transformOrigin: "0 30 70" }}
        {...(isDialogOpen ? { timeout: 1000 } : {})}
      >
        <BootstrapDialog onClose={handleClose} keepMounted open={isDialogOpen}>
          <DialogTitle
            sx={{
              padding: "10px 16px",
              backgroundColor: "#5d87ff",
              border: "3px solid",
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "15px",
              color: "white",
            }}
          >
            {title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: "red",
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {path === "/region" ? (
              <RegionForm close={close} handleDialogClose={handleDialogClose} />
            ) : path === "/worker" ? (
              <WorkerForm close={close} handleDialogClose={handleDialogClose} />
            ) : (
              <Typography gutterBottom>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros.
              </Typography>
            )}
          </DialogContent>
        </BootstrapDialog>
      </Grow>
    </React.Fragment>
  );
}
