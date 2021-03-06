// Imports
import React, { useState, useEffect, Fragment } from "react";
import * as Feather from "react-feather";

import { useFirestore } from "../../services";

import "./MyAccountPage.scss";

// Page content
export const MyAccountPage = ({ children }) => {
    // Defining variables and states
    const {
        getUserById,
        getRestaurantById,
        updateUserAmazonInfo,
        type,
        user,
        loading,
    } = useFirestore();

    const [currentUser, setCurrentUser] = useState();
    const [loadingUser, setLoadingUser] = useState(true);
    const [amazonError, setAmazonError] = useState("");

    // Handle login with Amazon
    const handleLWA = () => {
        // Remove Amazon error
        setAmazonError("");

        // Set authorization options
        let options = {
            scope: "profile",
            pkce: true,
        };

        // eslint-disable-next-line
        amazon.Login.authorize(options, (response) => {
            if (response.error) {
                setAmazonError(response.error);
                return;
            }

            // eslint-disable-next-line
            amazon.Login.retrieveToken(response.code, async (response) => {
                if (response.error) {
                    setAmazonError(response.error);
                    return;
                }

                // eslint-disable-next-line
                amazon.Login.retrieveProfile(
                    response.access_token,
                    async (response) => {
                        // Set Amazon info
                        const amazonInfo = {
                            name: response.profile.Name,
                            email: response.profile.PrimaryEmail,
                        };

                        // Add Amazon info of a user to FireStore
                        await updateUserAmazonInfo(user.uid, amazonInfo);

                        // Get updated user from Firestore and set current user
                        const updatedUser = await getUserById(user.uid);
                        setCurrentUser(updatedUser);
                    }
                );
            });
            return false;
        });
    };

    // Handle unlinking Alexa
    const handleLogout = async () => {
        // eslint-disable-next-line
        amazon.Login.logout();

        // Set Amazon info
        const amazonInfo = {
            name: "",
            email: "",
        };

        // Delete Amazon info of a user from FireStore
        await updateUserAmazonInfo(user.uid, amazonInfo);

        // Get updated user from Firestore and set current user
        const updatedUser = await getUserById(user.uid);
        setCurrentUser(updatedUser);
    };

    // Get the current user data on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetData = async () => {
                if (!loading) {
                    if (type !== "restaurant") {
                        const currentUser = await getUserById(user.uid);
                        setCurrentUser(currentUser);
                        setLoadingUser(false);
                    } else {
                        const currentUser = await getRestaurantById(user.uid);
                        setCurrentUser(currentUser);
                        setLoadingUser(false);
                    }
                }
            };

            handleGetData();
        };

        // Stop listening to changes
        return unsubscribe();
    }, [getUserById, getRestaurantById, user, type, loading]);

    // Add the Amazon LWA SDK on page load
    window.onAmazonLoginReady = function () {
        // eslint-disable-next-line
        amazon.Login.setClientId(
            "amzn1.application-oa2-client.bc2b5e9667c0404697fe0a65751b49e4"
        );
    };
    (function (d) {
        let a = d.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.id = "amazon-login-sdk";
        a.src = "https://assets.loginwithamazon.com/sdk/na/login1.js";
        const amazonRoot = d.getElementById("amazon-root");

        if (amazonRoot) {
            amazonRoot.appendChild(a);
        }
    })(document);

    return (
        <div className="page page--my-account">
            {!loading && !loadingUser && (
                <Fragment>
                    {type !== "restaurant" ? (
                        <Fragment>
                            <h1 className="no-margin">{currentUser.name}</h1>
                            <p>{currentUser.email}</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h1 className="no-margin">{currentUser.name}</h1>
                            <h3>
                                {currentUser.address}, <br />{" "}
                                {currentUser.postalCode} {currentUser.city}
                            </h3>
                        </Fragment>
                    )}
                    {type === "user" && (
                        <div className="alexa-msg">
                            <p>
                                If you want to start creating and managing your
                                orders using an Amazon Alexa you will have to
                                complete a few steps.
                            </p>
                            <ol>
                                <li>
                                    First of all open your Alexa app and search
                                    for the skill called Food Orders.
                                </li>
                                <li>
                                    Then you have to open the settings, link
                                    your account and enable the permissions.
                                </li>
                                <li>
                                    After you linked your account to the skill
                                    and enabled the permissions, click the login
                                    with Amazon button below and complete the
                                    login.
                                </li>
                            </ol>
                            <p>
                                If you completed all of these steps you should
                                be able to get to work.
                            </p>
                        </div>
                    )}
                    <div className="btns-container row justify-content-between align-items-center">
                        <div className="col-12 col-md-6">
                            <button
                                type="button"
                                onClick={() => console.log("Change password")}
                            >
                                Change password
                            </button>
                        </div>
                        {type === "user" && (
                            <Fragment>
                                <div className="col-12 col-md-6">
                                    {currentUser.amazonInfo.name === "" &&
                                    currentUser.amazonInfo.email === "" ? (
                                        <button
                                            type="button"
                                            id="LoginWithAmazon"
                                            onClick={handleLWA}
                                        >
                                            <img
                                                src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
                                                alt="Login with Amazon"
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            id="Logout"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    )}
                                </div>
                                <span className="error"></span>
                                {amazonError ? (
                                    <span className="error">
                                        <Feather.AlertCircle /> {amazonError}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Fragment>
                        )}
                    </div>
                </Fragment>
            )}
            <div id="amazon-root"></div>
        </div>
    );
};
