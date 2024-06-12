import Link from "next/link";
import React, { useState, useEffect } from "react";
import sal from "sal.js";

const SinglePrice = ({ data, increasePrice, parentClass }) => {
  const [price, setPrice] = React.useState(data.price);
  const [quantity, setQuantity] = React.useState(1);
  const [tax, setTax] = React.useState(0);

  useEffect(() => {
    sal();

    if (increasePrice) {
      setPrice((data.price * 12 * 0.8).toFixed(0));
      setQuantity(12);
      setTax(2.99);
    }

    // console.log("data", [data.title, data.price, price, increasePrice]);

    const cards = document.querySelectorAll(".bg-flashlight");

    cards.forEach((bgflashlight) => {
      bgflashlight.onmousemove = function (e) {
        let x = e.pageX - bgflashlight.offsetLeft;
        let y = e.pageY - bgflashlight.offsetTop;

        bgflashlight.style.setProperty("--x", x + "px");
        bgflashlight.style.setProperty("--y", y + "px");
      };
    });
  }, []);

  const choosePlan = () => {
    try {
      // update price
      data.price = price;
      data.quantity = quantity;
      data.tax = tax;

      // save the plan on local storage
      localStorage.setItem("plan", JSON.stringify(data));

      // redirect to checkout page
      window.location.href = "/checkout";
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className={`${parentClass} ${!increasePrice ? "mt--30" : ""}`}>
        <div
          className={`rainbow-pricing style-cre8tegpt ${
            data.price > 50 ? "active" : ""
          }`}
        >
          <div className="pricing-table-inner bg-flashlight">
            <div className="pricing-top">
              <div className="pricing-header">
                <h4 className="title">{data.title}</h4>
                <div className="pricing">
                  <div className="price-wrapper">
                    {data.price === 0 ? (
                      ""
                    ) : data.text === "" ? (
                      <span className="currency">$</span>
                    ) : (
                      ""
                    )}

                    {data.price === 0 ? (
                      <span className="price">Free</span>
                    ) : data.text ? (
                      <span className="price sm-text">{data.text} </span>
                    ) : (
                      <span className="price">
                        {price}
                      </span>
                      // <span className="price">
                      //   {increasePrice
                      //     ? data.price <= 50
                      //       ? data.price + 250
                      //       : data.price + 400
                      //     : data.price}
                      // </span>
                    )}
                  </div>
                  <span className="subtitle">{data.subTitle}</span>
                </div>
                <div className="separator-animated animated-true mt--30 mb--30"></div>
              </div>
              <div className="pricing-body">
                <ul className="list-style--1">
                  {data.subItem.map((innerData, innerIndex) => (
                    <li key={innerIndex}>
                      <i
                        className={`feather-${
                          innerData.isMinus ? "minus" : "check"
                        }-circle pe-2`}
                      ></i>
                      {innerData.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pricing-footer">
              {data.price === 0 ? (
                <button type="button" className="btn-default btn-border" onClick={choosePlan}>
                  Try it now
                </button>
              ) : data.title === "Enterprise" ? (
                <button type="button" className={`btn-default btn-border`} onClick={choosePlan}>
                  Contact Sales
                </button>
              ) : (
                <button type="button"
                  className={`${
                    data.title === "Business"
                      ? "btn-default btn-border"
                      : "btn-default"
                  }`}
                  onClick={choosePlan}
                >
                  Purchase Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePrice;
