import {
  Box,
  CircularProgress,
  FormControl,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Buttons from "../button/Button";
import { handleSanitizeInput } from "../../utils/SanitizeInput";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import { createWorker, fetchWorkers } from "../../store/ActionApis/workerApi";

const WorkerForm = ({ close, handleDialogClose }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");

  // state to avoid special character (for text field only)
  const [isNameValid, setIsNameValid] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      name: name,
      number: number,
      cnic: nic,
      address: address,
    };
    const response = await dispatch(createWorker(dataToSend));
    
    if (response.payload.success) {
      notification.success({
        message: "Worker Added!",
        description: response?.payload?.message,
        placement: "topRight",
      });
      await dispatch(fetchWorkers());
      emptyStates();
      handleDialogClose();
    } else {
      notification.error({
        message: "Worker Not Added!",
        description: response?.payload?.message || "Worker not added",
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    setName("");
    setNumber("");
    setNic("");
    setAddress("");
    setIsNameValid(true);
    setIsAddressValid(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    const isDataSafe = handleSanitizeInput(e.target.value);
    if (e.target.name === "name") {
      // for name field
      setName(e.target.value);
      setIsNameValid(isDataSafe);
    } else {
      // for address field
      setAddress(e.target.value);
      setIsAddressValid(isDataSafe);
    }
  };

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    emptyStates();
  }, [close]);

  return (
    <div className="my-5">
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* area field */}
        <FormControl fullWidth sx={{ mb: isNameValid ? 3 : 2 }}>
          <TextField
            name="name"
            label="Enter Name"
            variant="outlined"
            value={name}
            onChange={(e) => handleInputChange(e)}
            error={!isNameValid}
            helperText={!isNameValid && "This character is prohibited"}
          />
        </FormControl>
        {/* number field */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            type="number"
            label="Enter Phone Number"
            variant="outlined"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </FormControl>
        {/* cnic field */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            type="number"
            label="Enter CNIC"
            variant="outlined"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
        </FormControl>
        {/* addres field */}
        <FormControl fullWidth sx={{ mb: isAddressValid ? 3 : 2 }}>
          <TextField
            name="address"
            label="Enter Address"
            variant="outlined"
            value={address}
            onChange={(e) => handleInputChange(e)}
            error={!isAddressValid}
            helperText={!isAddressValid && "This character is prohibited"}
          />
        </FormControl>
      </Box>
      {/* Submit button */}
      <div className="flex justify-end my-3">
        <Buttons
          text={
            isSubmitting ? (
              <span>
                Loading <CircularProgress size="15px" color="inherit" />
              </span>
            ) : (
              "Submit"
            )
          }
          type="primary"
          size="large"
          styling={"linearGradient"}
          disabled={
            isSubmitting ||
            !(isNameValid && isAddressValid && name && number && nic && address)
          } // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default WorkerForm;
