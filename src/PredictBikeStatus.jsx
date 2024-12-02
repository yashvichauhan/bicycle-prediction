import React, { useState } from "react";
import axios from "axios";

const PredictBikeStatus = () => {
  // Define the form state
  const [formData, setFormData] = useState({
    PRIMARY_OFFENCE: "",
    OCC_DOW: "",
    REPORT_DOW: "",
    HOOD_158: "",
    BIKE_MAKE: "",
    BIKE_TYPE: "",
    BIKE_COLOUR: "",
    BIKE_COST: "",
    LOCATION_TYPE: "",
    PREMISES_TYPE: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    // Validate numeric inputs
    if (isNaN(formData.HOOD_158) || isNaN(formData.BIKE_COST)) {
      setError("HOOD_158 and BIKE_COST must be numeric values.");
      return;
    }

    try {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          form.append(key, value);
        });
  
        // Send API request
        const apiResponse = await axios.post("http://127.0.0.1:12345/predict", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        // Set the API response
        setResponse(apiResponse.data);
    } catch (err) {
      setError("Error fetching prediction. Please check the input values.");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f7faff", // Light blue background
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>🚲 Bike Theft Prediction</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 20px" }}>
        {[
          { label: "Primary Offence", name: "PRIMARY_OFFENCE", type: "text", placeholder: "e.g., THEFT UNDER" },
          { label: "Occurrence Day of Week", name: "OCC_DOW", type: "text", placeholder: "e.g., Wednesday" },
          { label: "Report Day of Week", name: "REPORT_DOW", type: "text", placeholder: "e.g., Friday" },
          { label: "HOOD_158", name: "HOOD_158", type: "number", placeholder: "e.g., 168" },
          { label: "Bike Make", name: "BIKE_MAKE", type: "text", placeholder: "e.g., GIANT" },
          { label: "Bike Type", name: "BIKE_TYPE", type: "text", placeholder: "e.g., RG" },
          { label: "Bike Colour", name: "BIKE_COLOUR", type: "text", placeholder: "e.g., GRN" },
          { label: "Bike Cost", name: "BIKE_COST", type: "number", placeholder: "e.g., 4500" },
          { label: "Location Type", name: "LOCATION_TYPE", type: "text", placeholder: "e.g., Commercial Places" },
          { label: "Premises Type", name: "PREMISES_TYPE", type: "text", placeholder: "e.g., Outside" },
        ].map((field, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <label
              style={{
                fontWeight: "bold",
                flex: "0 0 150px", // Fixed width for labels
                color: "#555",
              }}
            >
              {field.label}:
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              placeholder={field.placeholder}
              style={{
                flex: "1",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle inset shadow
              }}
            />
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
          >
            Predict
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>{error}</p>}

      {response && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ textAlign: "center", color: "#333" }}>🎉 Prediction Results:</h3>
          <p style={{ fontSize: "18px", textAlign: "center", color: "#007BFF" }}>
            <strong>Predicted Class:</strong> {response.predicted_class}
          </p>
          <p style={{ fontSize: "16px", textAlign: "center", color: "#555" }}>
            <strong>Prediction Probability:</strong>
            <br />
            Stolen: {response.prediction_probability[0].toFixed(2)} | Recovered:{" "}
            {response.prediction_probability[1].toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictBikeStatus;
