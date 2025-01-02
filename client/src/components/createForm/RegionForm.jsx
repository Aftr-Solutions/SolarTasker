import { CircularProgress, FormControl, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import Buttons from "../button/Button";

const RegionForm = () => {
  const [area, setArea] = useState(null);
  const [region, setRegion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    console.log("area", area);
    console.log("region", region);
    setIsSubmitting(false);
  };
  return (
    <div className="my-3">
      <TextField
        label="Enter Area"
        variant="outlined"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        fullWidth
        sx={{ my: 2 }}
      />
      <TextField
        label="Enter Region"
        variant="outlined"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        fullWidth
        sx={{ my: 2 }}
      />
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
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default RegionForm;
