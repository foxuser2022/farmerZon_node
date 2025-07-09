import Order from "../models/Order.schema.js";
import Tracking from "../models/Tracking.schema.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, tracking } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ message: "orderStatus is required" });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.sellerId) !== String(req.user.userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }



    if (orderStatus === "Shipped" && !order.estimatedDelivery) {
      if (!tracking || !tracking.deliveryPerson || !tracking.deliveryPhone || !tracking.estimatedDelivery) {
        return res.status(400).json({ message: "Tracking fields are required for shipped status" });
      }
      // Check for duplicate shipped status
      const duplicate = await Tracking.findOne({ order: order._id, status: orderStatus });
      if (duplicate) {
        return res.status(409).json({ message: `Tracking entry with status '${orderStatus}' already exists for this order.` });
      }
      // Create tracking entry for shipped
      const trackingEntry = await Tracking.create({
        trackingNumber: order.trackingNumber || "TRK" + Date.now() + Math.floor(Math.random() * 1000),
        order: order._id,
        status: orderStatus,
        note: tracking.note || "",
        deliveryPerson: tracking.deliveryPerson,
        deliveryPhone: tracking.deliveryPhone,
        vehicleNumber: tracking.vehicleNumber || order.vehicleNumber,
        updatedAt: new Date(),
      });
      // Update order fields
      order.orderStatus = orderStatus;
      order.deliveryPerson = tracking.deliveryPerson;
      order.deliveryPhone = tracking.deliveryPhone;
      order.vehicleNumber = tracking.vehicleNumber;
      order.estimatedDelivery = tracking.estimatedDelivery;
      await order.save();
      return res.status(200).json({ success: true, order, tracking: trackingEntry });
    } else {
      // Special statuses that should only update Tracking, not Order
      const trackingOnlyStatuses = ['Nearest-Store', 'In-your-area', 'At-your-doorstep'];

      if (trackingOnlyStatuses.includes(orderStatus)) {
        // Check for duplicate tracking entry
        const duplicate = await Tracking.findOne({ order: order._id, status: orderStatus });
        if (duplicate) {
          return res.status(409).json({ message: `Tracking entry with status '${orderStatus}' already exists for this order.` });
        }
        const trackingEntry = await Tracking.create({
          trackingNumber: order.trackingNumber || "TRK" + Date.now() + Math.floor(Math.random() * 1000),
          order: order._id,
          status: orderStatus,
          note: (tracking && tracking.note) || "",
          deliveryPerson: (tracking && tracking.deliveryPerson) || order.deliveryPerson,
          deliveryPhone: (tracking && tracking.deliveryPhone) || order.deliveryPhone,
          vehicleNumber: (tracking && tracking.vehicleNumber) || order.vehicleNumber,
          updatedAt: new Date(),
        });
        return res.status(200).json({ success: true, tracking: trackingEntry });
      }
      // For all other status updates (including shipped if already set), just update status and add tracking entry if not duplicate
      const duplicate = await Tracking.findOne({ order: order._id, status: orderStatus });
      if (duplicate) {
        return res.status(409).json({ message: `Tracking entry with status '${orderStatus}' already exists for this order.` });
      }
      const trackingEntry = await Tracking.create({
        trackingNumber: order.trackingNumber || "TRK" + Date.now() + Math.floor(Math.random() * 1000),
        order: order._id,
        status: orderStatus,
        note: (tracking && tracking.note) || "",
        deliveryPerson: (tracking && tracking.deliveryPerson) || order.deliveryPerson,
        deliveryPhone: (tracking && tracking.deliveryPhone) || order.deliveryPhone,
        vehicleNumber: (tracking && tracking.vehicleNumber) || order.vehicleNumber,
        updatedAt: new Date(),
      });
      order.orderStatus = orderStatus;
      // Only update delivery fields if provided
      if (tracking && tracking.deliveryPerson) order.deliveryPerson = tracking.deliveryPerson;
      if (tracking && tracking.deliveryPhone) order.deliveryPhone = tracking.deliveryPhone;
      if (tracking && tracking.vehicleNumber) order.vehicleNumber = tracking.vehicleNumber;
      if (tracking && tracking.estimatedDelivery) order.estimatedDelivery = tracking.estimatedDelivery;
      await order.save();
      return res.status(200).json({ success: true, order, tracking: trackingEntry });
    }
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get tracking info for an order
export const getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Only allow buyer to view their own order
    if (String(order.user) !== String(req.user.userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    const tracking = await Tracking.findOne({ order: order._id });
    if (!tracking) {
      return res.status(404).json({ message: "Tracking info not found" });
    }
    return res.status(200).json({ tracking });
  } catch (err) {
    console.error("getTrackingInfo error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
