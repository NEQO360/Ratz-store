const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[Email Skipped] No email config. Would send to ${to}: "${subject}"`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Ratz Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[Email Sent] To: ${to}, Subject: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[Email Error] ${err.message}`);
    return false;
  }
};

const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
};

const itemsTable = (items) => {
  const rows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f7f7f7;">
          <th style="padding:8px;text-align:left;">Item</th>
          <th style="padding:8px;text-align:center;">Qty</th>
          <th style="padding:8px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const emailWrapper = (content) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#4f46e5;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Ratz Store</h1>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
      ${content}
    </div>
    <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px;">
      <p>Ratz Store | 72/4, B Chakkindarama Road, Ratmalana, Sri Lanka</p>
      <p>support@ratzstore.com | +94 77 757 9182</p>
    </div>
  </div>
`;

const bankDetails = `
  <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:16px 0;">
    <h3 style="margin:0 0 8px;color:#92400e;">Bank Transfer Details</h3>
    <table style="width:100%;">
      <tr><td style="padding:4px 0;color:#78716c;">Bank:</td><td style="padding:4px 0;font-weight:bold;">Commercial Bank of Ceylon</td></tr>
      <tr><td style="padding:4px 0;color:#78716c;">Account Name:</td><td style="padding:4px 0;font-weight:bold;">Ratz Store (Pvt) Ltd</td></tr>
      <tr><td style="padding:4px 0;color:#78716c;">Account No:</td><td style="padding:4px 0;font-weight:bold;">1234567890</td></tr>
      <tr><td style="padding:4px 0;color:#78716c;">Branch:</td><td style="padding:4px 0;font-weight:bold;">Colombo 03</td></tr>
    </table>
    <p style="margin:8px 0 0;color:#92400e;font-size:14px;">
      <strong>Important:</strong> Use your order number as the payment reference.
    </p>
  </div>
`;

exports.sendOrderConfirmation = async (order) => {
  const isBankTransfer = order.paymentMethod === 'Bank Transfer';

  const html = emailWrapper(`
    <h2 style="color:#111827;">Order Confirmed!</h2>
    <p>Hi ${order.customer.name},</p>
    <p>Thank you for your order. Here are the details:</p>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
      <p style="margin:4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p style="margin:4px 0;"><strong>Status:</strong> ${isBankTransfer ? 'Awaiting Payment' : 'Pending'}</p>
    </div>

    ${itemsTable(order.items)}

    <div style="text-align:right;margin:16px 0;">
      <p style="font-size:18px;font-weight:bold;color:#111827;">Total: ${formatCurrency(order.total)}</p>
    </div>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <h3 style="margin:0 0 8px;">Shipping Address</h3>
      <p style="margin:0;">${order.shippingAddress.street}</p>
      <p style="margin:0;">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
    </div>

    ${isBankTransfer ? bankDetails : '<p>Your order will be processed shortly. You will pay <strong>' + formatCurrency(order.total) + '</strong> upon delivery.</p>'}

    <p style="color:#6b7280;font-size:14px;">If you have any questions, reply to this email or contact us at support@ratzstore.com</p>
  `);

  await sendEmail(
    order.customer.email,
    `Order Confirmed - #${order.orderNumber}`,
    html
  );
};

exports.sendOrderStatusUpdate = async (order) => {
  const statusMessages = {
    processing: {
      title: 'Order Being Processed',
      message: 'Great news! Your order is now being processed and will be shipped soon.'
    },
    shipped: {
      title: 'Order Shipped',
      message: 'Your order has been shipped! It should arrive within 2-5 business days depending on your location.'
    },
    delivered: {
      title: 'Order Delivered',
      message: 'Your order has been delivered. We hope you enjoy your purchase!'
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you did not request this, please contact us immediately.'
    }
  };

  const info = statusMessages[order.status];
  if (!info) return;

  const html = emailWrapper(`
    <h2 style="color:#111827;">${info.title}</h2>
    <p>Hi ${order.customer.name},</p>
    <p>${info.message}</p>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
      <p style="margin:4px 0;"><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
      <p style="margin:4px 0;"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
    </div>

    ${itemsTable(order.items)}

    <p style="color:#6b7280;font-size:14px;">If you have any questions, reply to this email or contact us at support@ratzstore.com</p>
  `);

  await sendEmail(
    order.customer.email,
    `Order #${order.orderNumber} - ${info.title}`,
    html
  );
};

