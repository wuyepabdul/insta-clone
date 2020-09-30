import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty, isEmail, equals } from "validator";
import { signup } from "../api/auth";
import { showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { uploadPhoto } from "../api/cloudinaryRequests";

const Signup = () => {
  const history = useHistory();
  const [postImage, setPostImage] = useState(undefined);
  const [postImageName, setPostImageName] = useState("Choose File");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const { username, email, password, confirmPassword } = formData;
  /*  */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errorMsg: "",
      loading: false,
    });
  };

  /*  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
    setPostImageName(e.target.files[0].name);
  };
 */
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleImageUpload = (event) => {
    const fileUploaded = event.target.files[0];
    setPostImage(fileUploaded);
  };

  const handleSignup = (data) => {
    signup(data)
      .then((response) => {
        setFormData({
          ...formData,
          loading: false,
        });
        history.push("/signin");
      })
      .catch((err) => {
        setFormData({
          ...formData,
          errorMsg: err.response.data.errorMessage,
          loading: false,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    //form validation
    if (
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(confirmPassword) ||
      isEmpty(username)
    ) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "All fields are required",
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "Invalid Email",
      });
    } else if (!equals(password, confirmPassword)) {
      setFormData({
        ...formData,
        loading: false,
        errorMsg: "Passwords Do Not Match",
      });
    } else {
      const { email, password, username } = formData;
      //upload profile pic to cloudinary if available

      if (postImage) {
        uploadPhoto(postImage)
          .then((response) => {
            const dataResponse = response.data.url;
            const data = { email, password, username, photo: dataResponse };
            //signup up user
            handleSignup(data);
          })
          .catch((err) => {
            console.log(err);
            setFormData({
              errorMsg: "NetWork Error.. Check your connection",
              loading: false,
            });
          });
      } else {
        const data = { email, password, username, photo: postImage };

        handleSignup(data);
      }
    }
  };
  return (
    <div>
      <form className="form-group" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-5">
            <div className="card mycard">
              <div className="card-body ">
                <h2 className="card-header mb-3 text-center">Instagram</h2>
                {formData.errorMsg && showErrorMessage(formData.errorMsg)}
                {formData.loading && showLoading(formData.loading)}
                <div className="username-input">
                  <input
                    className="form-control mb-2"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange}
                  />
                </div>
                <div className="email-input">
                  <input
                    className="form-control mb-2"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
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
                <div className="mb-2">
                  <input
                    className="form-control"
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {/*  <div className="input-group mb-2">
                  <div className="custom-file mb-4">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      name="postImage"
                      onChange={handleImageChange}
                      placeholder="Upload Profile picture"
                    />
                  </div>
                  <label className="custom-file-label" htmlFor="customFile">
                    {postImageName}
                  </label>
                </div> */}
                {/*   <div>
                  <div className="input-group mb-3">
                    <button
                      className="btn btn-primary "
                      onClick={handleClick}
                      style={{ margin: "10px 0px 10px 48px" }}
                    >
                      Upload Profile Pic
                    </button>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="postImage"
                        ref={hiddenFileInput}
                        className="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div> */}
                <button type="submit" className="btn btn-primary form-control">
                  {" "}
                  Submit
                </button>
                <p className="text-center">
                  {" "}
                  Already Have an Account? <Link to="signin">
                    Sign-In Here
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
