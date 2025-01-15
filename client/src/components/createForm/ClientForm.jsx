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
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { fetchRegions } from "../../store/ActionApis/regionApi";
import { createClient, fetchClients } from "../../store/ActionApis/clientApi";

const fields = [
  { name: "name", label: "Name", type: "input" },
  { name: "number", label: "Number", type: "input" },
  { name: "email", label: "Email", type: "input" },
  { name: "address", label: "Address", type: "input" },
  { name: "region", label: "Region", type: "select" },
  { name: "area", label: "Area", type: "select" },
  { name: "regionPref", label: "Region Preference", type: "select" },
  { name: "amount", label: "Amount", type: "input" },
  { name: "plan", label: "Plan", type: "select" },
  { name: "planDuration", label: "Plan Duration", type: "select" },
];

// for region preference field
const regionPrefs = [
  { id: 1, name: "Preference 1" },
  { id: 2, name: "Preference 2" },
  { id: 3, name: "Preference 3" },
  { id: 4, name: "Preference 4" },
  { id: 5, name: "Preference 5" },
  { id: 6, name: "Preference 6" },
];
// for plan field
const plans = [
  { id: "0", name: "Basic" },
  { id: 1, name: "Premium" },
];
// for planDur field
const planDur = [
  { id: 15, name: "15 Days" },
  { id: 30, name: "30 Days" },
];

const ClientForm = ({ close, handleDialogClose }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [field, setField] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    region: "",
    areas: [], // stored area as per selected region
    area: "",
    regionPref: "",
    amount: "",
    plan: "",
    planDuration: "",
  });

  // state to avoid special character (for text field only)
  const [isValid, setIsValid] = useState({
    name: true,
    email: true,
    address: true,
  });

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // store region to display areas in area field as per selected region
  const [groupedByRegions, setgroupedByRegions] = useState([]);

  const dispatch = useDispatch();
  // get member data from region api to show in region field
  const { regions } = useSelector((state) => state.region);

  useEffect(() => {
    const grouped = regions?.reduce((acc, curr) => {
      const regionIndex = acc.findIndex((item) => item.region === curr.region);

      if (regionIndex !== -1) {
        acc[regionIndex].areas.push({ id: curr.id, name: curr.area });
      } else {
        acc.push({
          region: curr.region,
          areas: [{ id: curr.id, name: curr.area }],
        });
      }

      return acc;
    }, []);

    setgroupedByRegions(grouped); // Update state with grouped data
  }, [regions]); // Empty dependency array means it runs once on mount

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      name: field.name,
      number: field.number,
      email: field.email,
      address: field.address,
      area_region_id: field.area,
      amount: field.amount,
      service_plan_duration: field.planDuration,
      plan: field.plan == 1 ? field.plan : 0, // send 0 if value is not 1
      region_preference: field.regionPref,
    };

    const response = await dispatch(createClient(dataToSend));

    if (response.payload.success) {
      notification.success({
        message: "Client Added!",
        description: response?.payload?.message,
        placement: "topRight",
      });
      await dispatch(fetchClients());
      emptyStates();
      handleDialogClose();
    } else {
      notification.error({
        message: "Client Not Added!",
        description: response?.payload?.message || "Client not added",
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    setField({
      name: "",
      number: "",
      email: "",
      address: "",
      region: "",
      areas: [],
      area: "",
      regionPref: "",
      amount: "",
      plan: "",
      planDuration: "",
    });
    setIsValid({
      name: true,
      email: true,
      address: true,
    });
  };

  // function to stored data and check input field is valid
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure to get the name and value from the target

    setField((prev) => ({
      ...prev, // Spread the previous state
      [name]: name === "region" ? value : value, // Store the entire region object if it's a region field
    }));

    // Special handling for region to update areas
    if (name === "region") {
      setField((prev) => ({
        ...prev,
        areas: value ? value.areas : [], // If a region is selected, update areas based on that region
      }));
    }
    // only apply on input text fields
    if (["name", "email", "address"].includes(name)) {
      const isDataSafe = handleSanitizeInput(value);
      setIsValid((prev) => ({
        ...prev, // Spread the previous state
        [name]: isDataSafe, // Use dynamic key to update the correct field based on the input name
      }));
    }
  };

  // effect to call worker api to show in member's select field
  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    emptyStates();
  }, [close]);

  // Function to check if any field in 'field' is empty
  const isAnyFieldEmpty = () => {
    return Object.values(field).some((value) => {
      // Check for empty strings
      return value == "";
    });
  };

  // Function to check if any field in 'isValid' is false
  const isAnyInvalid = () => {
    return Object.values(isValid).includes(false);
  };

  // Button should be disabled if any field is empty or any isValid field is false
  const isButtonDisabled = isAnyFieldEmpty() || isAnyInvalid();

  return (
    <div className="my-5" style={{ maxWidth: isMobile ? 270 : 420 }}>
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* all fields */}
        {fields.map(({ name, label, type }, index) =>
          type === "input" ? (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <TextField
                name={name}
                label={label}
                type={
                  ["number", "amount"].includes(name)
                    ? "number"
                    : name === "email"
                    ? "email"
                    : "string"
                }
                variant="outlined"
                value={field[name]}
                onChange={(e) => handleInputChange(e)}
                error={!["number", "amount"].includes(name) && !isValid[name]}
                helperText={
                  !["number", "amount"].includes(name) && !isValid[name]
                    ? "This character is prohibited"
                    : ""
                }
              />
            </FormControl>
          ) : (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <InputLabel id={`select${index}`}>{label}</InputLabel>
              <Select
                labelId={`select${index}`}
                name={name}
                value={field[name] || ""} // Ensure the value is set to field[name], fallback to empty string
                onChange={(e) => handleInputChange(e)}
                label={label}
              >
                {(name === "region"
                  ? groupedByRegions // groups by region
                  : name === "area"
                  ? field.areas // areas under the selected region
                  : name === "regionPref"
                  ? regionPrefs // regionPrefs
                  : name === "plan"
                  ? plans // plans
                  : planDur
                ) // plan duration // other conditions can be added for different fields like "plan"
                  .map((item, idx) => (
                    <MenuItem
                      key={idx}
                      value={
                        name === "region"
                          ? item // store the entire object for region
                          : item.id
                      }
                    >
                      {name === "region"
                        ? item.region // display region name
                        : item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )
        )}
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
          disabled={isSubmitting || isButtonDisabled} // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default ClientForm;
