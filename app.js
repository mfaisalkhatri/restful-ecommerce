import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import { swaggerUi, swaggerSpec } from "./swagger.js";

const app = express();
const port = 3004;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  console.log("Visit /swagger.json to generate and download Swagger JSON file");
});

app.use(express.json());

let orders = [];
let nextOrderId = 1;
const SECRET_KEY = "Secret999#";

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user_id
 *         - product_id
 *         - product_name
 *         - product_amount
 *         - qty
 *         - tax_amt
 *         - total_amt
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user
 *         product_id:
 *           type: string
 *           description: The ID of the product
 *         product_name:
 *           type: string
 *           description: The name of the product
 *         product_amount:
 *           type: number
 *           description: The price of the product
 *         qty:
 *           type: integer
 *           description: The quantity of the product
 *         tax_amt:
 *           type: number
 *           description: The tax amount for the order
 *         total_amt:
 *           type: number
 *           description: The total amount for the order
 */

/**
 * @swagger
 * /addOrder:
 *   post:
 *     summary: Add a list of orders
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Orders added successfully, Added orders are returned in response.
 *       400:
 *         description: "Request Payload must be an array of orders \n\n
 *                      Each order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!"
 */
app.post("/addOrder", (req, res) => {
  const orderArray = req.body;

  if (!Array.isArray(orderArray)) {
    return res.status(400).json({
      message: "Request Payload must be an array of orders!",
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
          "Each order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!",
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

/**
 * @swagger
 * /getAllOrders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders fetched successfully!
 *       404:
 *         description: No order found!!
 */
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

/**
 * @swagger
 * /getOrder:
 *   get:
 *     summary: Get order by various parameters
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: The order ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Order found!! All available orders are returned in response.
 *       404:
 *         description: No order found with the given parameters!
 */
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

/**
 * @swagger
 * /updateOrder/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: "Failed to authenticate token! \n\n
 *                       Invalid request, no data provided to update!"
 *       403:
 *         description: Forbidden! Token is missing!
 *       404:
 *         description: No order found with the given ID
 */
app.put("/updateOrder/:id", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }
    const id = parseInt(req.params.id);
    const updatedDetails = req.body;

    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        message: "No Order found with the given Order Id!",
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
          "Each Order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!",
      });
    }

    orders[orderIndex] = { id: id, ...updatedDetails };

    res.status(200).json({
      message: "Order updated successfully!",
      order: orders[orderIndex],
    });
  });
});

/**
 * @swagger
 * /partialUpdateOrder/{id}:
 *   patch:
 *     summary: Partially update an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: A partial object containing the fields to update
 *     responses:
 *       200:
 *         description: Order updated successfully, updated order is returned in response.
 *       400:
 *         description: "Failed to authenticate token! \n\n
 *                       Invalid request, no data provided to update!"
 *       403:
 *         description: Forbidden! Token is missing!
 *       404:
 *         description: No Order found with the given Order Id!
 */
app.patch("/partialUpdateOrder/:id", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }

    const id = parseInt(req.params.id);
    const updatedField = req.body;

    if (!updatedField || Object.keys(updatedField).length === 0) {
      return res.status(400).json({
        message: "Invalid request, no data provided to update!",
      });
    }

    const order = orders.find((order) => order.id === id);

    if (!order) {
      return res.status(404).json({
        message: "No Order found with the given Order Id!",
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

/**
 * @swagger
 * /deleteOrder/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       204:
 *         description: Order deleted successfully, nothing is returned in response.
 *       400:
 *         description: Failed to authenticate token!
 *       403:
 *         description: Forbidden! Token is missing!
 *       404:
 *         description: No Order found with the given Order Id!!"
 */
app.delete("/deleteOrder/:id", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Forbidden! Token is missing!",
    });
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token!" });
    }

    const id = parseInt(req.params.id);
    const orderIndex = orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        message: "No Order found with the given Order Id!",
      });
    }

    orders.splice(orderIndex, 1);
    res.status(204).send("Order deleted successfully");
  });
});

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Authentication successful, token returned
 *       400:
 *         description: Username and Password is required for authentication!
 *       401:
 *         description: Authentication Failed! Invalid username or password!
 */
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

app.get("/swagger.json", (req, res) => {
  const jsonContent = JSON.stringify(swaggerSpec, null, 2);

  fs.writeFile("swagger-output.json", jsonContent, "utf8", (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error writing Swagger JSON file", error: err });
    }
    res
      .status(200)
      .json({
        message: "Swagger JSON file generated successfully",
        swaggerSpec,
      });
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check of the server
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'Up and Running'
 *                 uptime:
 *                   type: number
 *                   example: 123456
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Server is down
 */
app.get('/health', (req, res) => {
  try {
      const healthCheck = {
          status: 'UP and Running',
          uptime: process.uptime() + " seconds",
          timestamp: new Date().toISOString(),
      };
      res.status(200).json(healthCheck);
  } catch (error) {
      res.status(500).json({ status: 'DOWN and OUT!', error });
  }
});