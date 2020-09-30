import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "validator";
import { showSuccessMessage, showErrorMessage } from "../../helpers/message";
import { showLoading } from "../../helpers/loading";
import { createPost } from "../api/createPost";
import { uploadPhoto } from "../api/cloudinaryRequests";

const CreatePost = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postImageName, setPostImageName] = useState("Choose File");
  // const [url, setUrl] = useState("no url");

  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  const { content, title } = postData;

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
    if (isEmpty(title) || isEmpty(content)) {
      setErrorMsg("All fields are required");
    } else {
      //upload image to cloudinary
      setLoading(true);
      uploadPhoto(postImage)
        .then((response) => {
          const dataResponse = response.data.url;
          const { title, content } = postData;
          const formData = { title, content, photo: dataResponse };

          //create Post
          createPost(formData)
            .then((response) => {
              console.log(response.data.message);
              setLoading(false);
              setPostData({
                ...postData,
                content: "",
                title: "",
              });
              history.push("/");
            })
            .catch((err) => {
              setErrorMsg(err.response.data.errorMessage);
              setLoading(false);
            });
        })
        .catch((err) => {
          setErrorMsg("Network Error..Check your connection");
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
                {errorMsg && showErrorMessage(errorMsg)}
                {successMsg && showSuccessMessage(successMsg)}
                <input
                  className="form-control mb-2"
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={title}
                  onChange={handleChange}
                />

                <textarea
                  className="form-control mb-2"
                  name="content"
                  type="text"
                  placeholder="Content"
                  value={content}
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
