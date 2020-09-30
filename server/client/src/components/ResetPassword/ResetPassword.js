import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty, isEmail } from "validator";
import { resetPassword } from "../api/auth";
import { showErrorMessage, showSuccessMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { isAuthenticated } from "../../helpers/auth";
const ResetPassword = () => {
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated()) {
      history.push("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    loading: false,
    errorMsg: false,
    successMsg: false,
  });

  const { email, loading, errorMsg, successMsg } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errorMsg: "",
      successMsg: "",
      loading: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    if (isEmpty(email)) {
      setFormData({
        ...formData,
        errorMsg: "Email Field is empty",
        loading: false,
      });
    } else {
      const { email } = formData;
      const data = { email };
      setFormData({
        ...formData,
        loading: true,
      });
      resetPassword(data)
        .then((response) => {
          setFormData({
            ...formData,
            successMsg: response.data.message,
            loading: false,
          });
          //   history.push("/signin");
        })
        .catch((err) => {
          setFormData({
            ...formData,
            loading: false,
            errorMsg: err,
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
                {errorMsg && console.log(errorMsg)}
                {loading && showLoading()}
                {successMsg && showSuccessMessage(successMsg)}
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

                <button type="submit" className="btn btn-primary form-control">
                  {" "}
                  Send reset link
                </button>
                <h6 className="text-center mt-2">
                  {" "}
                  Don't Have an Account? <Link to="signin">Log In</Link>{" "}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
