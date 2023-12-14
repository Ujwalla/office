import "./App.css";
import React, { useEffect, useState } from "react";
import "./new.css";
import { FiAlertCircle } from "react-icons/fi";
import { FaUpload } from "react-icons/fa";

function LicensePlate({ LPModel, setLPModel }) {
  const handleLPModelChange = (e) => {
    setLPModel(e.target.value);
  };
  return (
    <div className="label-container">
      <label htmlFor="LP1">License Plate</label>
      <input
        type="text"
        id="LP1"
        className="LP1"
        placeholder="Enter License Plate"
        value={LPModel.toUpperCase()}
        onChange={handleLPModelChange}
      />
    </div>
  );
}

function Diagnosis({ diagnosis, setDiagnosis }) {
  const handleDiagnosisModelChange = (e) => {
    setDiagnosis(e.target.value);
  };

  return (
    <div>
      <legend style={{ color: "whitesmoke", fontSize: "large" }}>
        Select Diagnosis:
      </legend>
      <div
        style={{
          width: "330px",
          height: "180px",
          borderRadius: " 8px",
          borderColor: "black",
        }}
      >
        <div
          className="diagnosis-option"
          style={{
            backgroundColor: "white",
            borderRadius: " 8px",
            width: "330px",
            height: "70px",
          }}
        >
          <input
            type="radio"
            id="diagnosis1"
            className="diagnosis"
            placeholder="Diagnosis"
            value="1"
            onChange={handleDiagnosisModelChange}
            checked={diagnosis === "1"}
          />
          <label
            style={{ color: "black", fontSize: "large", marginTop: "10px" }}
            htmlFor="diagnosis1"
          >
            
            <strong>Level 1</strong>
            
            <em>Represents textual Damages</em>
            
          </label>
        </div>

        <div
          className="diagnosis-option"
          style={{
            backgroundColor: "white",
            borderRadius: " 8px",
            width: "330px",
            height: "70px",
          }}
        >
          <input
            type="radio"
            id="diagnosis2"
            className="diagnosis"
            placeholder="Diagnosis"
            value="2"
            onChange={handleDiagnosisModelChange}
            checked={diagnosis === "2"}
          />
          <label
            style={{
              color: "black",
              fontSize: "large",
              labelPlacement: "left",
            }}
            htmlFor="diagnosis2"
          >
            <strong>Level 2</strong>
            <em>Represents Damages on Image</em>
          </label>
        </div>

        <div
          className="diagnosis-option"
          style={{
            backgroundColor: "white",
            borderRadius: " 8px",
            width: "330px",
            height: "70px",
          }}
        >
          <input
            type="radio"
            id="diagnosis3"
            className="diagnosis"
            placeholder="Diagnosis"
            value="3"
            onChange={handleDiagnosisModelChange}
            checked={diagnosis === "3"}
          />
          <label
            style={{ color: "black", fontSize: "large" }}
            htmlFor="diagnosis3"
          >
            <strong>Level 3</strong>
            <em>Represents Damages on Images and Textual Damages</em>
          </label>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  const [angleNames, setAngleNames] = useState([]);
  const [selectedAngle, setSelectedAngle] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [confirmedAngles, setConfirmedAngles] = useState([]);
  const [isColumn2Visible, setIsColumn2Visible] = useState(false);
  const [LPModel, setLPModel] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [angleImages, setAngleImages] = useState({});
  const [step, setStep] = useState(1);
  const [dataURL, setDataURL] = useState("");
  const [damage_text, setDamage_text] = useState([]);
  const [showAlert, setShowAlert] = useState();

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [errorAngleName, setErrorAngleName] = useState("");
  const [isCursorOverImage, setIsCursorOverImage] = useState(false);
  const [imageZoomLevel, setImageZoomLevel] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [uploadCompletedAngle, setUploadCompletedAngle] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState({});
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://c7a6-125-17-251-66.ngrok-free.app/angle_names",
          {
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAngleNames(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (angle) => {
    setSelectedAngle(angle);
    setIsColumn2Visible(true);
    setErrorAngleName(angle);
  };
  const handleMouseEnter = () => {
    setIsCursorOverImage(true);
  };

  const handleMouseLeave = () => {
    setIsCursorOverImage(false);
  };
  const handleZoomIn = () => {
    setImageZoomLevel(imageZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    if (imageZoomLevel > 0.1) {
      setImageZoomLevel(imageZoomLevel - 0.1);
    }
  };
  const handleFileUpload = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleOkClick = () => {
    setShowAlert(false);
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
  };
  const handleConfirmUpload = () => {
    console.log("Confirmed uploads:", selectedFiles);
    setConfirmedAngles((prevConfirmedAngles) => [
      ...prevConfirmedAngles,
      selectedAngle,
    ]);
    setUploading(true);

    // After a simulated delay, mark the upload as completed
    setTimeout(() => {
      setUploading(false);
      setShowSaveMessage(true);
    }, 2000);

    // Convert the uploaded images to base64 and associate them with angle names
    const promises = selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64WithoutPrefix = reader.result.replace(
            /^data:image\/[a-z]+;base64,/,
            ""
          );
          resolve(base64WithoutPrefix);
        };
        reader.onerror = (error) => {
          reject(
            new Error(`Error converting image to base64: ${error.message}`)
          );
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((results) => {
      setAngleImages((prevAngleImages) => ({
        ...prevAngleImages,
        [selectedAngle]: results,
      }));
      setSelectedFiles([]);
      setShowSaveMessage((prevShowSaveMessage) => ({
        ...prevShowSaveMessage,
        [selectedAngle]: true,
      }));
      setUploadCompletedAngle(selectedAngle);
    });
  };

  const handleChangeImage = () => {
    setIsColumn2Visible(true);
    setSelectedFiles([]);
  };

  const defaultImageUrl = `/hatchback/hatchback/${selectedAngle}.PNG`;

  const convertToBase64 = async (angle) => {
    //console.log("Base64 Images by Angle:", angleImages);

    const convertedData = Object.fromEntries(
      Object.entries(angleImages).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ])
    );

    // Add additional data
    convertedData["diagnosis"] = diagnosis;
    convertedData["licence_plate"] = LPModel;

    try {
      console.log(convertedData);
      const response = await fetch(
        " https://c7a6-125-17-251-66.ngrok-free.app/inference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(convertedData),
        }
      );

      if (!response.ok && response.status !== 200) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          setErrorName(`Error during inference for ${selectedAngle}`);
          setErrorStatus(errorData);
        } else {
          const errorText = await response.text();

          const parser = new DOMParser();
          const doc = parser.parseFromString(errorText, "text/html");
          const title = doc.querySelector("title")?.textContent || "Error";
          const errorMessage =
            doc.querySelector("p")?.textContent || "Unknown error";

          setErrorName(`Error during inference for ${selectedAngle}`);
          setErrorStatus(`${title}: ${errorMessage}`);
        }

        setShowAlert(true);
        setErrorAngleName(selectedAngle);
        return;
      }
      const responseData = await response.json();

      if (Array.isArray(responseData)) {
        console.log("Server response:", responseData);
        handleNext();
      } else {
        throw new Error("Unexpected response format");
      }

      console.log("Server response:", responseData);
      handleNext();
      if (diagnosis === "1") {
        setDamage_text(
          responseData.map((item) => {
            return {
              viewName: Object.keys(item)[0],
              damage_text: item[Object.keys(item)[0]].damage_info,
            };
          })
        );
      } else if (diagnosis === "2") {
        console.log(dataURL.size);
        setDataURL(
          responseData.map((item) => {
            const viewName = Object.keys(item)[0];

            const plotedPredictionsImage = item[viewName]?.ploted_damage || "";
            const sanitizedImage = plotedPredictionsImage
              .replace(/^b'/, "") // Remove the leading 'b'
              .replace(/'$/, ""); // Remove the trailing '
            const dataURL = `data:image/jpeg;base64,${sanitizedImage}`;
            console.log(dataURL);
            return {
              viewName: viewName,
              dataURL,
            };
          })
        );
      } else if (diagnosis === "3") {
        setDamage_text(
          responseData.map((item) => {
            return {
              viewName: Object.keys(item)[0],
              damage_text: item[Object.keys(item)[0]].damage_info,
            };
          })
        );
        setDataURL(
          responseData.map((item) => {
            const viewName = Object.keys(item)[0];

            const plotedPredictionsImage = item[viewName]?.ploted_damage || "";
            const sanitizedImage = plotedPredictionsImage
              .replace(/^b'/, "") // Remove the leading 'b'
              .replace(/'$/, ""); // Remove the trailing '
            const dataURL = `data:image/jpeg;base64,${sanitizedImage}`;
            console.log(dataURL);
            return {
              viewName: viewName,
              dataURL,
            };
          })
        );
      }
    } catch (error) {
      if (selectedAngle === errorAngleName) {
        setErrorStatus(error.message);
        setShowAlert(true);
        setErrorAngleName(selectedAngle);

        console.error(error);
      }
      console.error(error);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div
    >
      <div className="first">
        {step === 1 && (
          <div className="page1">
            <LicensePlate LPModel={LPModel} setLPModel={setLPModel} />
            <Diagnosis diagnosis={diagnosis} setDiagnosis={setDiagnosis} />
            <button
              style={{
                color: "white",
                backgroundColor: "black",
                border: "5px solid white",
                fontSize: "20px",
                opacity: "1",
                marginTop: "70px",
              }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ color: "white", backgroundColor: "black" }}>
              Select Angle & Upload Image
              {showSaveMessage[uploadCompletedAngle] && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 255, 0, 0.8)",
                    padding: "20px",
                    borderRadius: "10px",
                    zIndex: "999",
                  }}
                >
                  <p>Image uploaded successfully for {uploadCompletedAngle}!</p>
                </div>
              )}
              {/* {uploading && <div>Uploading...</div>} */}
            </h1>
            <div className="column-container">
              <div className="column1">
                {angleNames.map((angleName, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleButtonClick(angleName)}
                      style={{
                        backgroundColor: confirmedAngles.includes(angleName)
                          ? "green"
                          : "initial",
                        width: "400px",
                        height: "50px",
                        marginTop: "1px",
                        marginBottom: "1px",
                        borderRadius: "1px",
                        color: "white",
                      }}
                    >
                      {angleName}
                      <br />
                    </button>
                  </div>
                ))}

                {showSuccessMessage && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 255, 0, 0.8)",
                      padding: "20px",
                      borderRadius: "10px",
                      zIndex: "999",
                    }}
                  >
                    <p>
                      Data submitted successfully. Please wait for the response!
                    </p>
                    <button
                      style={{ marginBottom: "10px", color: "Black" }}
                      onClick={handleOkClick}
                    >
                      OK
                    </button>
                  </div>
                )}

                {showErrorMessage && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(255, 0, 0, 0.8)",
                      padding: "20px",
                      borderRadius: "10px",
                      zIndex: "999",
                    }}
                  >
                    <p>Please upload all angles before submitting.</p>
                    <button
                      style={{ marginBottom: "10px", color: "Black" }}
                      onClick={handleOkClick}
                    >
                      OK
                    </button>
                  </div>
                )}

                <button
                  style={{
                    color: "white",
                    backgroundColor:
                      submitButtonClicked ||
                      confirmedAngles.length !== angleNames.length
                        ? "gray"
                        : "black",
                    border: "5px solid white",
                    fontSize: "20px",
                    opacity: "1",
                    margin: "10px",
                  }}
                  onClick={() => {
                    if (confirmedAngles.length === angleNames.length) {
                      setSubmitButtonClicked(true);
                      convertToBase64();
                      setShowSuccessMessage(true);
                    } else {
                      // Show the error message
                      setShowErrorMessage(true);

                      setTimeout(() => {
                        setShowErrorMessage(false);
                      }, 5000); // Hide after 5 seconds
                    }
                  }}
                >
                  Submit
                </button>
              </div>

              {isColumn2Visible && (
                <div className="column2">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        flexDirection: "column",
                        backgroundColor: "black",
                        opacity: "1",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontSize: "20px",
                          marginTop: "1px",
                        }}
                      >
                        {" "}
                        {selectedAngle}
                      </p>

                      {selectedFiles.length > 0 ? (
                        <div style={{ marginTop: "1px" }}>
                          <span className="button-container">
                            <button
                              style={{
                                width: "100px",
                                backgroundColor: "green",
                                color: "white",
                                border: " solid white",
                                marginTop: "2px",
                                //marginLeft:"5px"
                              }}
                              onClick={handleConfirmUpload}
                            >
                              Save
                            </button>

                            <button
                              style={{
                                width: "100px",
                                backgroundColor: "red",
                                color: "white",
                                border: " solid white",
                                marginTop: "5px",
                                marginLeft: "760px",
                              }}
                              onClick={handleChangeImage}
                            >
                              Edit
                            </button>
                          </span>
                          {selectedFiles.map((file, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(file)}
                              alt={`Uploaded ${index}`}
                              style={{ minWidth: "950px", height: "490px" }}
                              required
                            />
                          ))}
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="file"
                            style={{
                              color: "white",
                              marginLeft: "850px",
                              border: " solid white",
                              // maxWidth: "100px",
                              marginTop: "2px",
                              textAlign: "center",
                              paddingLeft: "15px",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              paddingTop: "7px",
                              backgroundColor: "green",
                            }}
                          >
                            <FaUpload />
                          </label>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            id="file"
                            hidden
                            multiple
                            required
                          />

                          <img
                            src={defaultImageUrl}
                            alt="Default"
                            style={{
                              minWidth: "950px",
                              height: "450px",
                              marginTop: "60px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {showAlert && (
                    <div
                      className="alert-popup"
                      style={{
                        color: "black",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: "5px solid 	white",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        minWidth: "400px",
                        height: "auto",
                        opacity: "0.9",
                      }}
                    >
                      /
                      <h2>
                        {" "}
                        <FiAlertCircle /> Error Message
                      </h2>
                      <p
                        style={{
                          fontWeight: "bolder",
                          marginLeft: "5px",
                          marginRight: "5px",
                        }}
                      >
                        {" "}
                        {errorStatus}
                      </p>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button
                          style={{ marginBottom: "10px", color: "Black" }}
                          onClick={handleOkClick}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h1 style={{ color: "white", backgroundColor: "black" }}>
              Display Information
            </h1>
            <div className="column-container">
              <div className="column3">
                {angleNames.map((angleName, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleButtonClick(angleName)}
                      style={{
                        backgroundColor: confirmedAngles.includes(angleName)
                          ? "green"
                          : "initial",
                        width: "400px",
                        height: "50px",
                        marginTop: "1px",
                        marginBottom: "1px",
                        borderRadius: "1px",
                        color: "white",
                      }}
                    >
                      {angleName}
                      <br />
                    </button>
                  </div>
                ))}
              </div>

              {isColumn2Visible && (
                
                <div className="column4">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ color: "white" }}>View Name: {selectedAngle}</p>

                    {dataURL.length > 0 && (
                      <div>
                        {dataURL
                          .filter((item) => item.viewName === selectedAngle)
                          .map((item, index) => (
                            <div key={index}>
                              <img
                                src={item.dataURL}
                                alt={`Damage for ${item.viewName}`}
                                style={{
                                  minWidth: "800px",
                                  height: "430px",
                                  transform: `scale(${imageZoomLevel})`,
                                  cursor: isCursorOverImage
                                    ? "zoom-in"
                                    : "default",
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={handleZoomIn}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  handleZoomOut();
                                }} // Right-click to zoom out
                              />
                            </div>
                          ))}
                      </div>
                    )}
                    
                    {diagnosis !== "2" && (
                      <div>
                        {damage_text.filter(
                          (item) =>
                            item.viewName === selectedAngle &&
                            item.damage_text.length > 0 &&
                            diagnosis !== "2"
                        ).length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              color: "white",
                              border: "2px solid white",
                              backgroundColor: "black",
                              border: "5px solid white",
                              maxWidth: "810px",
                              marginTop: "5px",
                            }}
                          >
                            {damage_text
                              .filter(
                                (item) =>
                                  item.viewName === selectedAngle &&
                                  item.damage_text.length > 0
                              )
                              .map((viewData, index) => (
                                <div key={index}>
                                  <ul>
                                    {viewData.damage_text.map(
                                      (damage, damageIndex, item) => (
                                        <div>
                                          <li key={damageIndex}>{damage}</li>
                                        </div>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: "white",
                              display: "flex",
                              flexDirection: "column",

                              border: "2px solid white",
                              backgroundColor: "black",
                              border: "5px solid white",
                              maxWidth: "810px",
                              marginTop: "5px",
                              paddingLeft: "320px",
                              height: "50px",
                              paddingTop: "20px",
                            }}
                          >
                            {diagnosis !== "2" && <div>No Damage Found</div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
