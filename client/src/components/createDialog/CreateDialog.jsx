import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import RegionForm from "../createForm/RegionForm";
import { Slide } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CreateDialog({
  title,
  isDialogOpen,
  handleDialogClose,
  path,
}) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleDialogClose}
        TransitionComponent={Transition}
        keepMounted
        open={isDialogOpen}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            background: "linear-gradient(135deg, #6253e1, #04befe)",
            border:'3px solid',
            borderTopRightRadius:'20px',
            borderTopLeftRadius:'20px',
            color: "white",
          }}
        >
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
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
            <RegionForm />
          ) : (
            <Typography gutterBottom>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
              ac consectetur ac, vestibulum at eros.
            </Typography>
          )}
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
