const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const port = 3004;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(express.json());

let orders = [];
let nextOrderId = 1;
const SECRET_KEY = "Secret999#";

app.post("/addOrder", (req, res) => {
  const orderArray = req.body;

  if (!Array.isArray(orderArray)) {
    return res.status(400).json({
      message: "Request Payload must be an array of orders.",
    });
  }

  for (let order of orderArray) {
    if (
      !order.user_id ||
      !order.product_id ||
      !order.product_name ||
      !order.product_amount ||
      !order.qty ||
      !order.tax_amt ||
      !order.total_amt
    ) {
      return res.status(400).json({
        message:
          "Each order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt",
      });
    }

    const id = nextOrderId++;
    orders.push({ id, ...order });
  }

  res.status(201).json({
    message: "Orders added successfully!",
    orders,
  });
});

app.get("/getAllOrders", (req, res) => {
  if (orders.length > 0) {
    res.status(200).json({
      message: "Orders fetched successfully!",
      orders,
    });
  } else {
    res.status(404).json({ message: "No Order found!!" });
  }
});

app.get("/getOrder", (req, res) => {
  const { id, user_id, product_id } = req.query;

  let filteredOrders = orders;

  if (id) {
    filteredOrders = filteredOrders.filter(
      (order) => order.id === parseInt(id)
    );
  }

  if (user_id) {
    filteredOrders = filteredOrders.filter(
      (order) => order.user_id === user_id
    );
  }

  if (product_id) {
    filteredOrders = filteredOrders.filter(
      (order) => order.product_id === product_id
    );
  }

  if (filteredOrders.length > 0) {
    res.status(200).json({
      message: "Order found!!",
      orders: filteredOrders,
    });
  } else {
    res
      .status(404)
      .json({ message: "No Order found with the given parameters!" });
  }
});

app.put("/updateOrder/:id", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }
    const id = parseInt(req.params.id);
    const updatedDetails = req.body;

    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        message: "No Order found with the given Order Id!!",
      });
    }

    if (
      !updatedDetails.user_id ||
      !updatedDetails.product_id ||
      !updatedDetails.product_name ||
      !updatedDetails.product_amount ||
      !updatedDetails.qty ||
      !updatedDetails.tax_amt ||
      !updatedDetails.total_amt
    ) {
      return res.status(400).json({
        message:
          "Each Order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt.",
      });
    }

    orders[orderIndex] = { id: id, ...updatedDetails };

    res.status(200).json({
      message: "Order updated successfully!!",
      order: orders[orderIndex],
    });
  });
});

app.patch("/partialUpdateOrder/:id", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }

    const id = parseInt(req.params.id);
    const updatedField = req.body;

    if (!updatedField || Object.keys(updatedField).length === 0) {
      return res.status(400).json({
        message: "Invalid request, no data provided to update.",
      });
    }

    const order = orders.find((order) => order.id === id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    Object.keys(updatedField).forEach((key) => {
      if (order.hasOwnProperty(key)) {
        order[key] = updatedField[key];
      }
    });

    res.status(200).json({
      message: "Order updated successfully!",
      order,
    });
  });
});

app.delete("/deleteOrder/:id", (req, res) => {
  
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }


  const id = parseInt(req.params.id);
  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({
      message: "No Order found with the given Order Id!!",
    });
  }

  orders.splice(orderIndex, 1);
  res.status(204).send("Order deleted successfully");
});
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and Password is required for authentication!",
    });
  }

  if (username === "admin" && password === "secretPass123") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({
      message: "Authentication Successful!",
      token,
    });
  } else {
    res.status(401).json({
      message: "Authentication Failed! Invalid username or password!",
    });
  }
});
