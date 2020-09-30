import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isEmpty } from "validator";
import { showSuccessMessage, showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { createPost } from "../api/createPost";
import Axios from "axios";

const CreatePost = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postImageName, setPostImageName] = useState("Choose File");
  const [url, setUrl] = useState("");

  const [postData, setPostData] = useState({
    postTitle: [],
    postContent: "",
  });

  const { postContent, postTitle } = postData;

  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(false);
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
    setPostImageName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(postTitle) || isEmpty(postContent)) {
      setErrorMsg("All fields are required");
    } else {
      const data = new FormData();
      data.append("file", postImage);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dulswuyep");

      setLoading(true);

      try {
        await Axios.post(
          "https://api.cloudinary.com/v1_1/dulswuyep/image/upload",
          data
        )
          .then((response) => {
            setUrl(response.data.url);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        setErrorMsg(err);
        console.log(err);
      }

      const { postTitle, postContent } = postData;
      const formData = { postTitle, postContent };
      createPost(formData)
        .then((response) => {
          console.log(response.data.message);
          setLoading(false);
          setPostData({
            ...postData,
            postContent: "",
            postTitle: "",
          });
          history.push("/");
        })
        .catch((err) => {
          console.log("error", err);
          setErrorMsg(err.response.data.errorMessage);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="card mycard">
              <div className="card-body ">
                <h2 className="card-header mb-3 text-center">Instagram</h2>
                {loading && showLoading()}
                {errorMsg && showErrorMessage()}
                {successMsg && showSuccessMessage()}
                <input
                  className="form-control mb-2"
                  type="text"
                  name="postTitle"
                  placeholder="Title"
                  value={postTitle}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  name="postContent"
                  type="text"
                  placeholder="Content"
                  value={postContent}
                  onChange={handleChange}
                />

                <div className="input-group mb-2">
                  <div className="custom-file mb-4">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      name="postImage"
                      onChange={handleImageChange}
                    />
                  </div>
                  <label className="custom-file-label" htmlFor="customFile">
                    {postImageName}
                  </label>
                </div>

                <button type="submit" className="btn btn-primary form-control">
                  {" "}
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
