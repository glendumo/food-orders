// Imports
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as Feather from "react-feather";

import * as Routes from "../../routes";
import { useAuth, useFirestore } from "../../services";

import "./Header.scss";

// Header content
const Header = ({ children }) => {
    // Defining variables and states
    const { logout } = useAuth();
    const { type, loading } = useFirestore();

    const [showNav, setShowNav] = useState(false);

    // Redirect after login
    if (!loading && window.location.pathname === Routes.REGISTER_LOGIN) {
        if (type === "user") return window.location.assign(Routes.MY_OVERVIEW);
        if (type === "admin")
            return window.location.assign(Routes.MANAGE_RESTAURANTS);
        if (type === "restaurant") return window.location.assign(Routes.ORDERS);
    }

    // Close the navbar
    const closeNavbar = () => {
        setShowNav(false);
    };

    return (
        <header
            className={
                showNav
                    ? "app-header navbar-open fixed-top"
                    : "app-header fixed-top"
            }
        >
            <nav className="navbar navbar-expand-md container">
                <h1 className="navbar-brand">
                    {!loading && type === "logged_out" && (
                        <Link
                            to={Routes.HOME}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "user" && (
                        <Link
                            to={Routes.MY_OVERVIEW}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "restaurant" && (
                        <Link
                            to={Routes.ORDERS}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <span>O</span>rders
                        </Link>
                    )}
                    {!loading && type === "admin" && (
                        <Link
                            to={Routes.MANAGE_RESTAURANTS}
                            className="brand"
                            onClick={closeNavbar}
                        >
                            <span>F</span>ood
                            <span>O</span>rders
                        </Link>
                    )}
                </h1>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setShowNav(!showNav)}
                >
                    <span className="navbar-toggler-icon">
                        {showNav ? <Feather.X /> : <Feather.Menu />}
                    </span>
                </button>

                <div
                    className={
                        showNav
                            ? "collapse show navbar-collapse"
                            : "collapse navbar-collapse"
                    }
                >
                    {!loading && type === "logged_out" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.REGISTER_LOGIN}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Register/Login
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {!loading && type === "user" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_OVERVIEW}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    My overview
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ORDERS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    My orders
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.RESTAURANTS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Restaurants
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {!loading && type === "restaurant" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.ORDERS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Orders
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.OUR_MENU}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Our menu
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    {!loading && type === "admin" && (
                        <ul className="navbar-nav mr-auto justify-content-end flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MANAGE_RESTAURANTS}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Restaurants
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MANAGE_DISHES}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    Dishes
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.MY_ACCOUNT}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={closeNavbar}
                                >
                                    <Feather.User /> My account
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={Routes.HOME}
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={() => {
                                        closeNavbar();
                                        logout();
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
