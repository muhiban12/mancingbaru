module.exports = async function (fastify) {
  const upload = require("../middlewares/upload");
  const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

  /* ================= AUTH ================= */
  const auth = require("../controllers/authController");
  fastify.post("/auth/register", auth.register);
  fastify.post("/auth/login", auth.login);

  fastify.post("/user/upgrade-to-owner", {
    preHandler: [authenticate],
    handler: auth.submitOwnerUpgrade,
  });

  /* ================= MAP & PUBLIC ================= */
  const map = require("../controllers/mapController");
  fastify.get("/map-spots", map.getAllMapSpots);
  fastify.get("/spots/:id", map.getSpotDetail);
  fastify.get("/spots/nearby", map.getNearbySpots);
  fastify.get("/spots/:spot_id/reviews", map.getSpotReviews);
  fastify.get("/spots/:spot_id/gallery", map.getSpotGallery);
  fastify.get("/spots/:spot_id/events", map.getSpotEvents);

  /* ================= SPOT / POND ================= */
  const spot = require("../controllers/spotcontroller");

  // Owner operations
  fastify.post(
    "/ponds",
    { preHandler: [authenticate, upload.single("foto")] },
    spot.createPond
  );
  fastify.put(
    "/ponds/:id",
    { preHandler: [authenticate, upload.single("foto")] },
    spot.updatePond
  );
  fastify.patch(
    "/ponds/:id/request-delete",
    { preHandler: [authenticate] },
    spot.requestDeletePond
  );

  // Public operations
  fastify.get("/spots/:spot_id/seats", spot.getSpotSeats);
  fastify.get("/spots/search", spot.searchSpots);
  fastify.get("/spots/previews/batch", spot.getMultipleSpotPreviews);
  fastify.get("/spots/:spot_id/preview/mini", spot.getSpotMiniPreview);
  fastify.get("/spots/:spot_id/preview/peek", spot.getSpotPeekPreview);

  // Owner stats
  fastify.get(
    "/owner/spots/:spot_id/stats",
    { preHandler: [authenticate] },
    spot.getSpotStats
  );

  /* ================= BOOKINGS ================= */
  const booking = require("../controllers/bookingController");

  fastify.post(
    "/bookings",
    { preHandler: [authenticate] },
    booking.createBooking
  );

  fastify.get(
    "/my-bookings",
    { preHandler: [authenticate] },
    booking.getUserBookings
  );

  /* ================= EVENTS ================= */
  const event = require("../controllers/eventController");

  fastify.post(
    "/events",
    { preHandler: [authenticate, upload.single("poster")] },
    event.createEvent
  );

  fastify.get("/events/:event_id", event.getEventDetail);
  fastify.get("/events", event.getApprovedEvents);

  fastify.post(
    "/events/register",
    { preHandler: [authenticate] },
    event.registerEvent
  );

  fastify.get(
    "/my-tickets",
    { preHandler: [authenticate] },
    event.getMyEventTickets
  );

  fastify.get(
    "/owner/events",
    { preHandler: [authenticate] },
    event.getOwnerEvents
  );

  fastify.post(
    "/events/payment/confirm",
    { preHandler: [authenticate] },
    event.confirmPayment
  );

  fastify.delete(
    "/events/:event_id/register",
    { preHandler: [authenticate] },
    event.cancelRegistration
  );

  /* ================= SOCIAL / FEEDS ================= */
  const social = require("../controllers/socialController");

  fastify.get("/feeds", social.getStrikeFeeds);
  fastify.post(
    "/feeds",
    { preHandler: [authenticate] },
    social.createStrikeFeed
  );
  fastify.post(
    "/feeds/:id/report",
    { preHandler: [authenticate] },
    social.reportFeed
  );
  fastify.get("/leaderboard", social.getLeaderboard);

  /* ================= REVIEWS ================= */
  const review = require("../controllers/reviewController");

  fastify.post(
    "/reviews",
    { preHandler: [authenticate, upload.single("foto")] },
    review.createReview
  );
  fastify.get("/reviews", review.getSpotReviews);

  /* ================= WALLET / FINANCE ================= */
  const finance = require("../controllers/financeController");

  fastify.get(
    "/wallet",
    { preHandler: [authenticate] },
    finance.getOwnerWallet
  );
  fastify.get(
    "/wallet/transactions",
    { preHandler: [authenticate] },
    finance.getOwnerTransactions
  );
  fastify.post(
    "/wallet/withdraw",
    { preHandler: [authenticate] },
    finance.withdrawFunds
  );

  /* ================= MASTER DATA ================= */
  const master = require("../controllers/masterController");
  fastify.get("/master/fish", master.getFishMaster);
  fastify.get("/master/facilities", master.getMasterFacilities);
  fastify.get(
    "/master/wild-spots",
    master.getWildSpotMaster
  ); /* ================= NOTIFICATIONS ================= */
  const notif = require("../controllers/notificationsController");

  fastify.get(
    "/notifications",
    { preHandler: [authenticate] },
    notif.getNotifications
  );
  fastify.patch(
    "/notifications/:id/read",
    { preHandler: [authenticate] },
    notif.markNotificationRead
  );

  /* ================= ADMIN ================= */
  const admin = require("../controllers/adminController");

  fastify.get(
    "/admin/ponds",
    { preHandler: [authenticate, isAdmin] },
    admin.getAdminPonds
  );
  fastify.patch(
    "/admin/ponds/:id/approve",
    { preHandler: [authenticate, isAdmin] },
    admin.approveSpot
  );
  fastify.patch(
    "/admin/ponds/:id/approve-delete",
    { preHandler: [authenticate, isAdmin] },
    admin.approveDeletePond
  );
  fastify.post(
    "/admin/wild-spots",
    { preHandler: [authenticate, isAdmin] },
    admin.createWildSpot
  );
  fastify.put(
    "/admin/wild-spots/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.updateWildSpot
  );
  fastify.delete(
    "/admin/wild-spots/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.deleteWildSpot
  );
  fastify.delete(
    "/admin/reviews/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.adminDeleteReview
  );
  fastify.delete(
    "/admin/feeds/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.adminDeleteStrikeFeed
  );
  fastify.get(
    "/admin/feed-reports",
    { preHandler: [authenticate, isAdmin] },
    admin.getFeedReports
  );
  fastify.patch(
    "/admin/feed-reports/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.resolveFeedReport
  );

  // Event approvals
  fastify.get(
    "/admin/events/pending",
    { preHandler: [authenticate, isAdmin] },
    admin.getPendingEvents
  );
  fastify.get(
    "/admin/events/:event_id",
    { preHandler: [authenticate, isAdmin] },
    admin.getEventDetailForAdmin
  );
  fastify.patch(
    "/admin/events/:event_id/approve",
    { preHandler: [authenticate, isAdmin] },
    admin.approveEvent
  );
  fastify.delete(
    "/admin/events/:event_id",
    { preHandler: [authenticate, isAdmin] },
    admin.deleteEvent
  );

  fastify.get("/admin/owner-upgrade-requests", {
    preHandler: [authenticate, isAdmin],
    handler: admin.getOwnerUpgradeRequests,
  });
  fastify.get("/admin/owner-upgrade-requests/:user_id", {
    preHandler: [authenticate, isAdmin],
    handler: admin.getOwnerUpgradeDetail,
  });
  fastify.post("/admin/owner-upgrade-requests/:user_id/approve", {
    preHandler: [authenticate, isAdmin],
    handler: admin.approveOwnerUpgrade,
  });

  /* ================= OWNER ================= */
  const owner = require("../controllers/ownerController");

  // Routes untuk owner dashboard
  fastify.get("/owner/spots", {
    preHandler: [authenticate],
    handler: owner.getOwnerSpots,
  });

  fastify.get("/owner/dashboard", {
    preHandler: [authenticate],
    handler: owner.getOwnerDashboard,
  });

  fastify.post("/owner/set-active-spot", {
    preHandler: [authenticate],
    handler: owner.setActiveSpot,
  });

  fastify.get("/owner/status", {
    preHandler: [authenticate],
    handler: owner.getOwnerStatus,
  });
};
