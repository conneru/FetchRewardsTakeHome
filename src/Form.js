import { useEffect, useState } from "react";
import "./Form.css";

function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("none");
  const [state, setState] = useState("none");
  const [occupationOptions, setOccuOpts] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [errors, setErrors] = useState({});
  let anyErrors = false;
  const [submitted, setSubmitted] = useState(false);

  //fetch the required info from Fetch Rewards
  async function fetchData() {
    const fetchedData = await fetch(
      "https://frontend-take-home.fetchrewards.com/form"
    );
    const formInfo = await fetchedData.json();
    setStateOptions(formInfo["states"]);
    setOccuOpts(formInfo["occupations"]);
  }
  // useEffect hook that fetches the required data on the initial render
  useEffect(() => {
    fetchData();
  }, []);

  //Function for submitting the provided information and error handeling
  async function formSubmit(e) {
    e.preventDefault();
    //Regex for a valid email address and valid first/last name

    let payload = { name, email, password, occupation, state };
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validName = /^[A-Za-z]+$/;

    if (!validName.test(name)) {
      anyErrors = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Please enter a valid first name",
      }));
    }

    if (!validEmail.test(email)) {
      anyErrors = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email",
      }));
    }

    if (occupation === "none") {
      anyErrors = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        occupation: "Please select an occupation",
      }));
    }
    if (state === "none") {
      anyErrors = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "Please select a state",
      }));
    }

    if (anyErrors === false) {
      let res = await fetch(
        "https://frontend-take-home.fetchrewards.com/form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setSubmitted(true);
      }
    }
  }

  return (
    <div id="container">
      <div id="formContainer">
        {/* Conditional to either show the form or the completed page */}
        {!submitted ? (
          <form onSubmit={(e) => formSubmit(e)}>
            <img
              src="https://www.fetchrewards.com/assets/images/logos/header-logo.png"
              alt="FetchRewardsLogo"
            ></img>

            {/* Full name input */}
            <div className="form-input">
              <input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  delete errors.name;
                  anyErrors = false;
                }}
                className={errors.name ? "error" : ""}
                id="name"
              ></input>
              <label htmlFor="name" className="label-name">
                <span className="content-name">Full Name</span>
              </label>
            </div>

            {/* Email input */}
            <div className="form-input">
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  delete errors.email;
                  anyErrors = false;
                }}
                className={errors.email ? "error" : ""}
                id="email"
              ></input>
              <label htmlFor="email" className="label-name">
                <span className="content-name">Email</span>
              </label>
            </div>
            {/* Password input */}
            <div className="form-input">
              <input
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  delete errors.password;
                  anyErrors = false;
                }}
                className={errors.password ? "error" : ""}
                id="password"
              ></input>
              <label htmlFor="password" className="label-name">
                <span className="content-name">Password</span>
              </label>
            </div>

            <label htmlFor="occupation" className="select-label">
              Occupation
            </label>
            <select
              value={occupation}
              className={errors.occupation ? "error" : ""}
              onChange={(e) => {
                setOccupation(e.target.value);
                delete errors.occupation;
                anyErrors = false;
              }}
              id="occupation"
            >
              <option value={"none"} disabled hidden>
                Select Occupation
              </option>
              {occupationOptions.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>

            <label htmlFor="state" className="select-label">
              State
            </label>
            <select
              value={state}
              className={errors.state ? "error" : ""}
              onChange={(e) => {
                setState(e.target.value);
                delete errors.state;
              }}
              id="state"
            >
              <option value={"none"} disabled hidden>
                Select State
              </option>
              {stateOptions.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        ) : (
          <div className="completed">
            <img
              id="checkmark"
              src="https://www.pngitem.com/pimgs/m/34-343419_green-check-mark-in-circle-download-png-clipart.png"
              alt="Checkmark"
            ></img>
            <h2>
              You successfully submitted the form now go hire Conner Underhill!
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
