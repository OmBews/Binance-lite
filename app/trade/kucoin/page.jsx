"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useGlobalContext } from "../../Context";
import axios from "axios";
import { toast } from "react-toastify";
import { makeOptions } from "../../helpers/functions";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CoinData from "@/app/components/CoinData";
import Loader from "@/app/components/Loader";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const trades = ["market", "limit", "stop_limit", "stop_market"];
const sides = ["buy", "sell"];

const futureTrades = ["market", "limit", "stop_limit", "stop_market"];
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};
function valuetext(value) {
  return `${value}x`;
}
export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleValueChange = (event, newValue) => {
    setOrder({
      symbol: "",
      quantity: "",
      type: "",
      quoteOrderQty: "",
      side: "",
      user: "",
      stopPrice: "",
      price: "",
    });
    setValue(newValue);
  };
  const handleChangeLeverage = (event, newValue) => {
    setOrder({ ...order, leverage: newValue });
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const hello = (e) => {
    console.log(e.target.value);
  };
  const [order, setOrder] = useState({
    symbol: "",
    quantity: "",
    type: "",
    quoteOrderQty: "",
    side: "",
    user: "",
    stopPrice: "",
    price: "",
    leverage: 1,
  });
  const [users, setUsers] = useState([]);
  const handleChange = (e) => {
    if (e.target.name === "price" && e.target.value !== "") {
      setOrder({
        ...order,
        quoteOrderQty: (
          parseFloat(order.quantity) * parseFloat(e.target.value)
        ).toString(),
        [e.target.name]: e.target.value,
      });
    } else {
      setOrder({ ...order, [e.target.name]: e.target.value });
    }
  };
  // const [user, setUser] = useState({ role: "admin", isSubscribed: true });
  const { setLoading, user, loading, getUserInfo } = useGlobalContext();
  const [coins, setCoins] = useState([]);
  const [futureCoins, setFutureCoins] = useState([]);
  const [tickerPrice, setTickerPrice] = useState(0);
  const tickerPriceFounder = async (e) => {
    const idx = coins.filter((c) => c.symbol === e.target.value);

    setTickerPrice(idx[0].averagePrice);
    // setLoading(true);
    setOrder({
      ...order,
      symbol: e.target.value,
    });
    // const response = await fetch("/api/ticker", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ticker: e.target.value }),
    // });
    // const data = await response.json();
    // if (data.success) {
    //   let price = parseFloat(data.tickerPrice);
    //   setTickerPrice(price);
    // }
    // setLoading(false);
  };
  const FutureTickerPriceFounder = async (e) => {
    const idx = futureCoins.filter((c) => c.symbol === e.target.value);
    setTickerPrice(idx[0].indexPrice);
    // setLoading(true);
    setOrder({
      ...order,
      symbol: e.target.value,
    });
    // const response = await fetch("/api/ticker", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ticker: e.target.value }),
    // });
    // const data = await response.json();
    // if (data.success) {
    //   let price = parseFloat(data.tickerPrice);
    //   setTickerPrice(price);
    // }
    // setLoading(false);
  };
  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/subscribers", {
        headers: {
          token: localStorage.getItem("auth-token"),
          exchange: "kucoin",
        },
      });

      console.log(data);
      if (data.success) {
        if (data.subscribers.length > 0) {
          const newArray = [...data.subscribers, { username: "All" }];
          console.log(newArray);
          setUsers(newArray);
          setCoins(data.tickers);
          setFutureCoins(data.tickersFuture);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const specialHandler = (e) => {
    if (order.price !== "") {
      if (e.target.name === "quantity")
        setOrder({
          ...order,
          quantity: e.target.value,
          quoteOrderQty: (
            parseFloat(e.target.value) * parseFloat(order.price)
          ).toString(),
        });
      if (e.target.name === "quoteOrderQty")
        setOrder({
          ...order,
          quoteOrderQty: e.target.value,
          quantity: (
            parseFloat(e.target.value) / parseFloat(order.price)
          ).toString(),
        });
    } else {
      if (e.target.name === "quantity")
        setOrder({
          ...order,
          quantity: e.target.value,
          quoteOrderQty: (parseFloat(e.target.value) * tickerPrice).toString(),
        });
      if (e.target.name === "quoteOrderQty")
        setOrder({
          ...order,
          quoteOrderQty: e.target.value,
          quantity: (parseFloat(e.target.value) / tickerPrice).toString(),
        });
    }
  };
  const customizeOptions = () => {
    const { quantity, quoteOrderQty, stopPrice, price, leverage } = order;
    return {
      quantity: parseFloat(parseFloat(quantity).toFixed(3)),
      price: parseFloat(parseFloat(price)),
      stopPrice: parseFloat(parseFloat(stopPrice)),
      quoteOrderQty: parseFloat(parseFloat(quoteOrderQty).toFixed(3)),
      leverage: parseFloat(leverage),
    };
  };

  const trs = ["spot", "future"];
  const orderHandler = async (e) => {
    console.log(order);
    e.preventDefault();
    const { quantity, quoteOrderQty, type, stopPrice, price, leverage } = order;
    if (quantity === "" )
      return toast.error("please! fill all the fields");
    if((type === "stop_limit" || type === 'limit' )&& price === '')
    return toast.error("please! fill all the fields");
    if (
      (stopPrice === "" && type === "stop_limit") ||
      (stopPrice === "" && type === "stop_market")
    )
      return toast.error("please! fill all the fields");
    setLoading(true);
    const options = customizeOptions();
    let body;
    if (type === "stop_limit" || type === "stop_market") {
      let tmp = type;
      body = { ...order, ...options, type: tmp.split("_")[1] };
    } else {
      body = { ...order, ...options };
    }
    try {
      let url = `/api/kucoin/${trs[value]}/order`;
      console.log(body);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setOrder({
          symbol: "",
          quantity: "",
          type: "",
          quoteOrderQty: "",
          side: "",
          user: "",
          stopPrice: "",
          price: "",
        });
        setTickerPrice(0)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AdminLayout>
      <div className="w-full mx-auto">
        <Box
          sx={{
            bgcolor: "background.paper",
            width: "85%",
            height: "85vh",
            margin: "3rem auto",
            overflowY: "scroll",
          }}
        >
          <AppBar position="static" className="sticky top-0 z-[50]">
            <Tabs
              value={value}
              onChange={handleValueChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="SPOT" {...a11yProps(0)} />
              <Tab label="FUTURE" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <h3 className="text-3xl mt-4 text-center font-medium">KuCoin</h3>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <div value={value} index={0} dir={theme.direction}>
              {loading ? (
                <Loader />
              ) : (
                <div className="w-4/5 mx-auto mt-4">
                  {users?.length <= 0 ? (
                    <div className="h-[50vh] flex items-center justify-center">
                      <h3 className="text-2xl text-gray-600 font-medium">
                        No Subscribers to Start trade
                      </h3>
                    </div>
                  ) : (
                    users?.length > 0 && (
                      <form onSubmit={orderHandler} className="mt-4 w-full">
                        <div className="flex sm:flex-row flex-col w-full gap-4 my-8">
                          <div className="w-full sm:w-1/2">
                            <div className="w-full mb-4 sm:mb-8">
                              <FormControl fullWidth>
                                <InputLabel id="user">User *</InputLabel>
                                <Select
                                  labelId="user"
                                  id="user"
                                  label="User"
                                  name="user"
                                  value={order.user}
                                  onChange={handleChange}
                                >
                                  {users.map((user, idx) => {
                                    return (
                                      <MenuItem
                                        key={user.username}
                                        value={user.username}
                                      >
                                        {user.username}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>

                            <div className="w-full mb-2 sm:mb-4">
                              <FormControl fullWidth>
                                <InputLabel id="symbol">Coin *</InputLabel>
                                <Select
                                  labelId="symbol"
                                  id="symbol"
                                  label="Symbol"
                                  name="symbol"
                                  value={order.symbol}
                                  onChange={tickerPriceFounder}
                                >
                                  {coins?.map((symb, idx) => {
                                    return (
                                      <MenuItem
                                        key={symb.symbol}
                                        value={symb.symbol}
                                      >
                                        {symb.symbol}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="w-full text-left hidden sm:block mb-4 sm:my-8">
                              <TextField
                                disabled={order.symbol === "" ? true : false}
                                className="!text-white w-3/5 ml-auto !border-white"
                                id="quoteOrderQty"
                                name="quoteOrderQty"
                                label={`Amount(USDT)`}
                                value={order.quoteOrderQty}
                                onChange={specialHandler}
                                // color="white"
                                variant="outlined"
                              />
                            </div>
                            <div className="w-full text-left hidden sm:block mb-6 sm:my-8">
                              <TextField
                                disabled={order.symbol === "" ? true : false}
                                className="!text-white w-3/5 !border-white"
                                id="quantity"
                                name="quantity"
                                label={`Quantity(${
                                  order.symbol !== "" ? order.symbol : "Coin"
                                })`}
                                value={order.quantity}
                                onChange={specialHandler}
                                autoComplete="off"
                                type="number"
                                // color="white"
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div className="w-full sm:w-1/2">
                            <div className="mb-4 sm:mb-8">
                              <FormControl fullWidth>
                                <InputLabel id="side">Action *</InputLabel>
                                <Select
                                  labelId="side"
                                  id="side"
                                  label="Action"
                                  name="side"
                                  value={order.side}
                                  onChange={handleChange}
                                >
                                  {sides.map((side, idx) => {
                                    return (
                                      <MenuItem key={side} value={side}>
                                        {side.toUpperCase()}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="w-full mb-4 sm:mb-8">
                              <FormControl fullWidth>
                                <InputLabel id="type_id">Type *</InputLabel>
                                <Select
                                  labelId="type_id"
                                  id="type"
                                  label="Type"
                                  name="type"
                                  value={order.type}
                                  onChange={handleChange}
                                >
                                  {trades.map((trade, idx) => {
                                    return (
                                      <MenuItem key={trade} value={trade}>
                                        {trade
                                          .split("_")
                                          .join(" ")
                                          .toUpperCase()}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>

                            {order.type === "market" && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={true}
                                    className="!text-white text-center  !border-white"
                                    id="market"
                                    name="market"
                                    label="Best Market Price"
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                            )}
                            {(order.type === "stop_limit" ||
                              order.type === "stop_market") && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={
                                      order.symbol === "" ? true : false
                                    }
                                    className="!text-white text-center  !border-white"
                                    id="stopPrice"
                                    onChange={handleChange}
                                    name="stopPrice"
                                    label="Stop Price"
                                    variant="outlined"
                                    type="number"
                                    value={order.stopPrice}
                                    autoComplete="off"
                                  />
                                </FormControl>
                              </div>
                            )}
                            {(order.type === "stop_limit" ||
                              order.type === "limit") && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={
                                      order.symbol === "" ? true : false
                                    }
                                    className="!text-white text-center  !border-white"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    variant="outlined"
                                    onChange={handleChange}
                                    type="number"
                                    autoComplete="off"
                                    value={order.price}
                                  />
                                </FormControl>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="sm:w-1/2 w-full flex  gap-8">
                          <div className="w-1/2 block sm:hidden mb-4 sm:my-8">
                            <TextField
                              disabled={order.symbol === "" ? true : false}
                              className="!text-white w-full !border-white"
                              id="quoteOrderQty"
                              name="quoteOrderQty"
                              label={`Amount(USDT)`}
                              value={order.quoteOrderQty}
                              onChange={specialHandler}
                              // color="white"
                              variant="outlined"
                            />
                          </div>
                          <div className="w-1/2 block sm:hidden mb-4 sm:my-8">
                            <TextField
                              disabled={order.symbol === "" ? true : false}
                              className="!text-white w-full !border-white"
                              id="quantity"
                              name="quantity"
                              label={`Quantity(${
                                order.symbol !== "" ? order.symbol : "Coin"
                              })`}
                              value={order.quantity}
                              onChange={specialHandler}
                              autoComplete="off"
                              type="number"
                              // color="white"
                              variant="outlined"
                            />
                          </div>
                        </div>
                        <div className="w-full my-4 text-center">
                          <Button
                            variant="contained"
                            type="submit"
                            className="tracking-wider  w-3/4 sm:w-1/2 md:w-1/4 bg-blue-400 hover:bg-blue-500 transition-all duration-200"
                            size="large"
                          >
                            Order
                          </Button>
                        </div>
                      </form>
                    )
                  )}
                </div>
              )}
            </div>
            <div value={value} index={1} dir={theme.direction}>
              {loading ? (
                <Loader />
              ) : (
                <div className="w-4/5 mx-auto mt-4">
                  {!loading && users?.length === 0 ? (
                    <div className="h-[50vh] flex items-center justify-center">
                      <h3 className="text-2xl text-gray-600 font-medium">
                        No Subscribers to Start trade
                      </h3>
                    </div>
                  ) : (
                    users && (
                      <form onSubmit={orderHandler} className="mt-4 w-full">
                        <div className="flex sm:flex-row flex-col w-full h gap-4 my-8">
                          <div className="sm:w-1/2 w-full">
                            <div className="w-full mb-4 sm:mb-8">
                              <FormControl fullWidth>
                                <InputLabel id="user">User *</InputLabel>
                                <Select
                                  labelId="user"
                                  id="user"
                                  label="User"
                                  name="user"
                                  value={order.user}
                                  onChange={handleChange}
                                >
                                  {users.map((user, idx) => {
                                    return (
                                      <MenuItem
                                        key={user.username}
                                        value={user.username}
                                      >
                                        {user.username}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="w-full mb-2 sm:mb-4">
                              <FormControl fullWidth>
                                <InputLabel id="symbol">Coin *</InputLabel>
                                <Select
                                  labelId="symbol"
                                  id="symbol"
                                  label="Symbol"
                                  name="symbol"
                                  value={order.symbol}
                                  onChange={FutureTickerPriceFounder}
                                >
                                  {futureCoins?.map((symb, idx) => {
                                    return (
                                      <MenuItem
                                        key={symb.symbol}
                                        value={symb.symbol}
                                      >
                                        {symb.symbol}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="w-full text-left hidden sm:block mb-2 sm:my-4">
                              <TextField
                                disabled={order.symbol === "" ? true : false}
                                className="!text-white w-3/5 !border-white"
                                id="quoteOrderQty"
                                name="quoteOrderQty"
                                label={`Amount(USDT)`}
                                value={order.quoteOrderQty}
                                onChange={specialHandler}
                                // color="white"
                                variant="outlined"
                              />
                            </div>
                            <div className="w-full text-left hidden sm:block mb-2 sm:my-4">
                              <TextField
                                disabled={order.symbol === "" ? true : false}
                                className="!text-white w-3/5 !border-white"
                                id="quantity"
                                name="quantity"
                                label={`Quantity(${
                                  order.symbol !== "" ? order.symbol : "Coin"
                                })`}
                                value={order.quantity}
                                onChange={specialHandler}
                                autoComplete="off"
                                type="number"
                                // color="white"
                                variant="outlined"
                              />
                            </div>
                            <div className="w-full md:w-1/2 hidden sm:block mb-2 sm:my-4">
                              <Slider
                                getAriaLabel={() => "Temperature range"}
                                value={order.leverage}
                                onChange={handleChangeLeverage}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                min={1}
                                max={75}
                              />
                            </div>
                          </div>
                          <div className="w-full sm:w-1/2">
                            <div className="w-full mb-4 sm:mb-8">
                              <FormControl fullWidth>
                                <InputLabel id="side">Action *</InputLabel>
                                <Select
                                  labelId="side"
                                  id="side"
                                  label="Action"
                                  name="side"
                                  value={order.side}
                                  onChange={handleChange}
                                >
                                  {sides.map((side, idx) => {
                                    return (
                                      <MenuItem key={side} value={side}>
                                        {side === "buy"
                                          ? side?.toUpperCase() + " / LONG"
                                          : side?.toUpperCase() + " / SHORT"}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="w-full mb-2 sm:mb-4">
                              <FormControl fullWidth>
                                <InputLabel id="type_id">Type *</InputLabel>
                                <Select
                                  labelId="type_id"
                                  id="type"
                                  label="Type"
                                  name="type"
                                  value={order.type}
                                  onChange={handleChange}
                                >
                                  {futureTrades.map((trade, idx) => {
                                    return (
                                      <MenuItem key={trade} value={trade}>
                                        {trade
                                          .split("_")
                                          .join(" ")
                                          .toUpperCase()}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                            {order.type === "market" && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={true}
                                    className="!text-white text-center  !border-white"
                                    id="market"
                                    name="market"
                                    label="Best Market Price"
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                            )}
                            {(order.type === "stop_market" ||
                              order.type === "stop_limit") && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={
                                      order.symbol === "" ? true : false
                                    }
                                    className="!text-white text-center  !border-white"
                                    id="stopPrice"
                                    onChange={handleChange}
                                    name="stopPrice"
                                    label="Stop Price"
                                    variant="outlined"
                                    type="number"
                                    value={order.stopPrice}
                                    autoComplete="off"
                                  />
                                </FormControl>
                              </div>
                            )}
                            {/* {order.type === "TRAILING_STOP_MARKET" && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={
                                      order.symbol === "" ? true : false
                                    }
                                    className="!text-white text-center  !border-white"
                                    id="callbackRate"
                                    onChange={handleChange}
                                    name="callbackRate"
                                    label="CallBack Rate"
                                    variant="outlined"
                                    type="number"
                                    value={order.callbackRate}
                                    autoComplete="off"
                                  />
                                </FormControl>
                              </div>
                            )} */}
                            {(order.type === "limit" ||
                              order.type === "stop_limit") && (
                              <div className="w-full mb-4 sm:mb-8">
                                <FormControl fullWidth>
                                  <TextField
                                    disabled={
                                      order.symbol === "" ? true : false
                                    }
                                    className="!text-white text-center  !border-white"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    variant="outlined"
                                    onChange={handleChange}
                                    type="number"
                                    autoComplete="off"
                                    value={order.price}
                                  />
                                </FormControl>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="sm:w-1/2 w-full flex gap-8">
                          <div className="w-1/2 block sm:hidden mb-4 sm:my-8">
                            <TextField
                              disabled={order.symbol === "" ? true : false}
                              className="!text-white w-full !border-white"
                              id="quoteOrderQty"
                              name="quoteOrderQty"
                              label={`Amount(USDT)`}
                              value={order.quoteOrderQty}
                              onChange={specialHandler}
                              // color="white"
                              variant="outlined"
                            />
                          </div>
                          <div className="w-1/2 block sm:hidden mb-4 sm:my-8">
                            <TextField
                              disabled={order.symbol === "" ? true : false}
                              className="!text-white w-full !border-white"
                              id="quantity"
                              name="quantity"
                              label={`Quantity(${
                                order.symbol !== "" ? order.symbol : "Coin"
                              })`}
                              value={order.quantity}
                              onChange={specialHandler}
                              autoComplete="off"
                              type="number"
                              // color="white"
                              variant="outlined"
                            />
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2 block sm:hidden mb-4 sm:my-8">
                          <Slider
                            getAriaLabel={() => "Leverage"}
                            value={order.leverage}
                            onChange={handleChangeLeverage}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            min={1}
                            max={75}
                          />
                        </div>
                        <div className="w-full my-4 text-center">
                          <Button
                            variant="contained"
                            type="submit"
                            className="tracking-wider w-3/4 sm:w-1/2 md:w-1/4 mx-auto bg-blue-400 hover:bg-blue-500 transition-all duration-200"
                            size="large"
                          >
                            Order
                          </Button>
                        </div>
                      </form>
                    )
                  )}
                </div>
              )}
            </div>
          </SwipeableViews>
        </Box>
      </div>
    </AdminLayout>
  );
}
