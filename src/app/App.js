// Imports
import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import {
    AuthProvider,
    FirebaseProvider,
    FirestoreProvider,
    StorageProvider,
} from "./services";
import { RouteWithLayout } from "./utilities";
import { BaseLayout } from "./layouts";

import * as Pages from "./pages";
import * as Routes from "./routes";

import "./App.scss";

// Firebase, Firestore and Auth Providers + App Router
function App() {
    return (
        <div className="app">
            <FirebaseProvider>
                <AuthProvider>
                    <FirestoreProvider>
                        <StorageProvider>
                            <Router>
                                <Switch>
                                    {/* General pages */}
                                    <RouteWithLayout
                                        exact
                                        path={Routes.LANDING}
                                        layout={BaseLayout}
                                        component={Pages.HomePage}
                                    />
                                    <Redirect
                                        from={Routes.HOME}
                                        to={Routes.LANDING}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.REGISTER_LOGIN}
                                        layout={BaseLayout}
                                        component={Pages.RegisterLoginPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.FORGOT_PASSWORD}
                                        layout={BaseLayout}
                                        component={Pages.ForgotPasswordPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.RESET_PASSWORD}
                                        layout={BaseLayout}
                                        component={Pages.ResetPasswordPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MY_ACCOUNT}
                                        layout={BaseLayout}
                                        component={Pages.MyAccountPage}
                                    />

                                    {/* User pages */}
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MY_ORDERS}
                                        layout={BaseLayout}
                                        component={Pages.MyOrdersPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MY_ORDER_DETAIL}
                                        layout={BaseLayout}
                                        component={Pages.MyOrderDetailPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.RESTAURANTS}
                                        layout={BaseLayout}
                                        component={Pages.RestaurantsPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.RESTAURANT_MENU}
                                        layout={BaseLayout}
                                        component={Pages.RestaurantMenuPage}
                                    />

                                    {/* Restaurant pages */}
                                    <RouteWithLayout
                                        exact
                                        path={Routes.ORDERS}
                                        layout={BaseLayout}
                                        component={Pages.OrdersPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.ORDER_DETAIL}
                                        layout={BaseLayout}
                                        component={Pages.OrderDetailPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.OUR_MENU}
                                        layout={BaseLayout}
                                        component={Pages.OurMenuPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.NEW_DISH}
                                        layout={BaseLayout}
                                        component={Pages.NewDishPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MANAGE_SIZES}
                                        layout={BaseLayout}
                                        component={Pages.ManageSizesPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.DISH_DETAIL}
                                        layout={BaseLayout}
                                        component={Pages.DishDetailPage}
                                    />

                                    {/* Admin pages */}
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MANAGE_RESTAURANTS}
                                        layout={BaseLayout}
                                        component={Pages.ManageRestaurantsPage}
                                    />
                                    <RouteWithLayout
                                        exact
                                        path={Routes.MANAGE_DISHES}
                                        layout={BaseLayout}
                                        component={Pages.ManageDishesPage}
                                    />

                                    {/* Not Found page */}
                                    <RouteWithLayout
                                        layout={BaseLayout}
                                        component={Pages.NotFoundPage}
                                    />
                                </Switch>
                            </Router>
                        </StorageProvider>
                    </FirestoreProvider>
                </AuthProvider>
            </FirebaseProvider>
        </div>
    );
}

export default App;
