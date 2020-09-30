import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isEmpty } from "validator";
import { showErrorMessage, showSuccessMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { isAuthenticated } from "../../helpers/auth";
import { newPassword } from "../api/auth";

const NewPassword = () => {
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated()) {
      history.push("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loading: false,
    errorMsg: false,
    successMsg: false,
  });

  const { token } = useParams();

  const { password, loading, errorMsg, successMsg } = formData;

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
    if (isEmpty(password)) {
      setFormData({
        ...formData,
        errorMsg: "New Password field is required",
        loading: false,
      });
    } else {
      const { password } = formData;
      const data = { password, token };
      setFormData({
        ...formData,
        loading: true,
      });
      newPassword(data)
        .then((response) => {
          setFormData({
            ...formData,
            successMsg: response.data.message,
          });
          history.push("/signin");
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
                {successMsg && showSuccessMessage(successMsg)}

                <div className="mb-2">
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary form-control">
                  {" "}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPassword;
