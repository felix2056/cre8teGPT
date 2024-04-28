import React, { useState } from "react";
import axios from "axios";
import { useSession, update } from "next-auth/react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileBody = () => {
  const { data: session } = useSession();

  let [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();

    const first_name = event.target.first_name.value;
    const last_name = event.target.last_name.value;
    // const email = event.target.email.value;
    const phone = event.target.phone.value;

    setIsLoading(true);
    
    // validate for empty fields
    if (!first_name || !last_name || !email || !phone) {
      // show error message
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setIsLoading(false);
      return;
    }

    let data = {
      first_name,
      last_name,
      // email,
      phone,
    };

    // make api call to update user profile
    axios.put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/user/update", data, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      }).then((response) => {
        update();
        setIsLoading(false);
        
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        setIsLoading(false);

        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    const currentpassword = event.target.currentpassword.value;
    const newpassword = event.target.newpassword.value;
    const retypenewpassword = event.target.retypenewpassword.value;

  };
  return (
    <>
      <ToastContainer />

      <div className="single-settings-box profile-details-box top-flashlight light-xl leftside overflow-hidden">
        <div className="profile-details-tab">
          <div className="advance-tab-button mb--30">
            <ul
              className="nav nav-tabs tab-button-style-2 justify-content-start"
              id="settinsTab-4"
              role="tablist"
            >
              <li role="presentation">
                <a
                  href="#"
                  className="tab-button active"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="true"
                >
                  <span className="title">Profile</span>
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="password-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#password"
                  role="tab"
                  aria-controls="password"
                  aria-selected="false"
                >
                  <span className="title">Password</span>
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="del-account-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#delaccount"
                  role="tab"
                  aria-controls="delaccount"
                  aria-selected="false"
                >
                  <span className="title">Delete Account</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div
              className="tab-pane fade active show"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <form
                onSubmit={handleChange}
                action="#"
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input name="first_name" id="firstname" type="text" defaultValue={ session?.user?.user.first_name } />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input name="last_name" id="lastname" type="text" defaultValue={ session?.user?.user.last_name } />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      defaultValue={ session?.user?.user.email }
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phonenumber">Phone Number</label>
                    <input
                      name="phone"
                      id="phonenumber"
                      type="tel"
                      defaultValue={ session?.user?.user.phone }
                    />
                  </div>
                </div>
                {/* <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      cols="20"
                      rows="5"
                      value={text}
                    />
                  </div>
                </div> */}
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button className="btn-default" type="submit">
                      Save changes
                      { isLoading ? <i className="fa fa-spinner fa-spin ms-2"></i> : <i className="fa fa-save ms-2"></i> }
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="password"
              role="tabpanel"
              aria-labelledby="password-tab"
            >
              <form
                onSubmit={handleChangePassword}
                action="#"
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="currentpassword">Current Password</label>
                    <input
                      name="currentpassword"
                      id="currentpassword"
                      type="password"
                      placeholder="Current Password"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="newpassword">New Password</label>
                    <input
                      name="newpassword"
                      id="newpassword"
                      type="password"
                      placeholder="New Password"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="retypenewpassword">
                      Re-type New Password
                    </label>
                    <input
                      name="retypenewpassword"
                      id="retypenewpassword"
                      type="password"
                      placeholder="Re-type New Password"
                    />
                  </div>
                </div>
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <a className="btn-default" href="#">
                      Update Password
                    </a>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="delaccount"
              role="tabpanel"
              aria-labelledby="del-account-tab"
            >
              <form
                action="#"
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-11 text-Center">
                  <p className="mb--20">
            
                    <strong>Warning: </strong>Deleting your account will
                    permanently erase all your data and cannot be reversed. This
                    includes your profile, conversations, comments, and any
                    other info linked to your account. Are you sure you want to
                    go ahead with deleting your account? Enter your password to
                    confirm.
                  </p>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="enterpassword">Your Password</label>
                    <input
                      name="enterpassword"
                      id="enterpassword"
                      type="password"
                      placeholder="Current Password"
                    />
                  </div>
                </div>
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <a className="btn-default" href="#">
                      <i className="feather-trash-2"></i> Delete Account
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
