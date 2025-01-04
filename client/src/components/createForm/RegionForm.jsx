import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Buttons from "../button/Button";
import { handleSanitizeInput } from "../../utils/SanitizeInput";
import { createRegion, fetchRegions } from "../../store/ActionApis/regionApi";
import { useDispatch } from "react-redux";
import { notification } from "antd";

const regions = [
  "Region 1",
  "Region 2",
  "Region 3",
  "Region 4",
  "Region 5",
  "Region 6",
];

const RegionForm = ({ close }) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("");
  const [isAreaValid, setIsAreaValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      area: area,
      region: region,
    };
    const response = await dispatch(createRegion(dataToSend));
    if (response.payload.success) {
      notification.success({
        message: "Region Added!",
        description: response?.payload?.message,
        placement: "topRight",
      });
      await dispatch(fetchRegions());
      emptyStates();
    } else {
      notification.error({
        message: "Region Not Added!",
        description: response?.payload?.message || "Region not added",
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    setArea("");
    setRegion("");
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    setArea(e.target.value);
    const isDataSafe = handleSanitizeInput(e.target.value);
    setIsAreaValid(isDataSafe);
  };

  useEffect(() => {
    emptyStates();
  }, [close]);

  return (
    <div className="my-3">
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* area field */}
        <FormControl fullWidth sx={{ my: 2 }}>
          <TextField
            label="Enter Area"
            variant="outlined"
            value={area}
            onChange={(e) => handleInputChange(e)}
            error={!isAreaValid}
            helperText={!isAreaValid && "This character is prohibited"}
          />
        </FormControl>
        {/* region field */}
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="demo-simple-select-label">Select Region</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            label="Select Region"
          >
            {regions.map((region) => (
              <MenuItem value={region}>{region}</MenuItem>
            ))}
          </Select>
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
          disabled={isSubmitting || !isAreaValid || !area || !region} // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default RegionForm;
