import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../App.css";
import { showNoDataError } from "../../helpers/message";
import { addComment } from "../api/comments";
import { deletePost } from "../api/deletePost";
import { fetchAllPosts } from "../api/fetchPosts";
import { likePost } from "../api/likePost";
import { unlikePost } from "../api/unlikePost";

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [button, setButton] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // check for user if loggedin

    const user = localStorage.getItem("user");

    setUserData(JSON.parse(localStorage.getItem("user")));

    if (user) {
      //get all posts and add to local state
      fetchAllPosts()
        .then((response) => {
          if (response.data.allPosts.length === 0) {
            setErrorMessage("No Data Found at this time.. try again later");
          }
          setData(response.data.allPosts);
        })
        .catch((err) => {
          console.log(err.response.data.errorMessage);
        });
    } else {
      history.push("/signin");
    }
  }, []);

  const handleLike = (id) => {
    likePost(id)
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  const handleUnlike = (id) => {
    unlikePost(id)
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  const handleAddComment = (postId, text) => {
    addComment(postId, text)
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
        setButton("");
      })
      .catch((err) => console.log(err));
  };

  const handleOnchange = () => {
    setButton(
      <button className="btn btn-outline-secondary btn-sm m-1"> Add</button>
    );
  };

  const handleDelete = (postId) => {
    deletePost(postId)
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      {errorMessage ? (
        <div className="text-center">{showNoDataError(errorMessage)}</div>
      ) : (
        <div>
          {errorMessage && showNoDataError(errorMessage)}
          {data.map((posts) => (
            <div className="card home-card shadow" key={posts._id}>
              <h5>
                <Link
                  to={
                    posts.postBy._id !== userData.id
                      ? "/profile/" + posts.postBy._id
                      : "/profile"
                  }
                >
                  {posts.postBy.username}
                </Link>
                {posts.postBy._id === userData.id && (
                  <i
                    className="far fa-trash-alt p-1 deleteIcon"
                    onClick={() => {
                      handleDelete(posts._id);
                    }}
                    style={{ float: "right" }}
                  ></i>
                )}
              </h5>
              <img src={posts.photo} alt="avatar" />
              <div className="card-body">
                <i className="fas fa-heart" style={{ color: "red" }}></i>

                {posts.likes.includes(userData.id) ? (
                  <i
                    className="fas fa-thumbs-down p-2 unlikeIcon"
                    onClick={() => {
                      handleUnlike(posts._id);
                      console.log("post it");
                    }}
                  ></i>
                ) : (
                  <i
                    className="fas fa-thumbs-up p-2 likeIcon"
                    onClick={() => {
                      handleLike(posts._id);
                      console.log("post it");
                    }}
                  ></i>
                )}

                <h6 className="card-title"> {posts.likes.length} likes </h6>

                <h6 className="card-title"> {posts.title} </h6>

                <p className="card-text">{posts.content}</p>
                <div className="text center"> comments.. </div>
                {posts.comments.map((comment) => {
                  return (
                    <div key={comment._id}>
                      <b>{comment.postBy.username}: </b>
                      {comment.text}{" "}
                    </div>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(e.target[0].value, posts._id);
                  }}
                >
                  <textarea
                    name="textarea"
                    placeholder="comment"
                    value=""
                    onChange={handleOnchange}
                    className="form-control"
                  ></textarea>
                  {button}
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default Home;
