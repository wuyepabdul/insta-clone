import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../../helpers/loading";
import { fetchUserProfile } from "../api/fetchUserProfile";
import { followUser } from "../api/followUser";
import { followAction, unfollowAction } from "../actions/userActions";
import { unfollowUser } from "../api/unfollowUser";
const UserProfile = () => {
  const history = useHistory();
  const [UserProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const user = localStorage.getItem("user");
  const dispatch = useDispatch();

  const state = useSelector((state) => state.user);
  console.log("state", state);
  /* Object.keys(state).length === 0 */
  const [showFollow, setShowFollow] = useState(
    Object.keys(state).length !== 0
      ? !state.following.includes(userId)
      : Object.keys(state).length === 0
      ? "loading"
      : true
  );

  useEffect(() => {
    if (!user) {
      history.push("/signin");
    }

    fetchUserProfile(userId)
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFollow = () => {
    followUser(userId)
      .then((response) => {
        dispatch(
          followAction({
            followers: response.data.followers,
            following: response.data.following,
          })
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        setUserProfile((prevState) => {
          return {
            ...UserProfile,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, response.data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnfollow = () => {
    unfollowUser(userId)
      .then((response) => {
        dispatch(
          unfollowAction({
            followers: response.data.followers,
            following: response.data.following,
          })
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== response.data._id
          );
          return {
            ...UserProfile,
            user: { ...prevState.user, followers: newFollower },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Fragment>
      {UserProfile ? (
        <div style={{ maxWidth: "500px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={UserProfile.user.photo}
                alt="avatar"
              />
            </div>
            <div>
              <h4> {UserProfile.user.username}</h4>
              <h6> {UserProfile.user.email}</h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{UserProfile.posts.length} posts</h6>
                <h6>
                  {" "}
                  {parseInt(UserProfile.user.followers.length) === 1
                    ? `${UserProfile.user.followers.length} follower`
                    : `${UserProfile.user.followers.length} followers`}{" "}
                </h6>
                <h6> {UserProfile.user.following.length} following</h6>
                {showFollow ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleFollow()}
                  >
                    follow
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUnfollow()}
                  >
                    unfollow
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="gallery">
            {UserProfile.posts.map((post) => (
              <img
                className="item mb-2"
                key={post._id}
                src={post.photo}
                alt={post.title}
              />
            ))}
          </div>
        </div>
      ) : (
        showLoading()
      )}
    </Fragment>
  );
};

export default UserProfile;
