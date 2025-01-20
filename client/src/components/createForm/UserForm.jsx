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
import { createUser, fetchUsers } from "../../store/ActionApis/userApi";

const UserForm = ({ close,setClose, handleDialogClose }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state to avoid special character (for text field only)
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      username: username,
      email: email,
      password: password,
    };
    const response = await dispatch(createUser(dataToSend));
    if (response.payload.success) {
      notification.success({
        message: "Worker Added!",
        description: response?.payload?.message,
        placement: "topRight",
      });
      await dispatch(fetchUsers());
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
    setUsername("");
    setEmail("");
    setPassword("");
    setIsUsernameValid(true);
    setIsEmailValid(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    const isDataSafe = handleSanitizeInput(e.target.value);
    if (e.target.name === "username") {
      // for username field
      setUsername(e.target.value);
      setIsUsernameValid(isDataSafe);
    } else {
      // for email field
      setEmail(e.target.value);
      setIsEmailValid(isDataSafe);
    }
  };

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    if (close) {
      emptyStates();
      setClose(false);
    }
  }, [close]);

  return (
    <div className="my-5">
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* username field */}
        <FormControl fullWidth sx={{ mb: isUsernameValid ? 3 : 2 }}>
          <TextField
            name="username"
            label="Enter Username"
            variant="outlined"
            value={username}
            onChange={(e) => handleInputChange(e)}
            error={!isUsernameValid}
            helperText={!isUsernameValid && "This character is prohibited"}
          />
        </FormControl>
        {/* email field */}
        <FormControl fullWidth sx={{ mb: isEmailValid ? 3 : 2 }}>
          <TextField
            name="email"
            type="email"
            label="Enter Email"
            variant="outlined"
            value={email}
            onChange={(e) => handleInputChange(e)}
            error={!isEmailValid}
            helperText={!isEmailValid && "This character is prohibited"}
          />
        </FormControl>
        {/* password field */}
        <FormControl fullWidth sx={{ mb: isEmailValid ? 3 : 2 }}>
          <TextField
            name="password"
            type="password"
            label="Enter Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            !(isUsernameValid && isEmailValid && username && email && password)
          } // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default UserForm;