exports.sendPaymentConfirmation = async (order) => {
  const html = emailWrapper(`
    <h2 style="color:#111827;">Payment Confirmed!</h2>
    <p>Hi ${order.customer.name},</p>
    <p>We have received your payment for order <strong>#${order.orderNumber}</strong>. Your order is now being processed.</p>

    <div style="background:#d1fae5;border:1px solid #10b981;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#065f46;font-weight:bold;">Payment of ${formatCurrency(order.total)} received successfully.</p>
    </div>

    ${itemsTable(order.items)}

    <p style="color:#6b7280;font-size:14px;">Your order will be shipped soon. We'll notify you when it's on its way!</p>
  `);

  await sendEmail(
    order.customer.email,
    `Payment Confirmed - Order #${order.orderNumber}`,
    html
  );
};

// ── Admin Notifications ──

const getAdminEmail = () => process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

exports.sendAdminNewOrderNotification = async (order) => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return;

  const html = emailWrapper(`
    <h2 style="color:#111827;">New Order Received!</h2>
    <div style="background:#eef2ff;border:1px solid #818cf8;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
      <p style="margin:4px 0;"><strong>Customer:</strong> ${order.customer.name} (${order.customer.email})</p>
      <p style="margin:4px 0;"><strong>Phone:</strong> ${order.customer.phone || 'N/A'}</p>
      <p style="margin:4px 0;"><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p style="margin:4px 0;"><strong>Status:</strong> ${order.status}</p>
    </div>

    ${itemsTable(order.items)}

    <div style="text-align:right;margin:16px 0;">
      <p style="font-size:18px;font-weight:bold;color:#111827;">Total: ${formatCurrency(order.total)}</p>
    </div>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <h3 style="margin:0 0 8px;">Shipping Address</h3>
      <p style="margin:0;">${order.shippingAddress.street}</p>
      <p style="margin:0;">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
    </div>

    <p style="color:#6b7280;font-size:14px;">Log in to the admin panel to manage this order.</p>
  `);

  await sendEmail(adminEmail, `New Order #${order.orderNumber} - ${formatCurrency(order.total)}`, html);
};

exports.sendAdminNewMessageNotification = async (contact) => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return;

  const html = emailWrapper(`
    <h2 style="color:#111827;">New Contact Message</h2>
    <div style="background:#eef2ff;border:1px solid #818cf8;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;"><strong>From:</strong> ${contact.name} (${contact.email})</p>
      <p style="margin:4px 0;"><strong>Subject:</strong> ${contact.subject}</p>
    </div>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;white-space:pre-wrap;">${contact.message}</p>
    </div>

    <p style="color:#6b7280;font-size:14px;">Log in to the admin panel to reply to this message.</p>
  `);

  await sendEmail(adminEmail, `New Message: ${contact.subject} - from ${contact.name}`, html);
};

exports.sendReplyToCustomer = async (contact, replyMessage) => {
  const html = emailWrapper(`
    <h2 style="color:#111827;">Reply to Your Inquiry</h2>
    <p>Hi ${contact.name},</p>
    <p>Thank you for reaching out. Here is our response to your inquiry:</p>

    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;white-space:pre-wrap;">${replyMessage}</p>
    </div>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Your original message:</p>
      <p style="margin:0 0 4px;"><strong>Subject:</strong> ${contact.subject}</p>
      <p style="margin:0;color:#6b7280;font-style:italic;">${contact.message}</p>
    </div>

    <p style="color:#6b7280;font-size:14px;">If you have further questions, feel free to reply to this email.</p>
  `);

  await sendEmail(contact.email, `Re: ${contact.subject} - Ratz Store`, html);
};
