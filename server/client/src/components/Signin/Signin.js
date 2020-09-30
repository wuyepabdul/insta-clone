import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty, isEmail } from "validator";
import { signin } from "../api/auth";
import { showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { isAuthenticated } from "../../helpers/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../actions/userActions";

const Signin = () => {
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated()) {
      history.push("/");
    }
  }, []);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loading: false,
    errorMsg: false,
  });

  const { email, password, loading, errorMsg } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errorMsg: "",
      loading: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    if (isEmpty(email) || isEmpty(password)) {
      setFormData({
        ...formData,
        errorMsg: "All fields are required",
        loading: false,
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        errorMsg: "Invalid Email",
        loading: false,
      });
    } else {
      const { email, password } = formData;
      const data = { email, password };
      setFormData({
        ...formData,
        loading: true,
      });
      signin(data)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          dispatch(userActions(response.data.user));
          console.log("redux state:", response.data.user);
          history.push("/");
        })
        .catch((err) => {
          setFormData({
            ...formData,
            loading: false,
            errorMsg: err.response.data.errorMessage,
          });
        });
    }
  };

  return (
    <div>
      <form className="form-group" onSubmit={handleSubmit}>
        <div className="row ">
          <div className="col-md-5">
            <div className="card signin-card">
              <div className="card-body ">
                <h2 className="card-header mb-3 text-center">Instagram</h2>
                {errorMsg && showErrorMessage(errorMsg)}
                {loading && showLoading()}
                <div className="email-input">
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary form-control">
                  {" "}
                  Login
                </button>
                <h6 className="text-center mt-2">
                  {" "}
                  Don't Have an Account? <Link to="signup">
                    Create One
                  </Link>{" "}
                </h6>
                <h6 className="text-center mt-2">
                  {" "}
                  <Link to="resetPassword">Forgot Password ?</Link>{" "}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signin;
