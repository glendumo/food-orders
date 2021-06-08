// Imports
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import * as Feather from "react-feather";

import { DishInfoForm, DishPricesForm } from "../../components/forms";
import { Popup } from "../../components/popup";
import * as Routes from "../../routes";
import { useFirestore, useStorage } from "../../services";

import "./DishDetailPage.scss";

// Page content
export const DishDetailPage = () => {
    // Define variables and states
    const { id } = useParams();
    const {
        getDishById,
        updateDishAvailablity,
        updateDish,
        deleteDish,
        getPricesByDishId,
        deletePrice,
        getSizesByRestaurant,
        user,
    } = useFirestore();
    const { uploadImg, deleteImg } = useStorage();
    const restaurantId = user ? user.uid : "";
    const restaurantName = user ? user.displayName : "";

    const [dish, setDish] = useState();
    const [sizes, setSizes] = useState();
    const [prices, setPrices] = useState();
    const [loading, setLoading] = useState(true);
    const [available, setAvailable] = useState();
    const [deleteDishError, setDeleteDishError] = useState("");
    const [infoSuccess, setInfoSuccess] = useState("");
    const [infoError, setInfoError] = useState("");
    const [pricesSuccess, setPricesSuccess] = useState("");
    const [pricesError, setPricesError] = useState("");

    // Handle switch changes
    const handleSwitch = async () => {
        // Change status
        setAvailable(!available);

        // Update dish availability in Firestore
        await updateDishAvailablity(dish.id, !available);

        // Get dish data from Firestore and set current dish
        const updatedDish = await getDishById(dish.id);
        setDish(updatedDish);
    };

    // Handle opening delete dish popup & disable scrolling
    const handleDeletePopup = () => {
        const popup = document.getElementById("delete-dish");
        popup.classList.remove("hidden");

        const body = document.body;
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";
    };

    // Handle deleting a dish from Firestore
    const handleDeleteDish = async (ev) => {
        ev.preventDefault();

        try {
            // Delete thumbnail from Cloud Storage
            await deleteImg(dish.thumbnail.path);

            // Delete all prices for current dish
            prices.forEach(async (price) => {
                // Delete price from Firestore
                await deletePrice(price.id);
            });

            // Delete dish from Firestore
            await deleteDish(dish.id);

            // Enable scrolling
            const body = document.body;
            body.style.overflowX = "hidden";
            body.style.overflowY = "auto";

            window.location.assign(Routes.OUR_MENU);
        } catch (error) {
            setDeleteDishError(error.message);
        }
    };

    /**
     * Handle saving info changes
     * @param {Object} formData
     * @returns null|error
     */
    const handleInfoSubmit = async ({ name, description, thumbnail }) => {
        try {
            // Check if there is a new thumbnail or not
            if (thumbnail) {
                // Delete previous image from Cloud Storage
                await deleteImg(dish.thumbnail.path);

                // Add image to Cloud Storage
                const thumbnailData = await uploadImg(
                    "dishes",
                    restaurantName,
                    name,
                    thumbnail
                );

                // Get image url & path
                const thumbnailUrl = thumbnailData.downloadUrl;
                const thumbnailPath = thumbnailData.fullPath;

                // Update dish in Firestore
                await updateDish(
                    dish.id,
                    name,
                    description,
                    thumbnailUrl,
                    thumbnailPath
                );
            } else {
                // Update dish in Firestore
                await updateDish(
                    dish.id,
                    name,
                    description,
                    dish.thumbnail.url,
                    dish.thumbnail.path
                );
            }

            // Get dish data from Firestore and set current dish
            const updatedDish = await getDishById(dish.id);
            setDish(updatedDish);

            // Set success message
            setInfoError("");
            setInfoSuccess("This dish was updated succesfully");
        } catch (error) {
            setInfoSuccess("");
            setInfoError(error.message);
        }
    };

    const handlePricesSubmit = async () => {};

    // Get current dish info from Firestore on page load
    useEffect(() => {
        const unsubscribe = () => {
            const handleGetDishInfo = async () => {
                const dish = await getDishById(id);
                const sizes = await getSizesByRestaurant(restaurantId);
                const prices = await getPricesByDishId(dish.id);

                setDish(dish);
                setSizes(sizes);
                setPrices(prices);
                setAvailable(dish.available);
                setLoading(false);
            };

            handleGetDishInfo();
        };

        // Stop listening to changes
        unsubscribe();
    }, [
        getDishById,
        id,
        getSizesByRestaurant,
        restaurantId,
        getPricesByDishId,
    ]);

    if (!loading && !dish.name) window.location.assign(Routes.OUR_MENU);

    return (
        <div className="page page--dish-detail">
            {!loading && (
                <Fragment>
                    <div className="back-btn">
                        <Feather.ArrowLeftCircle
                            onClick={() =>
                                window.location.assign(Routes.OUR_MENU)
                            }
                            className="btn-icon"
                        />
                    </div>
                    <h1>{dish.name}</h1>
                    <div className="dish-management d-flex justify-content-between align-items-center">
                        <div className="form-item switch">
                            <label htmlFor="available">Available</label>
                            <Switch
                                checked={available}
                                onChange={handleSwitch}
                                name="available"
                                id="available"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleDeletePopup}
                            className="danger"
                        >
                            Delete dish
                        </button>
                        <Popup
                            popupId="delete-dish"
                            title="Are you sure you want to delete this dish?"
                            description={dish.name}
                            formId="delete-dish-form"
                            handleSubmit={(ev) => handleDeleteDish(ev)}
                        >
                            <span className="error">{deleteDishError}</span>
                        </Popup>
                    </div>
                    <div className="dish-container row">
                        <div className="section col-12 col-md-6">
                            <h2>Edit info</h2>
                            <DishInfoForm
                                initialValues={{
                                    name: dish.name,
                                    description: dish.description,
                                    thumbnail: dish.thumbnail.url,
                                }}
                                handleSubmit={handleInfoSubmit}
                            />
                            <span className="error">{infoError}</span>
                            <span className="success">{infoSuccess}</span>
                        </div>
                        <div className="section col-12 col-md-6">
                            <h2>Edit prices</h2>
                            <DishPricesForm
                                sizes={sizes}
                                dish={dish}
                                handleSubmit={handlePricesSubmit}
                            />
                            <span className="error">{pricesError}</span>
                            <span className="success">{pricesSuccess}</span>
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};
