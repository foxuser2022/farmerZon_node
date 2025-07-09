import Order from '../models/Order.schema.js';
import Tracking from '../models/Tracking.schema.js';

// Update order status (with tracking details if shipped)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, tracking } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ message: 'orderStatus is required' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Only allow seller to update their own order
    if (String(order.sellerId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    order.orderStatus = orderStatus;
    // If shipped, require tracking details
    let trackingDoc = null;
    if (orderStatus === 'shipped') {
      if (!tracking || !tracking.deliveryPerson || !tracking.deliveryPhone || !tracking.estimatedDelivery) {
        return res.status(400).json({ message: 'Tracking details required for shipped status' });
      }
      // Generate a tracking number if not present
      let trackingNumber = order.trackingNumber;
      if (!trackingNumber) {
        trackingNumber = 'TRK' + Date.now() + Math.floor(Math.random() * 1000);
        order.trackingNumber = trackingNumber;
      }
      order.estimatedDelivery = tracking.estimatedDelivery;
      order.deliveryPerson = tracking.deliveryPerson;
      order.deliveryPhone = tracking.deliveryPhone;
      order.vehicleNumber = tracking.vehicleNumber || '';
      // Upsert tracking doc
      trackingDoc = await Tracking.findOneAndUpdate(
        { order: order._id },
        {
          trackingNumber,
          order: order._id,
          status: 'shipped',
          note: tracking.note || '',
          deliveryPerson: tracking.deliveryPerson,
          deliveryPhone: tracking.deliveryPhone,
          vehicleNumber: tracking.vehicleNumber || '',
          estimatedDelivery: tracking.estimatedDelivery,
          updatedAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    await order.save();
    return res.status(200).json({ success: true, order, tracking: trackingDoc });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Get tracking info for an order
export const getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Only allow buyer to view their own order
    if (String(order.user) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    const tracking = await Tracking.findOne({ order: order._id });
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking info not found' });
    }
    return res.status(200).json({ tracking });
  } catch (err) {
    console.error('getTrackingInfo error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Update tracking status/note
export const updateTrackingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Only allow seller to update their own order's tracking
    if (String(order.sellerId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    const tracking = await Tracking.findOneAndUpdate(
      { order: order._id },
      {
        status,
        note: note || '',
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking info not found' });
    }
    // Optionally update order status if delivered/cancelled/returned/failed
    if (["delivered", "cancelled", "returned", "failed"].includes(status)) {
      order.orderStatus = status;
      await order.save();
    }
    return res.status(200).json({ success: true, tracking });
  } catch (err) {
    console.error('updateTrackingStatus error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}; 