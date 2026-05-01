var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import path3 from "path";

// src/app/routes/index.ts
import { Router as Router9 } from "express";

// src/app/module/parcel/parcel.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error in async handler:", error);
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/parcel/controllers/getAvailableParcels.controller.ts
import status13 from "http-status";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model UserAddress {\n  id String @id @default(uuid(7))\n\n  userId String\n\n  label     String\n  address   String\n  district  String\n  phone     String?\n  isDefault Boolean @default(false)\n\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, isDefault])\n  @@map("user_address")\n}\n\nmodel User {\n  id            String  @id\n  name          String\n  email         String\n  emailVerified Boolean @default(false)\n  image         String?\n\n  //Additional Fields\n  phone  String?\n  role   UserRole   @default(CUSTOMER)\n  status UserStatus @default(ACTIVE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // relations\n  parcels       Parcel[]          @relation("CustomerParcels")\n  payments      Payment[]\n  notifications Notification[]\n  addresses     UserAddress[]\n  statusLogs    ParcelStatusLog[]\n  riderProfile  Rider?\n  ratings       RiderRating[]     @relation("CustomerRatings")\n\n  sessions Session[]\n  accounts Account[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  SUPER_ADMIN\n  ADMIN\n  RIDER\n  CUSTOMER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum ParcelStatus {\n  REQUESTED\n  ASSIGNED\n  PICKED\n  IN_TRANSIT\n  DELIVERED\n  CANCELLED\n}\n\nenum RiderStatus {\n  AVAILABLE\n  BUSY\n  OFFLINE\n}\n\nenum RiderAccountStatus {\n  PENDING\n  ACTIVE\n  SUSPENDED\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n}\n\nenum PaymentMethod {\n  STRIPE\n  MANUAL\n  BKASH\n  SSLCOMMERZ\n}\n\nenum EarningStatus {\n  PENDING\n  PAID\n}\n\nenum CashoutStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  PAID\n}\n\nenum ParcelType {\n  DOCUMENT\n  SMALL\n  MEDIUM\n  LARGE\n  FRAGILE\n  ELECTRONICS\n}\n\nenum ServiceType {\n  STANDARD\n  EXPRESS\n}\n\nenum NotificationType {\n  INFO\n  WARNING\n  SUCCESS\n}\n\nmodel Notification {\n  id String @id @default(uuid(7))\n\n  userId String\n\n  title   String\n  message String\n  type    NotificationType\n  isRead  Boolean          @default(false)\n\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("notification")\n}\n\nmodel Parcel {\n  id         String @id @default(uuid(7))\n  trackingId String @unique\n\n  customerId String\n  riderId    String?\n\n  pickupAddress   String\n  deliveryAddress String\n\n  districtFrom String\n  districtTo   String\n\n  weight      Float       @default(1.0)\n  parcelType  ParcelType  @default(SMALL)\n  serviceType ServiceType @default(STANDARD)\n\n  status ParcelStatus @default(REQUESTED)\n\n  price  Float\n  isPaid Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  customer User   @relation("CustomerParcels", fields: [customerId], references: [id])\n  rider    Rider? @relation(fields: [riderId], references: [id])\n\n  statusLogs ParcelStatusLog[]\n  payment    Payment?\n  earning    Earning?\n  ratings    RiderRating[]     @relation("ParcelRatings")\n\n  @@index([customerId])\n  @@index([riderId])\n  @@index([status])\n  @@map("parcel")\n}\n\nmodel ParcelStatusLog {\n  id String @id @default(uuid(7))\n\n  parcelId  String\n  status    ParcelStatus\n  changedBy String\n  note      String?\n\n  timestamp DateTime @default(now())\n\n  parcel Parcel @relation(fields: [parcelId], references: [id], onDelete: Cascade)\n  user   User   @relation(fields: [changedBy], references: [id])\n\n  @@map("parcel_status_log")\n}\n\nmodel Payment {\n  id String @id @default(uuid(7))\n\n  parcelId   String @unique\n  customerId String\n\n  amount        Float\n  paymentMethod PaymentMethod\n  transactionId String?       @unique\n\n  status PaymentStatus @default(PENDING)\n\n  createdAt DateTime @default(now())\n\n  parcel   Parcel @relation(fields: [parcelId], references: [id], onDelete: Cascade)\n  customer User   @relation(fields: [customerId], references: [id])\n\n  @@index([customerId])\n  @@map("payment")\n}\n\nmodel Earning {\n  id String @id @default(uuid(7))\n\n  riderId  String\n  parcelId String @unique\n\n  amount     Float\n  percentage Float\n\n  status EarningStatus @default(PENDING)\n\n  createdAt DateTime @default(now())\n\n  rider  Rider  @relation(fields: [riderId], references: [id], onDelete: Cascade)\n  parcel Parcel @relation(fields: [parcelId], references: [id], onDelete: Cascade)\n\n  @@index([riderId])\n  @@map("earning")\n}\n\nmodel Cashout {\n  id String @id @default(uuid(7))\n\n  riderId String\n\n  amount Float\n  status CashoutStatus @default(PENDING)\n\n  requestedAt DateTime  @default(now())\n  processedAt DateTime?\n\n  rider Rider @relation(fields: [riderId], references: [id], onDelete: Cascade)\n\n  @@index([riderId])\n  @@map("cashout")\n}\n\nmodel Rider {\n  id     String @id @default(uuid(7))\n  userId String @unique\n\n  district String\n\n  accountStatus RiderAccountStatus @default(PENDING)\n  currentStatus RiderStatus        @default(AVAILABLE)\n\n  rating          Float @default(0)\n  totalRatings    Int   @default(0)\n  totalDeliveries Int   @default(0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  parcels  Parcel[]\n  earnings Earning[]\n  cashouts Cashout[]\n  ratings  RiderRating[] @relation("RiderRatings")\n\n  @@index([accountStatus])\n  @@index([currentStatus])\n  @@map("rider")\n}\n\nmodel RiderRating {\n  id String @id @default(uuid(7))\n\n  riderId    String\n  customerId String\n  parcelId   String\n\n  rating  Int // 1-5 stars\n  comment String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  rider    Rider  @relation("RiderRatings", fields: [riderId], references: [id], onDelete: Cascade)\n  customer User   @relation("CustomerRatings", fields: [customerId], references: [id], onDelete: Cascade)\n  parcel   Parcel @relation("ParcelRatings", fields: [parcelId], references: [id], onDelete: Cascade)\n\n  @@unique([parcelId, customerId])\n  @@index([riderId])\n  @@index([parcelId])\n  @@map("rider_rating")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel StatsCache {\n  id String @id @default(uuid(7))\n\n  // Existing metrics\n  totalParcels          Int   @default(0)\n  totalPendingParcels   Int   @default(0)\n  totalCompletedParcels Int   @default(0)\n  totalUsers            Int   @default(0)\n  totalRevenue          Float @default(0)\n\n  // Time-based metrics\n  dailyRevenue   Float @default(0)\n  weeklyRevenue  Float @default(0)\n  monthlyRevenue Float @default(0)\n  dailyParcels   Int   @default(0)\n  weeklyParcels  Int   @default(0)\n  monthlyParcels Int   @default(0)\n\n  // Rider metrics\n  activeRiders Int     @default(0)\n  onlineRiders Int     @default(0)\n  totalRiders  Int     @default(0)\n  topRiderId   String?\n\n  // Customer metrics\n  activeCustomers Int @default(0)\n  totalCustomers  Int @default(0)\n\n  // Performance metrics\n  avgDeliveryTime     Float @default(0) // in hours\n  deliverySuccessRate Float @default(0) // percentage\n\n  // Financial metrics\n  avgOrderValue   Float @default(0)\n  platformRevenue Float @default(0) // 30% of parcel price\n  riderPayouts    Float @default(0)\n  pendingPayouts  Float @default(0)\n\n  // Growth metrics\n  newUsersToday     Int @default(0)\n  newUsersThisWeek  Int @default(0)\n  newUsersThisMonth Int @default(0)\n\n  updatedAt DateTime @updatedAt\n\n  @@map("stats_cache")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"UserAddress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAddress"}],"dbName":"user_address"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"parcels","kind":"object","type":"Parcel","relationName":"CustomerParcels"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"addresses","kind":"object","type":"UserAddress","relationName":"UserToUserAddress"},{"name":"statusLogs","kind":"object","type":"ParcelStatusLog","relationName":"ParcelStatusLogToUser"},{"name":"riderProfile","kind":"object","type":"Rider","relationName":"RiderToUser"},{"name":"ratings","kind":"object","type":"RiderRating","relationName":"CustomerRatings"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":"notification"},"Parcel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"trackingId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"riderId","kind":"scalar","type":"String"},{"name":"pickupAddress","kind":"scalar","type":"String"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"districtFrom","kind":"scalar","type":"String"},{"name":"districtTo","kind":"scalar","type":"String"},{"name":"weight","kind":"scalar","type":"Float"},{"name":"parcelType","kind":"enum","type":"ParcelType"},{"name":"serviceType","kind":"enum","type":"ServiceType"},{"name":"status","kind":"enum","type":"ParcelStatus"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isPaid","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerParcels"},{"name":"rider","kind":"object","type":"Rider","relationName":"ParcelToRider"},{"name":"statusLogs","kind":"object","type":"ParcelStatusLog","relationName":"ParcelToParcelStatusLog"},{"name":"payment","kind":"object","type":"Payment","relationName":"ParcelToPayment"},{"name":"earning","kind":"object","type":"Earning","relationName":"EarningToParcel"},{"name":"ratings","kind":"object","type":"RiderRating","relationName":"ParcelRatings"}],"dbName":"parcel"},"ParcelStatusLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"parcelId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ParcelStatus"},{"name":"changedBy","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"timestamp","kind":"scalar","type":"DateTime"},{"name":"parcel","kind":"object","type":"Parcel","relationName":"ParcelToParcelStatusLog"},{"name":"user","kind":"object","type":"User","relationName":"ParcelStatusLogToUser"}],"dbName":"parcel_status_log"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"parcelId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"parcel","kind":"object","type":"Parcel","relationName":"ParcelToPayment"},{"name":"customer","kind":"object","type":"User","relationName":"PaymentToUser"}],"dbName":"payment"},"Earning":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"riderId","kind":"scalar","type":"String"},{"name":"parcelId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"EarningStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"rider","kind":"object","type":"Rider","relationName":"EarningToRider"},{"name":"parcel","kind":"object","type":"Parcel","relationName":"EarningToParcel"}],"dbName":"earning"},"Cashout":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"riderId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CashoutStatus"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"rider","kind":"object","type":"Rider","relationName":"CashoutToRider"}],"dbName":"cashout"},"Rider":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"district","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"enum","type":"RiderAccountStatus"},{"name":"currentStatus","kind":"enum","type":"RiderStatus"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalRatings","kind":"scalar","type":"Int"},{"name":"totalDeliveries","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"RiderToUser"},{"name":"parcels","kind":"object","type":"Parcel","relationName":"ParcelToRider"},{"name":"earnings","kind":"object","type":"Earning","relationName":"EarningToRider"},{"name":"cashouts","kind":"object","type":"Cashout","relationName":"CashoutToRider"},{"name":"ratings","kind":"object","type":"RiderRating","relationName":"RiderRatings"}],"dbName":"rider"},"RiderRating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"riderId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"parcelId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"rider","kind":"object","type":"Rider","relationName":"RiderRatings"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerRatings"},{"name":"parcel","kind":"object","type":"Parcel","relationName":"ParcelRatings"}],"dbName":"rider_rating"},"StatsCache":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalParcels","kind":"scalar","type":"Int"},{"name":"totalPendingParcels","kind":"scalar","type":"Int"},{"name":"totalCompletedParcels","kind":"scalar","type":"Int"},{"name":"totalUsers","kind":"scalar","type":"Int"},{"name":"totalRevenue","kind":"scalar","type":"Float"},{"name":"dailyRevenue","kind":"scalar","type":"Float"},{"name":"weeklyRevenue","kind":"scalar","type":"Float"},{"name":"monthlyRevenue","kind":"scalar","type":"Float"},{"name":"dailyParcels","kind":"scalar","type":"Int"},{"name":"weeklyParcels","kind":"scalar","type":"Int"},{"name":"monthlyParcels","kind":"scalar","type":"Int"},{"name":"activeRiders","kind":"scalar","type":"Int"},{"name":"onlineRiders","kind":"scalar","type":"Int"},{"name":"totalRiders","kind":"scalar","type":"Int"},{"name":"topRiderId","kind":"scalar","type":"String"},{"name":"activeCustomers","kind":"scalar","type":"Int"},{"name":"totalCustomers","kind":"scalar","type":"Int"},{"name":"avgDeliveryTime","kind":"scalar","type":"Float"},{"name":"deliverySuccessRate","kind":"scalar","type":"Float"},{"name":"avgOrderValue","kind":"scalar","type":"Float"},{"name":"platformRevenue","kind":"scalar","type":"Float"},{"name":"riderPayouts","kind":"scalar","type":"Float"},{"name":"pendingPayouts","kind":"scalar","type":"Float"},{"name":"newUsersToday","kind":"scalar","type":"Int"},{"name":"newUsersThisWeek","kind":"scalar","type":"Int"},{"name":"newUsersThisMonth","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"stats_cache"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","customer","user","parcels","rider","parcel","earnings","cashouts","ratings","_count","statusLogs","payment","earning","payments","notifications","addresses","riderProfile","sessions","accounts","UserAddress.findUnique","UserAddress.findUniqueOrThrow","UserAddress.findFirst","UserAddress.findFirstOrThrow","UserAddress.findMany","data","UserAddress.createOne","UserAddress.createMany","UserAddress.createManyAndReturn","UserAddress.updateOne","UserAddress.updateMany","UserAddress.updateManyAndReturn","create","update","UserAddress.upsertOne","UserAddress.deleteOne","UserAddress.deleteMany","having","_min","_max","UserAddress.groupBy","UserAddress.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Parcel.findUnique","Parcel.findUniqueOrThrow","Parcel.findFirst","Parcel.findFirstOrThrow","Parcel.findMany","Parcel.createOne","Parcel.createMany","Parcel.createManyAndReturn","Parcel.updateOne","Parcel.updateMany","Parcel.updateManyAndReturn","Parcel.upsertOne","Parcel.deleteOne","Parcel.deleteMany","_avg","_sum","Parcel.groupBy","Parcel.aggregate","ParcelStatusLog.findUnique","ParcelStatusLog.findUniqueOrThrow","ParcelStatusLog.findFirst","ParcelStatusLog.findFirstOrThrow","ParcelStatusLog.findMany","ParcelStatusLog.createOne","ParcelStatusLog.createMany","ParcelStatusLog.createManyAndReturn","ParcelStatusLog.updateOne","ParcelStatusLog.updateMany","ParcelStatusLog.updateManyAndReturn","ParcelStatusLog.upsertOne","ParcelStatusLog.deleteOne","ParcelStatusLog.deleteMany","ParcelStatusLog.groupBy","ParcelStatusLog.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Earning.findUnique","Earning.findUniqueOrThrow","Earning.findFirst","Earning.findFirstOrThrow","Earning.findMany","Earning.createOne","Earning.createMany","Earning.createManyAndReturn","Earning.updateOne","Earning.updateMany","Earning.updateManyAndReturn","Earning.upsertOne","Earning.deleteOne","Earning.deleteMany","Earning.groupBy","Earning.aggregate","Cashout.findUnique","Cashout.findUniqueOrThrow","Cashout.findFirst","Cashout.findFirstOrThrow","Cashout.findMany","Cashout.createOne","Cashout.createMany","Cashout.createManyAndReturn","Cashout.updateOne","Cashout.updateMany","Cashout.updateManyAndReturn","Cashout.upsertOne","Cashout.deleteOne","Cashout.deleteMany","Cashout.groupBy","Cashout.aggregate","Rider.findUnique","Rider.findUniqueOrThrow","Rider.findFirst","Rider.findFirstOrThrow","Rider.findMany","Rider.createOne","Rider.createMany","Rider.createManyAndReturn","Rider.updateOne","Rider.updateMany","Rider.updateManyAndReturn","Rider.upsertOne","Rider.deleteOne","Rider.deleteMany","Rider.groupBy","Rider.aggregate","RiderRating.findUnique","RiderRating.findUniqueOrThrow","RiderRating.findFirst","RiderRating.findFirstOrThrow","RiderRating.findMany","RiderRating.createOne","RiderRating.createMany","RiderRating.createManyAndReturn","RiderRating.updateOne","RiderRating.updateMany","RiderRating.updateManyAndReturn","RiderRating.upsertOne","RiderRating.deleteOne","RiderRating.deleteMany","RiderRating.groupBy","RiderRating.aggregate","StatsCache.findUnique","StatsCache.findUniqueOrThrow","StatsCache.findFirst","StatsCache.findFirstOrThrow","StatsCache.findMany","StatsCache.createOne","StatsCache.createMany","StatsCache.createManyAndReturn","StatsCache.updateOne","StatsCache.updateMany","StatsCache.updateManyAndReturn","StatsCache.upsertOne","StatsCache.deleteOne","StatsCache.deleteMany","StatsCache.groupBy","StatsCache.aggregate","AND","OR","NOT","id","totalParcels","totalPendingParcels","totalCompletedParcels","totalUsers","totalRevenue","dailyRevenue","weeklyRevenue","monthlyRevenue","dailyParcels","weeklyParcels","monthlyParcels","activeRiders","onlineRiders","totalRiders","topRiderId","activeCustomers","totalCustomers","avgDeliveryTime","deliverySuccessRate","avgOrderValue","platformRevenue","riderPayouts","pendingPayouts","newUsersToday","newUsersThisWeek","newUsersThisMonth","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","riderId","customerId","parcelId","rating","comment","createdAt","userId","district","RiderAccountStatus","accountStatus","RiderStatus","currentStatus","totalRatings","totalDeliveries","every","some","none","amount","CashoutStatus","status","requestedAt","processedAt","percentage","EarningStatus","PaymentMethod","paymentMethod","transactionId","PaymentStatus","ParcelStatus","changedBy","note","timestamp","trackingId","pickupAddress","deliveryAddress","districtFrom","districtTo","weight","ParcelType","parcelType","ServiceType","serviceType","price","isPaid","title","message","NotificationType","type","isRead","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","phone","UserRole","role","UserStatus","label","address","isDefault","parcelId_customerId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pweCAeABDAQAAKMDACD9AQAA5gMAMP4BAAArABD_AQAA5gMAMIACAQAAAAGsAkAAlwMAIa0CAQCTAwAhrgIBAJMDACHrAgEAlgMAIe8CAQCTAwAh8AIBAJMDACHxAiAA2AMAIQEAAAABACAZAwAAowMAIAYAAN8DACAKAACnAwAgDAAA3gMAIA0AAPkDACAOAAD6AwAg_QEAAPYDADD-AQAAAwAQ_wEAAPYDADCAAgEAkwMAIZsCQACXAwAhpwIBAJYDACGoAgEAkwMAIawCQACXAwAhugIAAO4DxAIixwIBAJMDACHIAgEAkwMAIckCAQCTAwAhygIBAJMDACHLAgEAkwMAIcwCCACVAwAhzgIAAPcDzgIi0AIAAPgD0AIi0QIIAJUDACHSAiAA2AMAIQcDAACMBQAgBgAAugYAIAoAAJAFACAMAAC5BgAgDQAAwwYAIA4AAMQGACCnAgAA-wMAIBkDAACjAwAgBgAA3wMAIAoAAKcDACAMAADeAwAgDQAA-QMAIA4AAPoDACD9AQAA9gMAMP4BAAADABD_AQAA9gMAMIACAQAAAAGbAkAAlwMAIacCAQCWAwAhqAIBAJMDACGsAkAAlwMAIboCAADuA8QCIscCAQAAAAHIAgEAkwMAIckCAQCTAwAhygIBAJMDACHLAgEAkwMAIcwCCACVAwAhzgIAAPcDzgIi0AIAAPgD0AIi0QIIAJUDACHSAiAA2AMAIQMAAAADACABAAAEADACAAAFACASBAAAowMAIAUAAKQDACAIAAClAwAgCQAApgMAIAoAAKcDACD9AQAAoAMAMP4BAAAHABD_AQAAoAMAMIACAQCTAwAhmwJAAJcDACGqAggAlQMAIawCQACXAwAhrQIBAJMDACGuAgEAkwMAIbACAAChA7ACIrICAACiA7ICIrMCAgCUAwAhtAICAJQDACEBAAAABwAgAwAAAAMAIAEAAAQAMAIAAAUAIAwGAADxAwAgBwAA7AMAIP0BAAD0AwAw_gEAAAoAEP8BAAD0AwAwgAIBAJMDACGnAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAAD1A78CIr0CCACVAwAhAgYAALoGACAHAADCBgAgDAYAAPEDACAHAADsAwAg_QEAAPQDADD-AQAACgAQ_wEAAPQDADCAAgEAAAABpwIBAJMDACGpAgEAAAABrAJAAJcDACG4AggAlQMAIboCAAD1A78CIr0CCACVAwAhAwAAAAoAIAEAAAsAMAIAAAwAIAoGAADxAwAg_QEAAPIDADD-AQAADgAQ_wEAAPIDADCAAgEAkwMAIacCAQCTAwAhuAIIAJUDACG6AgAA8wO6AiK7AkAAlwMAIbwCQADkAwAhAgYAALoGACC8AgAA-wMAIAoGAADxAwAg_QEAAPIDADD-AQAADgAQ_wEAAPIDADCAAgEAAAABpwIBAJMDACG4AggAlQMAIboCAADzA7oCIrsCQACXAwAhvAJAAOQDACEDAAAADgAgAQAADwAwAgAAEAAgDgMAAKMDACAGAADxAwAgBwAA7AMAIP0BAADwAwAw_gEAABIAEP8BAADwAwAwgAIBAJMDACGbAkAAlwMAIacCAQCTAwAhqAIBAJMDACGpAgEAkwMAIaoCAgCUAwAhqwIBAJYDACGsAkAAlwMAIQQDAACMBQAgBgAAugYAIAcAAMIGACCrAgAA-wMAIA8DAACjAwAgBgAA8QMAIAcAAOwDACD9AQAA8AMAMP4BAAASABD_AQAA8AMAMIACAQAAAAGbAkAAlwMAIacCAQCTAwAhqAIBAJMDACGpAgEAkwMAIaoCAgCUAwAhqwIBAJYDACGsAkAAlwMAIfICAADvAwAgAwAAABIAIAEAABMAMAIAABQAIAEAAAADACABAAAACgAgAQAAAA4AIAEAAAASACALBAAAowMAIAcAAOwDACD9AQAA7QMAMP4BAAAaABD_AQAA7QMAMIACAQCTAwAhqQIBAJMDACG6AgAA7gPEAiLEAgEAkwMAIcUCAQCWAwAhxgJAAJcDACEDBAAAjAUAIAcAAMIGACDFAgAA-wMAIAsEAACjAwAgBwAA7AMAIP0BAADtAwAw_gEAABoAEP8BAADtAwAwgAIBAAAAAakCAQCTAwAhugIAAO4DxAIixAIBAJMDACHFAgEAlgMAIcYCQACXAwAhAwAAABoAIAEAABsAMAIAABwAIA0DAACjAwAgBwAA7AMAIP0BAADpAwAw_gEAAB4AEP8BAADpAwAwgAIBAJMDACGoAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAADrA8MCIsACAADqA8ACIsECAQCWAwAhAQAAAB4AIAEAAAAKACADAAAAEgAgAQAAEwAwAgAAFAAgAQAAABoAIAEAAAASACADAwAAjAUAIAcAAMIGACDBAgAA-wMAIA0DAACjAwAgBwAA7AMAIP0BAADpAwAw_gEAAB4AEP8BAADpAwAwgAIBAAAAAagCAQCTAwAhqQIBAAAAAawCQACXAwAhuAIIAJUDACG6AgAA6wPDAiLAAgAA6gPAAiLBAgEAAAABAwAAAB4AIAEAACQAMAIAACUAIAsEAACjAwAg_QEAAOcDADD-AQAAJwAQ_wEAAOcDADCAAgEAkwMAIawCQACXAwAhrQIBAJMDACHTAgEAkwMAIdQCAQCTAwAh1gIAAOgD1gIi1wIgANgDACEBBAAAjAUAIAsEAACjAwAg_QEAAOcDADD-AQAAJwAQ_wEAAOcDADCAAgEAAAABrAJAAJcDACGtAgEAkwMAIdMCAQCTAwAh1AIBAJMDACHWAgAA6APWAiLXAiAA2AMAIQMAAAAnACABAAAoADACAAApACAMBAAAowMAIP0BAADmAwAw_gEAACsAEP8BAADmAwAwgAIBAJMDACGsAkAAlwMAIa0CAQCTAwAhrgIBAJMDACHrAgEAlgMAIe8CAQCTAwAh8AIBAJMDACHxAiAA2AMAIQIEAACMBQAg6wIAAPsDACADAAAAKwAgAQAALAAwAgAAAQAgAwAAABoAIAEAABsAMAIAABwAIAEAAAAHACADAAAAEgAgAQAAEwAwAgAAFAAgDAQAAKMDACD9AQAA5QMAMP4BAAAxABD_AQAA5QMAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2gJAAJcDACHkAgEAkwMAIeUCAQCWAwAh5gIBAJYDACEDBAAAjAUAIOUCAAD7AwAg5gIAAPsDACAMBAAAowMAIP0BAADlAwAw_gEAADEAEP8BAADlAwAwgAIBAAAAAZsCQACXAwAhrAJAAJcDACGtAgEAkwMAIdoCQACXAwAh5AIBAAAAAeUCAQCWAwAh5gIBAJYDACEDAAAAMQAgAQAAMgAwAgAAMwAgEQQAAKMDACD9AQAA4wMAMP4BAAA1ABD_AQAA4wMAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2wIBAJMDACHcAgEAkwMAId0CAQCWAwAh3gIBAJYDACHfAgEAlgMAIeACQADkAwAh4QJAAOQDACHiAgEAlgMAIeMCAQCWAwAhCAQAAIwFACDdAgAA-wMAIN4CAAD7AwAg3wIAAPsDACDgAgAA-wMAIOECAAD7AwAg4gIAAPsDACDjAgAA-wMAIBEEAACjAwAg_QEAAOMDADD-AQAANQAQ_wEAAOMDADCAAgEAAAABmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2wIBAJMDACHcAgEAkwMAId0CAQCWAwAh3gIBAJYDACHfAgEAlgMAIeACQADkAwAh4QJAAOQDACHiAgEAlgMAIeMCAQCWAwAhAwAAADUAIAEAADYAMAIAADcAIAEAAAADACABAAAAHgAgAQAAACcAIAEAAAArACABAAAAGgAgAQAAABIAIAEAAAAxACABAAAANQAgAQAAAAEAIAMAAAArACABAAAsADACAAABACADAAAAKwAgAQAALAAwAgAAAQAgAwAAACsAIAEAACwAMAIAAAEAIAkEAADBBgAggAIBAAAAAawCQAAAAAGtAgEAAAABrgIBAAAAAesCAQAAAAHvAgEAAAAB8AIBAAAAAfECIAAAAAEBGgAARQAgCIACAQAAAAGsAkAAAAABrQIBAAAAAa4CAQAAAAHrAgEAAAAB7wIBAAAAAfACAQAAAAHxAiAAAAABARoAAEcAMAEaAABHADAJBAAAwAYAIIACAQCBBAAhrAJAAIUEACGtAgEAgQQAIa4CAQCBBAAh6wIBAIQEACHvAgEAgQQAIfACAQCBBAAh8QIgANMEACECAAAAAQAgGgAASgAgCIACAQCBBAAhrAJAAIUEACGtAgEAgQQAIa4CAQCBBAAh6wIBAIQEACHvAgEAgQQAIfACAQCBBAAh8QIgANMEACECAAAAKwAgGgAATAAgAgAAACsAIBoAAEwAIAMAAAABACAhAABFACAiAABKACABAAAAAQAgAQAAACsAIAQLAAC9BgAgJwAAvwYAICgAAL4GACDrAgAA-wMAIAv9AQAA4gMAMP4BAABTABD_AQAA4gMAMIACAQCCAwAhrAJAAIYDACGtAgEAggMAIa4CAQCCAwAh6wIBAIUDACHvAgEAggMAIfACAQCCAwAh8QIgAMEDACEDAAAAKwAgAQAAUgAwJgAAUwAgAwAAACsAIAEAACwAMAIAAAEAIBYFAACkAwAgCgAApwMAIAwAAN4DACAPAADbAwAgEAAA3AMAIBEAAN0DACASAADfAwAgEwAA4AMAIBQAAOEDACD9AQAA1wMAMP4BAABZABD_AQAA1wMAMIACAQAAAAGbAkAAlwMAIawCQACXAwAhugIAANoD7wIi5wIBAJMDACHoAgEAAAAB6QIgANgDACHqAgEAlgMAIesCAQCWAwAh7QIAANkD7QIiAQAAAFYAIAEAAABWACAWBQAApAMAIAoAAKcDACAMAADeAwAgDwAA2wMAIBAAANwDACARAADdAwAgEgAA3wMAIBMAAOADACAUAADhAwAg_QEAANcDADD-AQAAWQAQ_wEAANcDADCAAgEAkwMAIZsCQACXAwAhrAJAAJcDACG6AgAA2gPvAiLnAgEAkwMAIegCAQCTAwAh6QIgANgDACHqAgEAlgMAIesCAQCWAwAh7QIAANkD7QIiCwUAAI0FACAKAACQBQAgDAAAuQYAIA8AALYGACAQAAC3BgAgEQAAuAYAIBIAALoGACATAAC7BgAgFAAAvAYAIOoCAAD7AwAg6wIAAPsDACADAAAAWQAgAQAAWgAwAgAAVgAgAwAAAFkAIAEAAFoAMAIAAFYAIAMAAABZACABAABaADACAABWACATBQAArQYAIAoAALMGACAMAACxBgAgDwAArgYAIBAAAK8GACARAACwBgAgEgAAsgYAIBMAALQGACAUAAC1BgAggAIBAAAAAZsCQAAAAAGsAkAAAAABugIAAADvAgLnAgEAAAAB6AIBAAAAAekCIAAAAAHqAgEAAAAB6wIBAAAAAe0CAAAA7QICARoAAF4AIAqAAgEAAAABmwJAAAAAAawCQAAAAAG6AgAAAO8CAucCAQAAAAHoAgEAAAAB6QIgAAAAAeoCAQAAAAHrAgEAAAAB7QIAAADtAgIBGgAAYAAwARoAAGAAMBMFAADIBQAgCgAAzgUAIAwAAMwFACAPAADJBQAgEAAAygUAIBEAAMsFACASAADNBQAgEwAAzwUAIBQAANAFACCAAgEAgQQAIZsCQACFBAAhrAJAAIUEACG6AgAAxwXvAiLnAgEAgQQAIegCAQCBBAAh6QIgANMEACHqAgEAhAQAIesCAQCEBAAh7QIAAMYF7QIiAgAAAFYAIBoAAGMAIAqAAgEAgQQAIZsCQACFBAAhrAJAAIUEACG6AgAAxwXvAiLnAgEAgQQAIegCAQCBBAAh6QIgANMEACHqAgEAhAQAIesCAQCEBAAh7QIAAMYF7QIiAgAAAFkAIBoAAGUAIAIAAABZACAaAABlACADAAAAVgAgIQAAXgAgIgAAYwAgAQAAAFYAIAEAAABZACAFCwAAwwUAICcAAMUFACAoAADEBQAg6gIAAPsDACDrAgAA-wMAIA39AQAA0AMAMP4BAABsABD_AQAA0AMAMIACAQCCAwAhmwJAAIYDACGsAkAAhgMAIboCAADSA-8CIucCAQCCAwAh6AIBAIIDACHpAiAAwQMAIeoCAQCFAwAh6wIBAIUDACHtAgAA0QPtAiIDAAAAWQAgAQAAawAwJgAAbAAgAwAAAFkAIAEAAFoAMAIAAFYAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgCQQAAMIFACCAAgEAAAABmwJAAAAAAawCQAAAAAGtAgEAAAAB2gJAAAAAAeQCAQAAAAHlAgEAAAAB5gIBAAAAAQEaAAB0ACAIgAIBAAAAAZsCQAAAAAGsAkAAAAABrQIBAAAAAdoCQAAAAAHkAgEAAAAB5QIBAAAAAeYCAQAAAAEBGgAAdgAwARoAAHYAMAkEAADBBQAggAIBAIEEACGbAkAAhQQAIawCQACFBAAhrQIBAIEEACHaAkAAhQQAIeQCAQCBBAAh5QIBAIQEACHmAgEAhAQAIQIAAAAzACAaAAB5ACAIgAIBAIEEACGbAkAAhQQAIawCQACFBAAhrQIBAIEEACHaAkAAhQQAIeQCAQCBBAAh5QIBAIQEACHmAgEAhAQAIQIAAAAxACAaAAB7ACACAAAAMQAgGgAAewAgAwAAADMAICEAAHQAICIAAHkAIAEAAAAzACABAAAAMQAgBQsAAL4FACAnAADABQAgKAAAvwUAIOUCAAD7AwAg5gIAAPsDACAL_QEAAM8DADD-AQAAggEAEP8BAADPAwAwgAIBAIIDACGbAkAAhgMAIawCQACGAwAhrQIBAIIDACHaAkAAhgMAIeQCAQCCAwAh5QIBAIUDACHmAgEAhQMAIQMAAAAxACABAACBAQAwJgAAggEAIAMAAAAxACABAAAyADACAAAzACABAAAANwAgAQAAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAwAAADUAIAEAADYAMAIAADcAIA4EAAC9BQAggAIBAAAAAZsCQAAAAAGsAkAAAAABrQIBAAAAAdsCAQAAAAHcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAgEAAAAB4AJAAAAAAeECQAAAAAHiAgEAAAAB4wIBAAAAAQEaAACKAQAgDYACAQAAAAGbAkAAAAABrAJAAAAAAa0CAQAAAAHbAgEAAAAB3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wIBAAAAAeACQAAAAAHhAkAAAAAB4gIBAAAAAeMCAQAAAAEBGgAAjAEAMAEaAACMAQAwDgQAALwFACCAAgEAgQQAIZsCQACFBAAhrAJAAIUEACGtAgEAgQQAIdsCAQCBBAAh3AIBAIEEACHdAgEAhAQAId4CAQCEBAAh3wIBAIQEACHgAkAAtAQAIeECQAC0BAAh4gIBAIQEACHjAgEAhAQAIQIAAAA3ACAaAACPAQAgDYACAQCBBAAhmwJAAIUEACGsAkAAhQQAIa0CAQCBBAAh2wIBAIEEACHcAgEAgQQAId0CAQCEBAAh3gIBAIQEACHfAgEAhAQAIeACQAC0BAAh4QJAALQEACHiAgEAhAQAIeMCAQCEBAAhAgAAADUAIBoAAJEBACACAAAANQAgGgAAkQEAIAMAAAA3ACAhAACKAQAgIgAAjwEAIAEAAAA3ACABAAAANQAgCgsAALkFACAnAAC7BQAgKAAAugUAIN0CAAD7AwAg3gIAAPsDACDfAgAA-wMAIOACAAD7AwAg4QIAAPsDACDiAgAA-wMAIOMCAAD7AwAgEP0BAADOAwAw_gEAAJgBABD_AQAAzgMAMIACAQCCAwAhmwJAAIYDACGsAkAAhgMAIa0CAQCCAwAh2wIBAIIDACHcAgEAggMAId0CAQCFAwAh3gIBAIUDACHfAgEAhQMAIeACQACqAwAh4QJAAKoDACHiAgEAhQMAIeMCAQCFAwAhAwAAADUAIAEAAJcBADAmAACYAQAgAwAAADUAIAEAADYAMAIAADcAIAn9AQAAzQMAMP4BAACeAQAQ_wEAAM0DADCAAgEAAAABmwJAAJcDACGsAkAAlwMAIdgCAQCTAwAh2QIBAJMDACHaAkAAlwMAIQEAAACbAQAgAQAAAJsBACAJ_QEAAM0DADD-AQAAngEAEP8BAADNAwAwgAIBAJMDACGbAkAAlwMAIawCQACXAwAh2AIBAJMDACHZAgEAkwMAIdoCQACXAwAhAAMAAACeAQAgAQAAnwEAMAIAAJsBACADAAAAngEAIAEAAJ8BADACAACbAQAgAwAAAJ4BACABAACfAQAwAgAAmwEAIAaAAgEAAAABmwJAAAAAAawCQAAAAAHYAgEAAAAB2QIBAAAAAdoCQAAAAAEBGgAAowEAIAaAAgEAAAABmwJAAAAAAawCQAAAAAHYAgEAAAAB2QIBAAAAAdoCQAAAAAEBGgAApQEAMAEaAAClAQAwBoACAQCBBAAhmwJAAIUEACGsAkAAhQQAIdgCAQCBBAAh2QIBAIEEACHaAkAAhQQAIQIAAACbAQAgGgAAqAEAIAaAAgEAgQQAIZsCQACFBAAhrAJAAIUEACHYAgEAgQQAIdkCAQCBBAAh2gJAAIUEACECAAAAngEAIBoAAKoBACACAAAAngEAIBoAAKoBACADAAAAmwEAICEAAKMBACAiAACoAQAgAQAAAJsBACABAAAAngEAIAMLAAC2BQAgJwAAuAUAICgAALcFACAJ_QEAAMwDADD-AQAAsQEAEP8BAADMAwAwgAIBAIIDACGbAkAAhgMAIawCQACGAwAh2AIBAIIDACHZAgEAggMAIdoCQACGAwAhAwAAAJ4BACABAACwAQAwJgAAsQEAIAMAAACeAQAgAQAAnwEAMAIAAJsBACABAAAAKQAgAQAAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAgEAAC1BQAggAIBAAAAAawCQAAAAAGtAgEAAAAB0wIBAAAAAdQCAQAAAAHWAgAAANYCAtcCIAAAAAEBGgAAuQEAIAeAAgEAAAABrAJAAAAAAa0CAQAAAAHTAgEAAAAB1AIBAAAAAdYCAAAA1gIC1wIgAAAAAQEaAAC7AQAwARoAALsBADAIBAAAtAUAIIACAQCBBAAhrAJAAIUEACGtAgEAgQQAIdMCAQCBBAAh1AIBAIEEACHWAgAAswXWAiLXAiAA0wQAIQIAAAApACAaAAC-AQAgB4ACAQCBBAAhrAJAAIUEACGtAgEAgQQAIdMCAQCBBAAh1AIBAIEEACHWAgAAswXWAiLXAiAA0wQAIQIAAAAnACAaAADAAQAgAgAAACcAIBoAAMABACADAAAAKQAgIQAAuQEAICIAAL4BACABAAAAKQAgAQAAACcAIAMLAACwBQAgJwAAsgUAICgAALEFACAK_QEAAMgDADD-AQAAxwEAEP8BAADIAwAwgAIBAIIDACGsAkAAhgMAIa0CAQCCAwAh0wIBAIIDACHUAgEAggMAIdYCAADJA9YCItcCIADBAwAhAwAAACcAIAEAAMYBADAmAADHAQAgAwAAACcAIAEAACgAMAIAACkAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgFgMAAIIFACAGAACvBQAgCgAAhgUAIAwAAIMFACANAACEBQAgDgAAhQUAIIACAQAAAAGbAkAAAAABpwIBAAAAAagCAQAAAAGsAkAAAAABugIAAADEAgLHAgEAAAAByAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAcwCCAAAAAHOAgAAAM4CAtACAAAA0AIC0QIIAAAAAdICIAAAAAEBGgAAzwEAIBCAAgEAAAABmwJAAAAAAacCAQAAAAGoAgEAAAABrAJAAAAAAboCAAAAxAICxwIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAggAAAABzgIAAADOAgLQAgAAANACAtECCAAAAAHSAiAAAAABARoAANEBADABGgAA0QEAMAEAAAAHACAWAwAA1QQAIAYAAK4FACAKAADZBAAgDAAA1gQAIA0AANcEACAOAADYBAAggAIBAIEEACGbAkAAhQQAIacCAQCEBAAhqAIBAIEEACGsAkAAhQQAIboCAADSBMQCIscCAQCBBAAhyAIBAIEEACHJAgEAgQQAIcoCAQCBBAAhywIBAIEEACHMAggAgwQAIc4CAADQBM4CItACAADRBNACItECCACDBAAh0gIgANMEACECAAAABQAgGgAA1QEAIBCAAgEAgQQAIZsCQACFBAAhpwIBAIQEACGoAgEAgQQAIawCQACFBAAhugIAANIExAIixwIBAIEEACHIAgEAgQQAIckCAQCBBAAhygIBAIEEACHLAgEAgQQAIcwCCACDBAAhzgIAANAEzgIi0AIAANEE0AIi0QIIAIMEACHSAiAA0wQAIQIAAAADACAaAADXAQAgAgAAAAMAIBoAANcBACABAAAABwAgAwAAAAUAICEAAM8BACAiAADVAQAgAQAAAAUAIAEAAAADACAGCwAAqQUAICcAAKwFACAoAACrBQAgiQEAAKoFACCKAQAArQUAIKcCAAD7AwAgE_0BAAC-AwAw_gEAAN8BABD_AQAAvgMAMIACAQCCAwAhmwJAAIYDACGnAgEAhQMAIagCAQCCAwAhrAJAAIYDACG6AgAAuwPEAiLHAgEAggMAIcgCAQCCAwAhyQIBAIIDACHKAgEAggMAIcsCAQCCAwAhzAIIAIQDACHOAgAAvwPOAiLQAgAAwAPQAiLRAggAhAMAIdICIADBAwAhAwAAAAMAIAEAAN4BADAmAADfAQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAcACABAAAAHAAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgCAQAAIAFACAHAACoBQAggAIBAAAAAakCAQAAAAG6AgAAAMQCAsQCAQAAAAHFAgEAAAABxgJAAAAAAQEaAADnAQAgBoACAQAAAAGpAgEAAAABugIAAADEAgLEAgEAAAABxQIBAAAAAcYCQAAAAAEBGgAA6QEAMAEaAADpAQAwCAQAAP4EACAHAACnBQAggAIBAIEEACGpAgEAgQQAIboCAADSBMQCIsQCAQCBBAAhxQIBAIQEACHGAkAAhQQAIQIAAAAcACAaAADsAQAgBoACAQCBBAAhqQIBAIEEACG6AgAA0gTEAiLEAgEAgQQAIcUCAQCEBAAhxgJAAIUEACECAAAAGgAgGgAA7gEAIAIAAAAaACAaAADuAQAgAwAAABwAICEAAOcBACAiAADsAQAgAQAAABwAIAEAAAAaACAECwAApAUAICcAAKYFACAoAAClBQAgxQIAAPsDACAJ_QEAALoDADD-AQAA9QEAEP8BAAC6AwAwgAIBAIIDACGpAgEAggMAIboCAAC7A8QCIsQCAQCCAwAhxQIBAIUDACHGAkAAhgMAIQMAAAAaACABAAD0AQAwJgAA9QEAIAMAAAAaACABAAAbADACAAAcACABAAAAJQAgAQAAACUAIAMAAAAeACABAAAkADACAAAlACADAAAAHgAgAQAAJAAwAgAAJQAgAwAAAB4AIAEAACQAMAIAACUAIAoDAADyBAAgBwAAowUAIIACAQAAAAGoAgEAAAABqQIBAAAAAawCQAAAAAG4AggAAAABugIAAADDAgLAAgAAAMACAsECAQAAAAEBGgAA_QEAIAiAAgEAAAABqAIBAAAAAakCAQAAAAGsAkAAAAABuAIIAAAAAboCAAAAwwICwAIAAADAAgLBAgEAAAABARoAAP8BADABGgAA_wEAMAoDAADxBAAgBwAAogUAIIACAQCBBAAhqAIBAIEEACGpAgEAgQQAIawCQACFBAAhuAIIAIMEACG6AgAA8ATDAiLAAgAA7wTAAiLBAgEAhAQAIQIAAAAlACAaAACCAgAgCIACAQCBBAAhqAIBAIEEACGpAgEAgQQAIawCQACFBAAhuAIIAIMEACG6AgAA8ATDAiLAAgAA7wTAAiLBAgEAhAQAIQIAAAAeACAaAACEAgAgAgAAAB4AIBoAAIQCACADAAAAJQAgIQAA_QEAICIAAIICACABAAAAJQAgAQAAAB4AIAYLAACdBQAgJwAAoAUAICgAAJ8FACCJAQAAngUAIIoBAAChBQAgwQIAAPsDACAL_QEAALMDADD-AQAAiwIAEP8BAACzAwAwgAIBAIIDACGoAgEAggMAIakCAQCCAwAhrAJAAIYDACG4AggAhAMAIboCAAC1A8MCIsACAAC0A8ACIsECAQCFAwAhAwAAAB4AIAEAAIoCADAmAACLAgAgAwAAAB4AIAEAACQAMAIAACUAIAEAAAAMACABAAAADAAgAwAAAAoAIAEAAAsAMAIAAAwAIAMAAAAKACABAAALADACAAAMACADAAAACgAgAQAACwAwAgAADAAgCQYAAOkEACAHAADFBAAggAIBAAAAAacCAQAAAAGpAgEAAAABrAJAAAAAAbgCCAAAAAG6AgAAAL8CAr0CCAAAAAEBGgAAkwIAIAeAAgEAAAABpwIBAAAAAakCAQAAAAGsAkAAAAABuAIIAAAAAboCAAAAvwICvQIIAAAAAQEaAACVAgAwARoAAJUCADAJBgAA6AQAIAcAAMMEACCAAgEAgQQAIacCAQCBBAAhqQIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACECAAAADAAgGgAAmAIAIAeAAgEAgQQAIacCAQCBBAAhqQIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACECAAAACgAgGgAAmgIAIAIAAAAKACAaAACaAgAgAwAAAAwAICEAAJMCACAiAACYAgAgAQAAAAwAIAEAAAAKACAFCwAAmAUAICcAAJsFACAoAACaBQAgiQEAAJkFACCKAQAAnAUAIAr9AQAArwMAMP4BAAChAgAQ_wEAAK8DADCAAgEAggMAIacCAQCCAwAhqQIBAIIDACGsAkAAhgMAIbgCCACEAwAhugIAALADvwIivQIIAIQDACEDAAAACgAgAQAAoAIAMCYAAKECACADAAAACgAgAQAACwAwAgAADAAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACAHBgAAlwUAIIACAQAAAAGnAgEAAAABuAIIAAAAAboCAAAAugICuwJAAAAAAbwCQAAAAAEBGgAAqQIAIAaAAgEAAAABpwIBAAAAAbgCCAAAAAG6AgAAALoCArsCQAAAAAG8AkAAAAABARoAAKsCADABGgAAqwIAMAcGAACWBQAggAIBAIEEACGnAgEAgQQAIbgCCACDBAAhugIAALMEugIiuwJAAIUEACG8AkAAtAQAIQIAAAAQACAaAACuAgAgBoACAQCBBAAhpwIBAIEEACG4AggAgwQAIboCAACzBLoCIrsCQACFBAAhvAJAALQEACECAAAADgAgGgAAsAIAIAIAAAAOACAaAACwAgAgAwAAABAAICEAAKkCACAiAACuAgAgAQAAABAAIAEAAAAOACAGCwAAkQUAICcAAJQFACAoAACTBQAgiQEAAJIFACCKAQAAlQUAILwCAAD7AwAgCf0BAACoAwAw_gEAALcCABD_AQAAqAMAMIACAQCCAwAhpwIBAIIDACG4AggAhAMAIboCAACpA7oCIrsCQACGAwAhvAJAAKoDACEDAAAADgAgAQAAtgIAMCYAALcCACADAAAADgAgAQAADwAwAgAAEAAgEgQAAKMDACAFAACkAwAgCAAApQMAIAkAAKYDACAKAACnAwAg_QEAAKADADD-AQAABwAQ_wEAAKADADCAAgEAAAABmwJAAJcDACGqAggAlQMAIawCQACXAwAhrQIBAAAAAa4CAQCTAwAhsAIAAKEDsAIisgIAAKIDsgIiswICAJQDACG0AgIAlAMAIQEAAAC6AgAgAQAAALoCACAFBAAAjAUAIAUAAI0FACAIAACOBQAgCQAAjwUAIAoAAJAFACADAAAABwAgAQAAvQIAMAIAALoCACADAAAABwAgAQAAvQIAMAIAALoCACADAAAABwAgAQAAvQIAMAIAALoCACAPBAAAhwUAIAUAAIgFACAIAACJBQAgCQAAigUAIAoAAIsFACCAAgEAAAABmwJAAAAAAaoCCAAAAAGsAkAAAAABrQIBAAAAAa4CAQAAAAGwAgAAALACArICAAAAsgICswICAAAAAbQCAgAAAAEBGgAAwQIAIAqAAgEAAAABmwJAAAAAAaoCCAAAAAGsAkAAAAABrQIBAAAAAa4CAQAAAAGwAgAAALACArICAAAAsgICswICAAAAAbQCAgAAAAEBGgAAwwIAMAEaAADDAgAwDwQAAJgEACAFAACZBAAgCAAAmgQAIAkAAJsEACAKAACcBAAggAIBAIEEACGbAkAAhQQAIaoCCACDBAAhrAJAAIUEACGtAgEAgQQAIa4CAQCBBAAhsAIAAJYEsAIisgIAAJcEsgIiswICAIIEACG0AgIAggQAIQIAAAC6AgAgGgAAxgIAIAqAAgEAgQQAIZsCQACFBAAhqgIIAIMEACGsAkAAhQQAIa0CAQCBBAAhrgIBAIEEACGwAgAAlgSwAiKyAgAAlwSyAiKzAgIAggQAIbQCAgCCBAAhAgAAAAcAIBoAAMgCACACAAAABwAgGgAAyAIAIAMAAAC6AgAgIQAAwQIAICIAAMYCACABAAAAugIAIAEAAAAHACAFCwAAkQQAICcAAJQEACAoAACTBAAgiQEAAJIEACCKAQAAlQQAIA39AQAAmQMAMP4BAADPAgAQ_wEAAJkDADCAAgEAggMAIZsCQACGAwAhqgIIAIQDACGsAkAAhgMAIa0CAQCCAwAhrgIBAIIDACGwAgAAmgOwAiKyAgAAmwOyAiKzAgIAgwMAIbQCAgCDAwAhAwAAAAcAIAEAAM4CADAmAADPAgAgAwAAAAcAIAEAAL0CADACAAC6AgAgAQAAABQAIAEAAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACALAwAAjwQAIAYAAI4EACAHAACQBAAggAIBAAAAAZsCQAAAAAGnAgEAAAABqAIBAAAAAakCAQAAAAGqAgIAAAABqwIBAAAAAawCQAAAAAEBGgAA1wIAIAiAAgEAAAABmwJAAAAAAacCAQAAAAGoAgEAAAABqQIBAAAAAaoCAgAAAAGrAgEAAAABrAJAAAAAAQEaAADZAgAwARoAANkCADALAwAAjAQAIAYAAIsEACAHAACNBAAggAIBAIEEACGbAkAAhQQAIacCAQCBBAAhqAIBAIEEACGpAgEAgQQAIaoCAgCCBAAhqwIBAIQEACGsAkAAhQQAIQIAAAAUACAaAADcAgAgCIACAQCBBAAhmwJAAIUEACGnAgEAgQQAIagCAQCBBAAhqQIBAIEEACGqAgIAggQAIasCAQCEBAAhrAJAAIUEACECAAAAEgAgGgAA3gIAIAIAAAASACAaAADeAgAgAwAAABQAICEAANcCACAiAADcAgAgAQAAABQAIAEAAAASACAGCwAAhgQAICcAAIkEACAoAACIBAAgiQEAAIcEACCKAQAAigQAIKsCAAD7AwAgC_0BAACYAwAw_gEAAOUCABD_AQAAmAMAMIACAQCCAwAhmwJAAIYDACGnAgEAggMAIagCAQCCAwAhqQIBAIIDACGqAgIAgwMAIasCAQCFAwAhrAJAAIYDACEDAAAAEgAgAQAA5AIAMCYAAOUCACADAAAAEgAgAQAAEwAwAgAAFAAgH_0BAACSAwAw_gEAAOsCABD_AQAAkgMAMIACAQAAAAGBAgIAlAMAIYICAgCUAwAhgwICAJQDACGEAgIAlAMAIYUCCACVAwAhhgIIAJUDACGHAggAlQMAIYgCCACVAwAhiQICAJQDACGKAgIAlAMAIYsCAgCUAwAhjAICAJQDACGNAgIAlAMAIY4CAgCUAwAhjwIBAJYDACGQAgIAlAMAIZECAgCUAwAhkgIIAJUDACGTAggAlQMAIZQCCACVAwAhlQIIAJUDACGWAggAlQMAIZcCCACVAwAhmAICAJQDACGZAgIAlAMAIZoCAgCUAwAhmwJAAJcDACEBAAAA6AIAIAEAAADoAgAgH_0BAACSAwAw_gEAAOsCABD_AQAAkgMAMIACAQCTAwAhgQICAJQDACGCAgIAlAMAIYMCAgCUAwAhhAICAJQDACGFAggAlQMAIYYCCACVAwAhhwIIAJUDACGIAggAlQMAIYkCAgCUAwAhigICAJQDACGLAgIAlAMAIYwCAgCUAwAhjQICAJQDACGOAgIAlAMAIY8CAQCWAwAhkAICAJQDACGRAgIAlAMAIZICCACVAwAhkwIIAJUDACGUAggAlQMAIZUCCACVAwAhlgIIAJUDACGXAggAlQMAIZgCAgCUAwAhmQICAJQDACGaAgIAlAMAIZsCQACXAwAhAY8CAAD7AwAgAwAAAOsCACABAADsAgAwAgAA6AIAIAMAAADrAgAgAQAA7AIAMAIAAOgCACADAAAA6wIAIAEAAOwCADACAADoAgAgHIACAQAAAAGBAgIAAAABggICAAAAAYMCAgAAAAGEAgIAAAABhQIIAAAAAYYCCAAAAAGHAggAAAABiAIIAAAAAYkCAgAAAAGKAgIAAAABiwICAAAAAYwCAgAAAAGNAgIAAAABjgICAAAAAY8CAQAAAAGQAgIAAAABkQICAAAAAZICCAAAAAGTAggAAAABlAIIAAAAAZUCCAAAAAGWAggAAAABlwIIAAAAAZgCAgAAAAGZAgIAAAABmgICAAAAAZsCQAAAAAEBGgAA8AIAIByAAgEAAAABgQICAAAAAYICAgAAAAGDAgIAAAABhAICAAAAAYUCCAAAAAGGAggAAAABhwIIAAAAAYgCCAAAAAGJAgIAAAABigICAAAAAYsCAgAAAAGMAgIAAAABjQICAAAAAY4CAgAAAAGPAgEAAAABkAICAAAAAZECAgAAAAGSAggAAAABkwIIAAAAAZQCCAAAAAGVAggAAAABlgIIAAAAAZcCCAAAAAGYAgIAAAABmQICAAAAAZoCAgAAAAGbAkAAAAABARoAAPICADABGgAA8gIAMByAAgEAgQQAIYECAgCCBAAhggICAIIEACGDAgIAggQAIYQCAgCCBAAhhQIIAIMEACGGAggAgwQAIYcCCACDBAAhiAIIAIMEACGJAgIAggQAIYoCAgCCBAAhiwICAIIEACGMAgIAggQAIY0CAgCCBAAhjgICAIIEACGPAgEAhAQAIZACAgCCBAAhkQICAIIEACGSAggAgwQAIZMCCACDBAAhlAIIAIMEACGVAggAgwQAIZYCCACDBAAhlwIIAIMEACGYAgIAggQAIZkCAgCCBAAhmgICAIIEACGbAkAAhQQAIQIAAADoAgAgGgAA9QIAIByAAgEAgQQAIYECAgCCBAAhggICAIIEACGDAgIAggQAIYQCAgCCBAAhhQIIAIMEACGGAggAgwQAIYcCCACDBAAhiAIIAIMEACGJAgIAggQAIYoCAgCCBAAhiwICAIIEACGMAgIAggQAIY0CAgCCBAAhjgICAIIEACGPAgEAhAQAIZACAgCCBAAhkQICAIIEACGSAggAgwQAIZMCCACDBAAhlAIIAIMEACGVAggAgwQAIZYCCACDBAAhlwIIAIMEACGYAgIAggQAIZkCAgCCBAAhmgICAIIEACGbAkAAhQQAIQIAAADrAgAgGgAA9wIAIAIAAADrAgAgGgAA9wIAIAMAAADoAgAgIQAA8AIAICIAAPUCACABAAAA6AIAIAEAAADrAgAgBgsAAPwDACAnAAD_AwAgKAAA_gMAIIkBAAD9AwAgigEAAIAEACCPAgAA-wMAIB_9AQAAgQMAMP4BAAD-AgAQ_wEAAIEDADCAAgEAggMAIYECAgCDAwAhggICAIMDACGDAgIAgwMAIYQCAgCDAwAhhQIIAIQDACGGAggAhAMAIYcCCACEAwAhiAIIAIQDACGJAgIAgwMAIYoCAgCDAwAhiwICAIMDACGMAgIAgwMAIY0CAgCDAwAhjgICAIMDACGPAgEAhQMAIZACAgCDAwAhkQICAIMDACGSAggAhAMAIZMCCACEAwAhlAIIAIQDACGVAggAhAMAIZYCCACEAwAhlwIIAIQDACGYAgIAgwMAIZkCAgCDAwAhmgICAIMDACGbAkAAhgMAIQMAAADrAgAgAQAA_QIAMCYAAP4CACADAAAA6wIAIAEAAOwCADACAADoAgAgH_0BAACBAwAw_gEAAP4CABD_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_QEAAJIDADD-AQAA6wIAEP8BAACSAwAwgAIBAJMDACGBAgIAlAMAIYICAgCUAwAhgwICAJQDACGEAgIAlAMAIYUCCACVAwAhhgIIAJUDACGHAggAlQMAIYgCCACVAwAhiQICAJQDACGKAgIAlAMAIYsCAgCUAwAhjAICAJQDACGNAgIAlAMAIY4CAgCUAwAhjwIBAJYDACGQAgIAlAMAIZECAgCUAwAhkgIIAJUDACGTAggAlQMAIZQCCACVAwAhlQIIAJUDACGWAggAlQMAIZcCCACVAwAhmAICAJQDACGZAgIAlAMAIZoCAgCUAwAhmwJAAJcDACELnAIBAAAAAZ0CAQAAAASeAgEAAAAEnwIBAAAAAaACAQAAAAGhAgEAAAABogIBAAAAAaMCAQCRAwAhpAIBAAAAAaUCAQAAAAGmAgEAAAABCJwCAgAAAAGdAgIAAAAEngICAAAABJ8CAgAAAAGgAgIAAAABoQICAAAAAaICAgAAAAGjAgIAiAMAIQicAggAAAABnQIIAAAABJ4CCAAAAASfAggAAAABoAIIAAAAAaECCAAAAAGiAggAAAABowIIAI4DACELnAIBAAAAAZ0CAQAAAAWeAgEAAAAFnwIBAAAAAaACAQAAAAGhAgEAAAABogIBAAAAAaMCAQCMAwAhpAIBAAAAAaUCAQAAAAGmAgEAAAABCJwCQAAAAAGdAkAAAAAEngJAAAAABJ8CQAAAAAGgAkAAAAABoQJAAAAAAaICQAAAAAGjAkAAiQMAIQv9AQAAmAMAMP4BAADlAgAQ_wEAAJgDADCAAgEAggMAIZsCQACGAwAhpwIBAIIDACGoAgEAggMAIakCAQCCAwAhqgICAIMDACGrAgEAhQMAIawCQACGAwAhDf0BAACZAwAw_gEAAM8CABD_AQAAmQMAMIACAQCCAwAhmwJAAIYDACGqAggAhAMAIawCQACGAwAhrQIBAIIDACGuAgEAggMAIbACAACaA7ACIrICAACbA7ICIrMCAgCDAwAhtAICAIMDACEHCwAAiAMAICcAAJ8DACAoAACfAwAgnAIAAACwAgKdAgAAALACCJ4CAAAAsAIIowIAAJ4DsAIiBwsAAIgDACAnAACdAwAgKAAAnQMAIJwCAAAAsgICnQIAAACyAgieAgAAALICCKMCAACcA7ICIgcLAACIAwAgJwAAnQMAICgAAJ0DACCcAgAAALICAp0CAAAAsgIIngIAAACyAgijAgAAnAOyAiIEnAIAAACyAgKdAgAAALICCJ4CAAAAsgIIowIAAJ0DsgIiBwsAAIgDACAnAACfAwAgKAAAnwMAIJwCAAAAsAICnQIAAACwAgieAgAAALACCKMCAACeA7ACIgScAgAAALACAp0CAAAAsAIIngIAAACwAgijAgAAnwOwAiISBAAAowMAIAUAAKQDACAIAAClAwAgCQAApgMAIAoAAKcDACD9AQAAoAMAMP4BAAAHABD_AQAAoAMAMIACAQCTAwAhmwJAAJcDACGqAggAlQMAIawCQACXAwAhrQIBAJMDACGuAgEAkwMAIbACAAChA7ACIrICAACiA7ICIrMCAgCUAwAhtAICAJQDACEEnAIAAACwAgKdAgAAALACCJ4CAAAAsAIIowIAAJ8DsAIiBJwCAAAAsgICnQIAAACyAgieAgAAALICCKMCAACdA7ICIhgFAACkAwAgCgAApwMAIAwAAN4DACAPAADbAwAgEAAA3AMAIBEAAN0DACASAADfAwAgEwAA4AMAIBQAAOEDACD9AQAA1wMAMP4BAABZABD_AQAA1wMAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIboCAADaA-8CIucCAQCTAwAh6AIBAJMDACHpAiAA2AMAIeoCAQCWAwAh6wIBAJYDACHtAgAA2QPtAiLzAgAAWQAg9AIAAFkAIAO1AgAAAwAgtgIAAAMAILcCAAADACADtQIAAAoAILYCAAAKACC3AgAACgAgA7UCAAAOACC2AgAADgAgtwIAAA4AIAO1AgAAEgAgtgIAABIAILcCAAASACAJ_QEAAKgDADD-AQAAtwIAEP8BAACoAwAwgAIBAIIDACGnAgEAggMAIbgCCACEAwAhugIAAKkDugIiuwJAAIYDACG8AkAAqgMAIQcLAACIAwAgJwAArgMAICgAAK4DACCcAgAAALoCAp0CAAAAugIIngIAAAC6AgijAgAArQO6AiILCwAAiwMAICcAAKwDACAoAACsAwAgnAJAAAAAAZ0CQAAAAAWeAkAAAAAFnwJAAAAAAaACQAAAAAGhAkAAAAABogJAAAAAAaMCQACrAwAhCwsAAIsDACAnAACsAwAgKAAArAMAIJwCQAAAAAGdAkAAAAAFngJAAAAABZ8CQAAAAAGgAkAAAAABoQJAAAAAAaICQAAAAAGjAkAAqwMAIQicAkAAAAABnQJAAAAABZ4CQAAAAAWfAkAAAAABoAJAAAAAAaECQAAAAAGiAkAAAAABowJAAKwDACEHCwAAiAMAICcAAK4DACAoAACuAwAgnAIAAAC6AgKdAgAAALoCCJ4CAAAAugIIowIAAK0DugIiBJwCAAAAugICnQIAAAC6AgieAgAAALoCCKMCAACuA7oCIgr9AQAArwMAMP4BAAChAgAQ_wEAAK8DADCAAgEAggMAIacCAQCCAwAhqQIBAIIDACGsAkAAhgMAIbgCCACEAwAhugIAALADvwIivQIIAIQDACEHCwAAiAMAICcAALIDACAoAACyAwAgnAIAAAC_AgKdAgAAAL8CCJ4CAAAAvwIIowIAALEDvwIiBwsAAIgDACAnAACyAwAgKAAAsgMAIJwCAAAAvwICnQIAAAC_AgieAgAAAL8CCKMCAACxA78CIgScAgAAAL8CAp0CAAAAvwIIngIAAAC_AgijAgAAsgO_AiIL_QEAALMDADD-AQAAiwIAEP8BAACzAwAwgAIBAIIDACGoAgEAggMAIakCAQCCAwAhrAJAAIYDACG4AggAhAMAIboCAAC1A8MCIsACAAC0A8ACIsECAQCFAwAhBwsAAIgDACAnAAC5AwAgKAAAuQMAIJwCAAAAwAICnQIAAADAAgieAgAAAMACCKMCAAC4A8ACIgcLAACIAwAgJwAAtwMAICgAALcDACCcAgAAAMMCAp0CAAAAwwIIngIAAADDAgijAgAAtgPDAiIHCwAAiAMAICcAALcDACAoAAC3AwAgnAIAAADDAgKdAgAAAMMCCJ4CAAAAwwIIowIAALYDwwIiBJwCAAAAwwICnQIAAADDAgieAgAAAMMCCKMCAAC3A8MCIgcLAACIAwAgJwAAuQMAICgAALkDACCcAgAAAMACAp0CAAAAwAIIngIAAADAAgijAgAAuAPAAiIEnAIAAADAAgKdAgAAAMACCJ4CAAAAwAIIowIAALkDwAIiCf0BAAC6AwAw_gEAAPUBABD_AQAAugMAMIACAQCCAwAhqQIBAIIDACG6AgAAuwPEAiLEAgEAggMAIcUCAQCFAwAhxgJAAIYDACEHCwAAiAMAICcAAL0DACAoAAC9AwAgnAIAAADEAgKdAgAAAMQCCJ4CAAAAxAIIowIAALwDxAIiBwsAAIgDACAnAAC9AwAgKAAAvQMAIJwCAAAAxAICnQIAAADEAgieAgAAAMQCCKMCAAC8A8QCIgScAgAAAMQCAp0CAAAAxAIIngIAAADEAgijAgAAvQPEAiIT_QEAAL4DADD-AQAA3wEAEP8BAAC-AwAwgAIBAIIDACGbAkAAhgMAIacCAQCFAwAhqAIBAIIDACGsAkAAhgMAIboCAAC7A8QCIscCAQCCAwAhyAIBAIIDACHJAgEAggMAIcoCAQCCAwAhywIBAIIDACHMAggAhAMAIc4CAAC_A84CItACAADAA9ACItECCACEAwAh0gIgAMEDACEHCwAAiAMAICcAAMcDACAoAADHAwAgnAIAAADOAgKdAgAAAM4CCJ4CAAAAzgIIowIAAMYDzgIiBwsAAIgDACAnAADFAwAgKAAAxQMAIJwCAAAA0AICnQIAAADQAgieAgAAANACCKMCAADEA9ACIgULAACIAwAgJwAAwwMAICgAAMMDACCcAiAAAAABowIgAMIDACEFCwAAiAMAICcAAMMDACAoAADDAwAgnAIgAAAAAaMCIADCAwAhApwCIAAAAAGjAiAAwwMAIQcLAACIAwAgJwAAxQMAICgAAMUDACCcAgAAANACAp0CAAAA0AIIngIAAADQAgijAgAAxAPQAiIEnAIAAADQAgKdAgAAANACCJ4CAAAA0AIIowIAAMUD0AIiBwsAAIgDACAnAADHAwAgKAAAxwMAIJwCAAAAzgICnQIAAADOAgieAgAAAM4CCKMCAADGA84CIgScAgAAAM4CAp0CAAAAzgIIngIAAADOAgijAgAAxwPOAiIK_QEAAMgDADD-AQAAxwEAEP8BAADIAwAwgAIBAIIDACGsAkAAhgMAIa0CAQCCAwAh0wIBAIIDACHUAgEAggMAIdYCAADJA9YCItcCIADBAwAhBwsAAIgDACAnAADLAwAgKAAAywMAIJwCAAAA1gICnQIAAADWAgieAgAAANYCCKMCAADKA9YCIgcLAACIAwAgJwAAywMAICgAAMsDACCcAgAAANYCAp0CAAAA1gIIngIAAADWAgijAgAAygPWAiIEnAIAAADWAgKdAgAAANYCCJ4CAAAA1gIIowIAAMsD1gIiCf0BAADMAwAw_gEAALEBABD_AQAAzAMAMIACAQCCAwAhmwJAAIYDACGsAkAAhgMAIdgCAQCCAwAh2QIBAIIDACHaAkAAhgMAIQn9AQAAzQMAMP4BAACeAQAQ_wEAAM0DADCAAgEAkwMAIZsCQACXAwAhrAJAAJcDACHYAgEAkwMAIdkCAQCTAwAh2gJAAJcDACEQ_QEAAM4DADD-AQAAmAEAEP8BAADOAwAwgAIBAIIDACGbAkAAhgMAIawCQACGAwAhrQIBAIIDACHbAgEAggMAIdwCAQCCAwAh3QIBAIUDACHeAgEAhQMAId8CAQCFAwAh4AJAAKoDACHhAkAAqgMAIeICAQCFAwAh4wIBAIUDACEL_QEAAM8DADD-AQAAggEAEP8BAADPAwAwgAIBAIIDACGbAkAAhgMAIawCQACGAwAhrQIBAIIDACHaAkAAhgMAIeQCAQCCAwAh5QIBAIUDACHmAgEAhQMAIQ39AQAA0AMAMP4BAABsABD_AQAA0AMAMIACAQCCAwAhmwJAAIYDACGsAkAAhgMAIboCAADSA-8CIucCAQCCAwAh6AIBAIIDACHpAiAAwQMAIeoCAQCFAwAh6wIBAIUDACHtAgAA0QPtAiIHCwAAiAMAICcAANYDACAoAADWAwAgnAIAAADtAgKdAgAAAO0CCJ4CAAAA7QIIowIAANUD7QIiBwsAAIgDACAnAADUAwAgKAAA1AMAIJwCAAAA7wICnQIAAADvAgieAgAAAO8CCKMCAADTA-8CIgcLAACIAwAgJwAA1AMAICgAANQDACCcAgAAAO8CAp0CAAAA7wIIngIAAADvAgijAgAA0wPvAiIEnAIAAADvAgKdAgAAAO8CCJ4CAAAA7wIIowIAANQD7wIiBwsAAIgDACAnAADWAwAgKAAA1gMAIJwCAAAA7QICnQIAAADtAgieAgAAAO0CCKMCAADVA-0CIgScAgAAAO0CAp0CAAAA7QIIngIAAADtAgijAgAA1gPtAiIWBQAApAMAIAoAAKcDACAMAADeAwAgDwAA2wMAIBAAANwDACARAADdAwAgEgAA3wMAIBMAAOADACAUAADhAwAg_QEAANcDADD-AQAAWQAQ_wEAANcDADCAAgEAkwMAIZsCQACXAwAhrAJAAJcDACG6AgAA2gPvAiLnAgEAkwMAIegCAQCTAwAh6QIgANgDACHqAgEAlgMAIesCAQCWAwAh7QIAANkD7QIiApwCIAAAAAGjAiAAwwMAIQScAgAAAO0CAp0CAAAA7QIIngIAAADtAgijAgAA1gPtAiIEnAIAAADvAgKdAgAAAO8CCJ4CAAAA7wIIowIAANQD7wIiA7UCAAAeACC2AgAAHgAgtwIAAB4AIAO1AgAAJwAgtgIAACcAILcCAAAnACADtQIAACsAILYCAAArACC3AgAAKwAgA7UCAAAaACC2AgAAGgAgtwIAABoAIBQEAACjAwAgBQAApAMAIAgAAKUDACAJAACmAwAgCgAApwMAIP0BAACgAwAw_gEAAAcAEP8BAACgAwAwgAIBAJMDACGbAkAAlwMAIaoCCACVAwAhrAJAAJcDACGtAgEAkwMAIa4CAQCTAwAhsAIAAKEDsAIisgIAAKIDsgIiswICAJQDACG0AgIAlAMAIfMCAAAHACD0AgAABwAgA7UCAAAxACC2AgAAMQAgtwIAADEAIAO1AgAANQAgtgIAADUAILcCAAA1ACAL_QEAAOIDADD-AQAAUwAQ_wEAAOIDADCAAgEAggMAIawCQACGAwAhrQIBAIIDACGuAgEAggMAIesCAQCFAwAh7wIBAIIDACHwAgEAggMAIfECIADBAwAhEQQAAKMDACD9AQAA4wMAMP4BAAA1ABD_AQAA4wMAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2wIBAJMDACHcAgEAkwMAId0CAQCWAwAh3gIBAJYDACHfAgEAlgMAIeACQADkAwAh4QJAAOQDACHiAgEAlgMAIeMCAQCWAwAhCJwCQAAAAAGdAkAAAAAFngJAAAAABZ8CQAAAAAGgAkAAAAABoQJAAAAAAaICQAAAAAGjAkAArAMAIQwEAACjAwAg_QEAAOUDADD-AQAAMQAQ_wEAAOUDADCAAgEAkwMAIZsCQACXAwAhrAJAAJcDACGtAgEAkwMAIdoCQACXAwAh5AIBAJMDACHlAgEAlgMAIeYCAQCWAwAhDAQAAKMDACD9AQAA5gMAMP4BAAArABD_AQAA5gMAMIACAQCTAwAhrAJAAJcDACGtAgEAkwMAIa4CAQCTAwAh6wIBAJYDACHvAgEAkwMAIfACAQCTAwAh8QIgANgDACELBAAAowMAIP0BAADnAwAw_gEAACcAEP8BAADnAwAwgAIBAJMDACGsAkAAlwMAIa0CAQCTAwAh0wIBAJMDACHUAgEAkwMAIdYCAADoA9YCItcCIADYAwAhBJwCAAAA1gICnQIAAADWAgieAgAAANYCCKMCAADLA9YCIg0DAACjAwAgBwAA7AMAIP0BAADpAwAw_gEAAB4AEP8BAADpAwAwgAIBAJMDACGoAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAADrA8MCIsACAADqA8ACIsECAQCWAwAhBJwCAAAAwAICnQIAAADAAgieAgAAAMACCKMCAAC5A8ACIgScAgAAAMMCAp0CAAAAwwIIngIAAADDAgijAgAAtwPDAiIbAwAAowMAIAYAAN8DACAKAACnAwAgDAAA3gMAIA0AAPkDACAOAAD6AwAg_QEAAPYDADD-AQAAAwAQ_wEAAPYDADCAAgEAkwMAIZsCQACXAwAhpwIBAJYDACGoAgEAkwMAIawCQACXAwAhugIAAO4DxAIixwIBAJMDACHIAgEAkwMAIckCAQCTAwAhygIBAJMDACHLAgEAkwMAIcwCCACVAwAhzgIAAPcDzgIi0AIAAPgD0AIi0QIIAJUDACHSAiAA2AMAIfMCAAADACD0AgAAAwAgCwQAAKMDACAHAADsAwAg_QEAAO0DADD-AQAAGgAQ_wEAAO0DADCAAgEAkwMAIakCAQCTAwAhugIAAO4DxAIixAIBAJMDACHFAgEAlgMAIcYCQACXAwAhBJwCAAAAxAICnQIAAADEAgieAgAAAMQCCKMCAAC9A8QCIgKoAgEAAAABqQIBAAAAAQ4DAACjAwAgBgAA8QMAIAcAAOwDACD9AQAA8AMAMP4BAAASABD_AQAA8AMAMIACAQCTAwAhmwJAAJcDACGnAgEAkwMAIagCAQCTAwAhqQIBAJMDACGqAgIAlAMAIasCAQCWAwAhrAJAAJcDACEUBAAAowMAIAUAAKQDACAIAAClAwAgCQAApgMAIAoAAKcDACD9AQAAoAMAMP4BAAAHABD_AQAAoAMAMIACAQCTAwAhmwJAAJcDACGqAggAlQMAIawCQACXAwAhrQIBAJMDACGuAgEAkwMAIbACAAChA7ACIrICAACiA7ICIrMCAgCUAwAhtAICAJQDACHzAgAABwAg9AIAAAcAIAoGAADxAwAg_QEAAPIDADD-AQAADgAQ_wEAAPIDADCAAgEAkwMAIacCAQCTAwAhuAIIAJUDACG6AgAA8wO6AiK7AkAAlwMAIbwCQADkAwAhBJwCAAAAugICnQIAAAC6AgieAgAAALoCCKMCAACuA7oCIgwGAADxAwAgBwAA7AMAIP0BAAD0AwAw_gEAAAoAEP8BAAD0AwAwgAIBAJMDACGnAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAAD1A78CIr0CCACVAwAhBJwCAAAAvwICnQIAAAC_AgieAgAAAL8CCKMCAACyA78CIhkDAACjAwAgBgAA3wMAIAoAAKcDACAMAADeAwAgDQAA-QMAIA4AAPoDACD9AQAA9gMAMP4BAAADABD_AQAA9gMAMIACAQCTAwAhmwJAAJcDACGnAgEAlgMAIagCAQCTAwAhrAJAAJcDACG6AgAA7gPEAiLHAgEAkwMAIcgCAQCTAwAhyQIBAJMDACHKAgEAkwMAIcsCAQCTAwAhzAIIAJUDACHOAgAA9wPOAiLQAgAA-APQAiLRAggAlQMAIdICIADYAwAhBJwCAAAAzgICnQIAAADOAgieAgAAAM4CCKMCAADHA84CIgScAgAAANACAp0CAAAA0AIIngIAAADQAgijAgAAxQPQAiIPAwAAowMAIAcAAOwDACD9AQAA6QMAMP4BAAAeABD_AQAA6QMAMIACAQCTAwAhqAIBAJMDACGpAgEAkwMAIawCQACXAwAhuAIIAJUDACG6AgAA6wPDAiLAAgAA6gPAAiLBAgEAlgMAIfMCAAAeACD0AgAAHgAgDgYAAPEDACAHAADsAwAg_QEAAPQDADD-AQAACgAQ_wEAAPQDADCAAgEAkwMAIacCAQCTAwAhqQIBAJMDACGsAkAAlwMAIbgCCACVAwAhugIAAPUDvwIivQIIAJUDACHzAgAACgAg9AIAAAoAIAAAAAAAAAH4AgEAAAABBfgCAgAAAAH-AgIAAAAB_wICAAAAAYADAgAAAAGBAwIAAAABBfgCCAAAAAH-AggAAAAB_wIIAAAAAYADCAAAAAGBAwgAAAABAfgCAQAAAAEB-AJAAAAAAQAAAAAABSEAAJ0HACAiAACmBwAg9QIAAJ4HACD2AgAApQcAIPsCAAC6AgAgBSEAAJsHACAiAACjBwAg9QIAAJwHACD2AgAAogcAIPsCAABWACAFIQAAmQcAICIAAKAHACD1AgAAmgcAIPYCAACfBwAg-wIAAAUAIAMhAACdBwAg9QIAAJ4HACD7AgAAugIAIAMhAACbBwAg9QIAAJwHACD7AgAAVgAgAyEAAJkHACD1AgAAmgcAIPsCAAAFACAAAAAAAAH4AgAAALACAgH4AgAAALICAgUhAAD1BgAgIgAAlwcAIPUCAAD2BgAg9gIAAJYHACD7AgAAVgAgCyEAAMYEADAiAADLBAAw9QIAAMcEADD2AgAAyAQAMPcCAADJBAAg-AIAAMoEADD5AgAAygQAMPoCAADKBAAw-wIAAMoEADD8AgAAzAQAMP0CAADNBAAwCyEAALcEADAiAAC8BAAw9QIAALgEADD2AgAAuQQAMPcCAAC6BAAg-AIAALsEADD5AgAAuwQAMPoCAAC7BAAw-wIAALsEADD8AgAAvQQAMP0CAAC-BAAwCyEAAKkEADAiAACuBAAw9QIAAKoEADD2AgAAqwQAMPcCAACsBAAg-AIAAK0EADD5AgAArQQAMPoCAACtBAAw-wIAAK0EADD8AgAArwQAMP0CAACwBAAwCyEAAJ0EADAiAACiBAAw9QIAAJ4EADD2AgAAnwQAMPcCAACgBAAg-AIAAKEEADD5AgAAoQQAMPoCAAChBAAw-wIAAKEEADD8AgAAowQAMP0CAACkBAAwCQMAAI8EACAHAACQBAAggAIBAAAAAZsCQAAAAAGoAgEAAAABqQIBAAAAAaoCAgAAAAGrAgEAAAABrAJAAAAAAQIAAAAUACAhAACoBAAgAwAAABQAICEAAKgEACAiAACnBAAgARoAAJUHADAPAwAAowMAIAYAAPEDACAHAADsAwAg_QEAAPADADD-AQAAEgAQ_wEAAPADADCAAgEAAAABmwJAAJcDACGnAgEAkwMAIagCAQCTAwAhqQIBAJMDACGqAgIAlAMAIasCAQCWAwAhrAJAAJcDACHyAgAA7wMAIAIAAAAUACAaAACnBAAgAgAAAKUEACAaAACmBAAgC_0BAACkBAAw_gEAAKUEABD_AQAApAQAMIACAQCTAwAhmwJAAJcDACGnAgEAkwMAIagCAQCTAwAhqQIBAJMDACGqAgIAlAMAIasCAQCWAwAhrAJAAJcDACEL_QEAAKQEADD-AQAApQQAEP8BAACkBAAwgAIBAJMDACGbAkAAlwMAIacCAQCTAwAhqAIBAJMDACGpAgEAkwMAIaoCAgCUAwAhqwIBAJYDACGsAkAAlwMAIQeAAgEAgQQAIZsCQACFBAAhqAIBAIEEACGpAgEAgQQAIaoCAgCCBAAhqwIBAIQEACGsAkAAhQQAIQkDAACMBAAgBwAAjQQAIIACAQCBBAAhmwJAAIUEACGoAgEAgQQAIakCAQCBBAAhqgICAIIEACGrAgEAhAQAIawCQACFBAAhCQMAAI8EACAHAACQBAAggAIBAAAAAZsCQAAAAAGoAgEAAAABqQIBAAAAAaoCAgAAAAGrAgEAAAABrAJAAAAAAQWAAgEAAAABuAIIAAAAAboCAAAAugICuwJAAAAAAbwCQAAAAAECAAAAEAAgIQAAtgQAIAMAAAAQACAhAAC2BAAgIgAAtQQAIAEaAACUBwAwCgYAAPEDACD9AQAA8gMAMP4BAAAOABD_AQAA8gMAMIACAQAAAAGnAgEAkwMAIbgCCACVAwAhugIAAPMDugIiuwJAAJcDACG8AkAA5AMAIQIAAAAQACAaAAC1BAAgAgAAALEEACAaAACyBAAgCf0BAACwBAAw_gEAALEEABD_AQAAsAQAMIACAQCTAwAhpwIBAJMDACG4AggAlQMAIboCAADzA7oCIrsCQACXAwAhvAJAAOQDACEJ_QEAALAEADD-AQAAsQQAEP8BAACwBAAwgAIBAJMDACGnAgEAkwMAIbgCCACVAwAhugIAAPMDugIiuwJAAJcDACG8AkAA5AMAIQWAAgEAgQQAIbgCCACDBAAhugIAALMEugIiuwJAAIUEACG8AkAAtAQAIQH4AgAAALoCAgH4AkAAAAABBYACAQCBBAAhuAIIAIMEACG6AgAAswS6AiK7AkAAhQQAIbwCQAC0BAAhBYACAQAAAAG4AggAAAABugIAAAC6AgK7AkAAAAABvAJAAAAAAQcHAADFBAAggAIBAAAAAakCAQAAAAGsAkAAAAABuAIIAAAAAboCAAAAvwICvQIIAAAAAQIAAAAMACAhAADEBAAgAwAAAAwAICEAAMQEACAiAADCBAAgARoAAJMHADAMBgAA8QMAIAcAAOwDACD9AQAA9AMAMP4BAAAKABD_AQAA9AMAMIACAQAAAAGnAgEAkwMAIakCAQAAAAGsAkAAlwMAIbgCCACVAwAhugIAAPUDvwIivQIIAJUDACECAAAADAAgGgAAwgQAIAIAAAC_BAAgGgAAwAQAIAr9AQAAvgQAMP4BAAC_BAAQ_wEAAL4EADCAAgEAkwMAIacCAQCTAwAhqQIBAJMDACGsAkAAlwMAIbgCCACVAwAhugIAAPUDvwIivQIIAJUDACEK_QEAAL4EADD-AQAAvwQAEP8BAAC-BAAwgAIBAJMDACGnAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAAD1A78CIr0CCACVAwAhBoACAQCBBAAhqQIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACEB-AIAAAC_AgIHBwAAwwQAIIACAQCBBAAhqQIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACEFIQAAjgcAICIAAJEHACD1AgAAjwcAIPYCAACQBwAg-wIAAAUAIAcHAADFBAAggAIBAAAAAakCAQAAAAGsAkAAAAABuAIIAAAAAboCAAAAvwICvQIIAAAAAQMhAACOBwAg9QIAAI8HACD7AgAABQAgFAMAAIIFACAKAACGBQAgDAAAgwUAIA0AAIQFACAOAACFBQAggAIBAAAAAZsCQAAAAAGoAgEAAAABrAJAAAAAAboCAAAAxAICxwIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAggAAAABzgIAAADOAgLQAgAAANACAtECCAAAAAHSAiAAAAABAgAAAAUAICEAAIEFACADAAAABQAgIQAAgQUAICIAANQEACABGgAAjQcAMBkDAACjAwAgBgAA3wMAIAoAAKcDACAMAADeAwAgDQAA-QMAIA4AAPoDACD9AQAA9gMAMP4BAAADABD_AQAA9gMAMIACAQAAAAGbAkAAlwMAIacCAQCWAwAhqAIBAJMDACGsAkAAlwMAIboCAADuA8QCIscCAQAAAAHIAgEAkwMAIckCAQCTAwAhygIBAJMDACHLAgEAkwMAIcwCCACVAwAhzgIAAPcDzgIi0AIAAPgD0AIi0QIIAJUDACHSAiAA2AMAIQIAAAAFACAaAADUBAAgAgAAAM4EACAaAADPBAAgE_0BAADNBAAw_gEAAM4EABD_AQAAzQQAMIACAQCTAwAhmwJAAJcDACGnAgEAlgMAIagCAQCTAwAhrAJAAJcDACG6AgAA7gPEAiLHAgEAkwMAIcgCAQCTAwAhyQIBAJMDACHKAgEAkwMAIcsCAQCTAwAhzAIIAJUDACHOAgAA9wPOAiLQAgAA-APQAiLRAggAlQMAIdICIADYAwAhE_0BAADNBAAw_gEAAM4EABD_AQAAzQQAMIACAQCTAwAhmwJAAJcDACGnAgEAlgMAIagCAQCTAwAhrAJAAJcDACG6AgAA7gPEAiLHAgEAkwMAIcgCAQCTAwAhyQIBAJMDACHKAgEAkwMAIcsCAQCTAwAhzAIIAJUDACHOAgAA9wPOAiLQAgAA-APQAiLRAggAlQMAIdICIADYAwAhD4ACAQCBBAAhmwJAAIUEACGoAgEAgQQAIawCQACFBAAhugIAANIExAIixwIBAIEEACHIAgEAgQQAIckCAQCBBAAhygIBAIEEACHLAgEAgQQAIcwCCACDBAAhzgIAANAEzgIi0AIAANEE0AIi0QIIAIMEACHSAiAA0wQAIQH4AgAAAM4CAgH4AgAAANACAgH4AgAAAMQCAgH4AiAAAAABFAMAANUEACAKAADZBAAgDAAA1gQAIA0AANcEACAOAADYBAAggAIBAIEEACGbAkAAhQQAIagCAQCBBAAhrAJAAIUEACG6AgAA0gTEAiLHAgEAgQQAIcgCAQCBBAAhyQIBAIEEACHKAgEAgQQAIcsCAQCBBAAhzAIIAIMEACHOAgAA0ATOAiLQAgAA0QTQAiLRAggAgwQAIdICIADTBAAhBSEAAPcGACAiAACLBwAg9QIAAPgGACD2AgAAigcAIPsCAABWACALIQAA8wQAMCIAAPgEADD1AgAA9AQAMPYCAAD1BAAw9wIAAPYEACD4AgAA9wQAMPkCAAD3BAAw-gIAAPcEADD7AgAA9wQAMPwCAAD5BAAw_QIAAPoEADAHIQAA6gQAICIAAO0EACD1AgAA6wQAIPYCAADsBAAg-QIAAB4AIPoCAAAeACD7AgAAJQAgByEAAOMEACAiAADmBAAg9QIAAOQEACD2AgAA5QQAIPkCAAAKACD6AgAACgAg-wIAAAwAIAshAADaBAAwIgAA3gQAMPUCAADbBAAw9gIAANwEADD3AgAA3QQAIPgCAAChBAAw-QIAAKEEADD6AgAAoQQAMPsCAAChBAAw_AIAAN8EADD9AgAApAQAMAkDAACPBAAgBgAAjgQAIIACAQAAAAGbAkAAAAABpwIBAAAAAagCAQAAAAGqAgIAAAABqwIBAAAAAawCQAAAAAECAAAAFAAgIQAA4gQAIAMAAAAUACAhAADiBAAgIgAA4QQAIAEaAACJBwAwAgAAABQAIBoAAOEEACACAAAApQQAIBoAAOAEACAHgAIBAIEEACGbAkAAhQQAIacCAQCBBAAhqAIBAIEEACGqAgIAggQAIasCAQCEBAAhrAJAAIUEACEJAwAAjAQAIAYAAIsEACCAAgEAgQQAIZsCQACFBAAhpwIBAIEEACGoAgEAgQQAIaoCAgCCBAAhqwIBAIQEACGsAkAAhQQAIQkDAACPBAAgBgAAjgQAIIACAQAAAAGbAkAAAAABpwIBAAAAAagCAQAAAAGqAgIAAAABqwIBAAAAAawCQAAAAAEHBgAA6QQAIIACAQAAAAGnAgEAAAABrAJAAAAAAbgCCAAAAAG6AgAAAL8CAr0CCAAAAAECAAAADAAgIQAA4wQAIAMAAAAKACAhAADjBAAgIgAA5wQAIAkAAAAKACAGAADoBAAgGgAA5wQAIIACAQCBBAAhpwIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACEHBgAA6AQAIIACAQCBBAAhpwIBAIEEACGsAkAAhQQAIbgCCACDBAAhugIAAMEEvwIivQIIAIMEACEFIQAAhAcAICIAAIcHACD1AgAAhQcAIPYCAACGBwAg-wIAALoCACADIQAAhAcAIPUCAACFBwAg-wIAALoCACAIAwAA8gQAIIACAQAAAAGoAgEAAAABrAJAAAAAAbgCCAAAAAG6AgAAAMMCAsACAAAAwAICwQIBAAAAAQIAAAAlACAhAADqBAAgAwAAAB4AICEAAOoEACAiAADuBAAgCgAAAB4AIAMAAPEEACAaAADuBAAggAIBAIEEACGoAgEAgQQAIawCQACFBAAhuAIIAIMEACG6AgAA8ATDAiLAAgAA7wTAAiLBAgEAhAQAIQgDAADxBAAggAIBAIEEACGoAgEAgQQAIawCQACFBAAhuAIIAIMEACG6AgAA8ATDAiLAAgAA7wTAAiLBAgEAhAQAIQH4AgAAAMACAgH4AgAAAMMCAgUhAAD_BgAgIgAAggcAIPUCAACABwAg9gIAAIEHACD7AgAAVgAgAyEAAP8GACD1AgAAgAcAIPsCAABWACAGBAAAgAUAIIACAQAAAAG6AgAAAMQCAsQCAQAAAAHFAgEAAAABxgJAAAAAAQIAAAAcACAhAAD_BAAgAwAAABwAICEAAP8EACAiAAD9BAAgARoAAP4GADALBAAAowMAIAcAAOwDACD9AQAA7QMAMP4BAAAaABD_AQAA7QMAMIACAQAAAAGpAgEAkwMAIboCAADuA8QCIsQCAQCTAwAhxQIBAJYDACHGAkAAlwMAIQIAAAAcACAaAAD9BAAgAgAAAPsEACAaAAD8BAAgCf0BAAD6BAAw_gEAAPsEABD_AQAA-gQAMIACAQCTAwAhqQIBAJMDACG6AgAA7gPEAiLEAgEAkwMAIcUCAQCWAwAhxgJAAJcDACEJ_QEAAPoEADD-AQAA-wQAEP8BAAD6BAAwgAIBAJMDACGpAgEAkwMAIboCAADuA8QCIsQCAQCTAwAhxQIBAJYDACHGAkAAlwMAIQWAAgEAgQQAIboCAADSBMQCIsQCAQCBBAAhxQIBAIQEACHGAkAAhQQAIQYEAAD-BAAggAIBAIEEACG6AgAA0gTEAiLEAgEAgQQAIcUCAQCEBAAhxgJAAIUEACEFIQAA-QYAICIAAPwGACD1AgAA-gYAIPYCAAD7BgAg-wIAAFYAIAYEAACABQAggAIBAAAAAboCAAAAxAICxAIBAAAAAcUCAQAAAAHGAkAAAAABAyEAAPkGACD1AgAA-gYAIPsCAABWACAUAwAAggUAIAoAAIYFACAMAACDBQAgDQAAhAUAIA4AAIUFACCAAgEAAAABmwJAAAAAAagCAQAAAAGsAkAAAAABugIAAADEAgLHAgEAAAAByAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAcwCCAAAAAHOAgAAAM4CAtACAAAA0AIC0QIIAAAAAdICIAAAAAEDIQAA9wYAIPUCAAD4BgAg-wIAAFYAIAQhAADzBAAw9QIAAPQEADD3AgAA9gQAIPsCAAD3BAAwAyEAAOoEACD1AgAA6wQAIPsCAAAlACADIQAA4wQAIPUCAADkBAAg-wIAAAwAIAQhAADaBAAw9QIAANsEADD3AgAA3QQAIPsCAAChBAAwAyEAAPUGACD1AgAA9gYAIPsCAABWACAEIQAAxgQAMPUCAADHBAAw9wIAAMkEACD7AgAAygQAMAQhAAC3BAAw9QIAALgEADD3AgAAugQAIPsCAAC7BAAwBCEAAKkEADD1AgAAqgQAMPcCAACsBAAg-wIAAK0EADAEIQAAnQQAMPUCAACeBAAw9wIAAKAEACD7AgAAoQQAMAsFAACNBQAgCgAAkAUAIAwAALkGACAPAAC2BgAgEAAAtwYAIBEAALgGACASAAC6BgAgEwAAuwYAIBQAALwGACDqAgAA-wMAIOsCAAD7AwAgAAAAAAAAAAAABSEAAPAGACAiAADzBgAg9QIAAPEGACD2AgAA8gYAIPsCAAC6AgAgAyEAAPAGACD1AgAA8QYAIPsCAAC6AgAgAAAAAAAAAAAAAAUhAADrBgAgIgAA7gYAIPUCAADsBgAg9gIAAO0GACD7AgAABQAgAyEAAOsGACD1AgAA7AYAIPsCAAAFACAAAAAFIQAA5gYAICIAAOkGACD1AgAA5wYAIPYCAADoBgAg-wIAAAUAIAMhAADmBgAg9QIAAOcGACD7AgAABQAgAAAAAAAHIQAA4QYAICIAAOQGACD1AgAA4gYAIPYCAADjBgAg-QIAAAcAIPoCAAAHACD7AgAAugIAIAMhAADhBgAg9QIAAOIGACD7AgAAugIAIAAAAAH4AgAAANYCAgUhAADcBgAgIgAA3wYAIPUCAADdBgAg9gIAAN4GACD7AgAAVgAgAyEAANwGACD1AgAA3QYAIPsCAABWACAAAAAAAAAFIQAA1wYAICIAANoGACD1AgAA2AYAIPYCAADZBgAg-wIAAFYAIAMhAADXBgAg9QIAANgGACD7AgAAVgAgAAAABSEAANIGACAiAADVBgAg9QIAANMGACD2AgAA1AYAIPsCAABWACADIQAA0gYAIPUCAADTBgAg-wIAAFYAIAAAAAH4AgAAAO0CAgH4AgAAAO8CAgshAACkBgAwIgAAqAYAMPUCAAClBgAw9gIAAKYGADD3AgAApwYAIPgCAADKBAAw-QIAAMoEADD6AgAAygQAMPsCAADKBAAw_AIAAKkGADD9AgAAzQQAMAshAACYBgAwIgAAnQYAMPUCAACZBgAw9gIAAJoGADD3AgAAmwYAIPgCAACcBgAw-QIAAJwGADD6AgAAnAYAMPsCAACcBgAw_AIAAJ4GADD9AgAAnwYAMAshAACMBgAwIgAAkQYAMPUCAACNBgAw9gIAAI4GADD3AgAAjwYAIPgCAACQBgAw-QIAAJAGADD6AgAAkAYAMPsCAACQBgAw_AIAAJIGADD9AgAAkwYAMAshAACABgAwIgAAhQYAMPUCAACBBgAw9gIAAIIGADD3AgAAgwYAIPgCAACEBgAw-QIAAIQGADD6AgAAhAYAMPsCAACEBgAw_AIAAIYGADD9AgAAhwYAMAshAAD3BQAwIgAA-wUAMPUCAAD4BQAw9gIAAPkFADD3AgAA-gUAIPgCAAD3BAAw-QIAAPcEADD6AgAA9wQAMPsCAAD3BAAw_AIAAPwFADD9AgAA-gQAMAchAADyBQAgIgAA9QUAIPUCAADzBQAg9gIAAPQFACD5AgAABwAg-gIAAAcAIPsCAAC6AgAgCyEAAOkFADAiAADtBQAw9QIAAOoFADD2AgAA6wUAMPcCAADsBQAg-AIAAKEEADD5AgAAoQQAMPoCAAChBAAw-wIAAKEEADD8AgAA7gUAMP0CAACkBAAwCyEAAN0FADAiAADiBQAw9QIAAN4FADD2AgAA3wUAMPcCAADgBQAg-AIAAOEFADD5AgAA4QUAMPoCAADhBQAw-wIAAOEFADD8AgAA4wUAMP0CAADkBQAwCyEAANEFADAiAADWBQAw9QIAANIFADD2AgAA0wUAMPcCAADUBQAg-AIAANUFADD5AgAA1QUAMPoCAADVBQAw-wIAANUFADD8AgAA1wUAMP0CAADYBQAwDIACAQAAAAGbAkAAAAABrAJAAAAAAdsCAQAAAAHcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAgEAAAAB4AJAAAAAAeECQAAAAAHiAgEAAAAB4wIBAAAAAQIAAAA3ACAhAADcBQAgAwAAADcAICEAANwFACAiAADbBQAgARoAANEGADARBAAAowMAIP0BAADjAwAw_gEAADUAEP8BAADjAwAwgAIBAAAAAZsCQACXAwAhrAJAAJcDACGtAgEAkwMAIdsCAQCTAwAh3AIBAJMDACHdAgEAlgMAId4CAQCWAwAh3wIBAJYDACHgAkAA5AMAIeECQADkAwAh4gIBAJYDACHjAgEAlgMAIQIAAAA3ACAaAADbBQAgAgAAANkFACAaAADaBQAgEP0BAADYBQAw_gEAANkFABD_AQAA2AUAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2wIBAJMDACHcAgEAkwMAId0CAQCWAwAh3gIBAJYDACHfAgEAlgMAIeACQADkAwAh4QJAAOQDACHiAgEAlgMAIeMCAQCWAwAhEP0BAADYBQAw_gEAANkFABD_AQAA2AUAMIACAQCTAwAhmwJAAJcDACGsAkAAlwMAIa0CAQCTAwAh2wIBAJMDACHcAgEAkwMAId0CAQCWAwAh3gIBAJYDACHfAgEAlgMAIeACQADkAwAh4QJAAOQDACHiAgEAlgMAIeMCAQCWAwAhDIACAQCBBAAhmwJAAIUEACGsAkAAhQQAIdsCAQCBBAAh3AIBAIEEACHdAgEAhAQAId4CAQCEBAAh3wIBAIQEACHgAkAAtAQAIeECQAC0BAAh4gIBAIQEACHjAgEAhAQAIQyAAgEAgQQAIZsCQACFBAAhrAJAAIUEACHbAgEAgQQAIdwCAQCBBAAh3QIBAIQEACHeAgEAhAQAId8CAQCEBAAh4AJAALQEACHhAkAAtAQAIeICAQCEBAAh4wIBAIQEACEMgAIBAAAAAZsCQAAAAAGsAkAAAAAB2wIBAAAAAdwCAQAAAAHdAgEAAAAB3gIBAAAAAd8CAQAAAAHgAkAAAAAB4QJAAAAAAeICAQAAAAHjAgEAAAABB4ACAQAAAAGbAkAAAAABrAJAAAAAAdoCQAAAAAHkAgEAAAAB5QIBAAAAAeYCAQAAAAECAAAAMwAgIQAA6AUAIAMAAAAzACAhAADoBQAgIgAA5wUAIAEaAADQBgAwDAQAAKMDACD9AQAA5QMAMP4BAAAxABD_AQAA5QMAMIACAQAAAAGbAkAAlwMAIawCQACXAwAhrQIBAJMDACHaAkAAlwMAIeQCAQAAAAHlAgEAlgMAIeYCAQCWAwAhAgAAADMAIBoAAOcFACACAAAA5QUAIBoAAOYFACAL_QEAAOQFADD-AQAA5QUAEP8BAADkBQAwgAIBAJMDACGbAkAAlwMAIawCQACXAwAhrQIBAJMDACHaAkAAlwMAIeQCAQCTAwAh5QIBAJYDACHmAgEAlgMAIQv9AQAA5AUAMP4BAADlBQAQ_wEAAOQFADCAAgEAkwMAIZsCQACXAwAhrAJAAJcDACGtAgEAkwMAIdoCQACXAwAh5AIBAJMDACHlAgEAlgMAIeYCAQCWAwAhB4ACAQCBBAAhmwJAAIUEACGsAkAAhQQAIdoCQACFBAAh5AIBAIEEACHlAgEAhAQAIeYCAQCEBAAhB4ACAQCBBAAhmwJAAIUEACGsAkAAhQQAIdoCQACFBAAh5AIBAIEEACHlAgEAhAQAIeYCAQCEBAAhB4ACAQAAAAGbAkAAAAABrAJAAAAAAdoCQAAAAAHkAgEAAAAB5QIBAAAAAeYCAQAAAAEJBgAAjgQAIAcAAJAEACCAAgEAAAABmwJAAAAAAacCAQAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAkAAAAABAgAAABQAICEAAPEFACADAAAAFAAgIQAA8QUAICIAAPAFACABGgAAzwYAMAIAAAAUACAaAADwBQAgAgAAAKUEACAaAADvBQAgB4ACAQCBBAAhmwJAAIUEACGnAgEAgQQAIakCAQCBBAAhqgICAIIEACGrAgEAhAQAIawCQACFBAAhCQYAAIsEACAHAACNBAAggAIBAIEEACGbAkAAhQQAIacCAQCBBAAhqQIBAIEEACGqAgIAggQAIasCAQCEBAAhrAJAAIUEACEJBgAAjgQAIAcAAJAEACCAAgEAAAABmwJAAAAAAacCAQAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAkAAAAABDQUAAIgFACAIAACJBQAgCQAAigUAIAoAAIsFACCAAgEAAAABmwJAAAAAAaoCCAAAAAGsAkAAAAABrgIBAAAAAbACAAAAsAICsgIAAACyAgKzAgIAAAABtAICAAAAAQIAAAC6AgAgIQAA8gUAIAMAAAAHACAhAADyBQAgIgAA9gUAIA8AAAAHACAFAACZBAAgCAAAmgQAIAkAAJsEACAKAACcBAAgGgAA9gUAIIACAQCBBAAhmwJAAIUEACGqAggAgwQAIawCQACFBAAhrgIBAIEEACGwAgAAlgSwAiKyAgAAlwSyAiKzAgIAggQAIbQCAgCCBAAhDQUAAJkEACAIAACaBAAgCQAAmwQAIAoAAJwEACCAAgEAgQQAIZsCQACFBAAhqgIIAIMEACGsAkAAhQQAIa4CAQCBBAAhsAIAAJYEsAIisgIAAJcEsgIiswICAIIEACG0AgIAggQAIQYHAACoBQAggAIBAAAAAakCAQAAAAG6AgAAAMQCAsUCAQAAAAHGAkAAAAABAgAAABwAICEAAP8FACADAAAAHAAgIQAA_wUAICIAAP4FACABGgAAzgYAMAIAAAAcACAaAAD-BQAgAgAAAPsEACAaAAD9BQAgBYACAQCBBAAhqQIBAIEEACG6AgAA0gTEAiLFAgEAhAQAIcYCQACFBAAhBgcAAKcFACCAAgEAgQQAIakCAQCBBAAhugIAANIExAIixQIBAIQEACHGAkAAhQQAIQYHAACoBQAggAIBAAAAAakCAQAAAAG6AgAAAMQCAsUCAQAAAAHGAkAAAAABB4ACAQAAAAGsAkAAAAABrgIBAAAAAesCAQAAAAHvAgEAAAAB8AIBAAAAAfECIAAAAAECAAAAAQAgIQAAiwYAIAMAAAABACAhAACLBgAgIgAAigYAIAEaAADNBgAwDAQAAKMDACD9AQAA5gMAMP4BAAArABD_AQAA5gMAMIACAQAAAAGsAkAAlwMAIa0CAQCTAwAhrgIBAJMDACHrAgEAlgMAIe8CAQCTAwAh8AIBAJMDACHxAiAA2AMAIQIAAAABACAaAACKBgAgAgAAAIgGACAaAACJBgAgC_0BAACHBgAw_gEAAIgGABD_AQAAhwYAMIACAQCTAwAhrAJAAJcDACGtAgEAkwMAIa4CAQCTAwAh6wIBAJYDACHvAgEAkwMAIfACAQCTAwAh8QIgANgDACEL_QEAAIcGADD-AQAAiAYAEP8BAACHBgAwgAIBAJMDACGsAkAAlwMAIa0CAQCTAwAhrgIBAJMDACHrAgEAlgMAIe8CAQCTAwAh8AIBAJMDACHxAiAA2AMAIQeAAgEAgQQAIawCQACFBAAhrgIBAIEEACHrAgEAhAQAIe8CAQCBBAAh8AIBAIEEACHxAiAA0wQAIQeAAgEAgQQAIawCQACFBAAhrgIBAIEEACHrAgEAhAQAIe8CAQCBBAAh8AIBAIEEACHxAiAA0wQAIQeAAgEAAAABrAJAAAAAAa4CAQAAAAHrAgEAAAAB7wIBAAAAAfACAQAAAAHxAiAAAAABBoACAQAAAAGsAkAAAAAB0wIBAAAAAdQCAQAAAAHWAgAAANYCAtcCIAAAAAECAAAAKQAgIQAAlwYAIAMAAAApACAhAACXBgAgIgAAlgYAIAEaAADMBgAwCwQAAKMDACD9AQAA5wMAMP4BAAAnABD_AQAA5wMAMIACAQAAAAGsAkAAlwMAIa0CAQCTAwAh0wIBAJMDACHUAgEAkwMAIdYCAADoA9YCItcCIADYAwAhAgAAACkAIBoAAJYGACACAAAAlAYAIBoAAJUGACAK_QEAAJMGADD-AQAAlAYAEP8BAACTBgAwgAIBAJMDACGsAkAAlwMAIa0CAQCTAwAh0wIBAJMDACHUAgEAkwMAIdYCAADoA9YCItcCIADYAwAhCv0BAACTBgAw_gEAAJQGABD_AQAAkwYAMIACAQCTAwAhrAJAAJcDACGtAgEAkwMAIdMCAQCTAwAh1AIBAJMDACHWAgAA6APWAiLXAiAA2AMAIQaAAgEAgQQAIawCQACFBAAh0wIBAIEEACHUAgEAgQQAIdYCAACzBdYCItcCIADTBAAhBoACAQCBBAAhrAJAAIUEACHTAgEAgQQAIdQCAQCBBAAh1gIAALMF1gIi1wIgANMEACEGgAIBAAAAAawCQAAAAAHTAgEAAAAB1AIBAAAAAdYCAAAA1gIC1wIgAAAAAQgHAACjBQAggAIBAAAAAakCAQAAAAGsAkAAAAABuAIIAAAAAboCAAAAwwICwAIAAADAAgLBAgEAAAABAgAAACUAICEAAKMGACADAAAAJQAgIQAAowYAICIAAKIGACABGgAAywYAMA0DAACjAwAgBwAA7AMAIP0BAADpAwAw_gEAAB4AEP8BAADpAwAwgAIBAAAAAagCAQCTAwAhqQIBAAAAAawCQACXAwAhuAIIAJUDACG6AgAA6wPDAiLAAgAA6gPAAiLBAgEAAAABAgAAACUAIBoAAKIGACACAAAAoAYAIBoAAKEGACAL_QEAAJ8GADD-AQAAoAYAEP8BAACfBgAwgAIBAJMDACGoAgEAkwMAIakCAQCTAwAhrAJAAJcDACG4AggAlQMAIboCAADrA8MCIsACAADqA8ACIsECAQCWAwAhC_0BAACfBgAw_gEAAKAGABD_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-QYAIAMAAABZACAhAAD5BgAgIgAA_QYAIBQAAABZACAFAADIBQAgCgAAzgUAIA8AAMkFACAQAADKBQAgEQAAywUAIBIAAM0FACATAADPBQAgFAAA0AUAIBoAAP0GACCAAgEAgQQAIZsCQACFBAAhrAJAAIUEACG6AgAAxwXvAiLnAgEAgQQAIegCAQCBBAAh6QIgANMEACHqAgEAhAQAIesCAQCEBAAh7QIAAMYF7QIiEgUAAMgFACAKAADOBQAgDwAAyQUAIBAAAMoFACARAADLBQAgEgAAzQUAIBMAAM8FACAUAADQBQAggAIBAIEEACGbAkAAhQQAIawCQACFBAAhugIAAMcF7wIi5wIBAIEEACHoAgEAgQQAIekCIADTBAAh6gIBAIQEACHrAgEAhAQAIe0CAADGBe0CIgWAAgEAAAABugIAAADEAgLEAgEAAAABxQIBAAAAAcYCQAAAAAESBQAArQYAIAoAALMGACAMAACxBgAgEAAArwYAIBEAALAGACASAACyBgAgEwAAtAYAIBQAALUGACCAAgEAAAABmwJAAAAAAawCQAAAAAG6AgAAAO8CAucCAQAAAAHoAgEAAAAB6QIgAAAAAeoCAQAAAAHrAgEAAAAB7QIAAADtAgICAAAAVgAgIQAA_wYAIAMAAABZACAhAAD_BgAgIgAAgwcAIBQAAABZACAFAADIBQAgCgAAzgUAIAwAAMwFACAQAADKBQAgEQAAywUAIBIAAM0FACATAADPBQAgFAAA0AUAIBoAAIMHACCAAgEAgQQAIZsCQACFBAAhrAJAAIUEACG6AgAAxwXvAiLnAgEAgQQAIegCAQCBBAAh6QIgANMEACHqAgEAhAQAIesCAQCEBAAh7QIAAMYF7QIiEgUAAMgFACAKAADOBQAgDAAAzAUAIBAAAMoFACARAADLBQAgEgAAzQUAIBMAAM8FACAUAADQBQAggAIBAIEEACGbAkAAhQQAIawCQACFBAAhugIAAMcF7wIi5wIBAIEEACHoAgEAgQQAIekCIADTBAAh6gIBAIQEACHrAgEAhAQAIe0CAADGBe0CIg4EAACHBQAgBQAAiAUAIAkAAIoFACAKAACLBQAggAIBAAAAAZsCQAAAAAGqAggAAAABrAJAAAAAAa0CAQAAAAGuAgEAAAABsAIAAACwAgKyAgAAALICArMCAgAAAAG0AgIAAAABAgAAALoCACAhAACEBwAgAwAAAAcAICEAAIQHACAiAACIBwAgEAAAAAcAIAQAAJgEACAFAACZBAAgCQAAmwQAIAoAAJwEACAaAACIBwAggAIBAIEEACGbAkAAhQQAIaoCCACDBAAhrAJAAIUEACGtAgEAgQQAIa4CAQCBBAAhsAIAAJYEsAIisgIAAJcEsgIiswICAIIEACG0AgIAggQAIQ4EAACYBAAgBQAAmQQAIAkAAJsEACAKAACcBAAggAIBAIEEACGbAkAAhQQAIaoCCACDBAAhrAJAAIUEACGtAgEAgQQAIa4CAQCBBAAhsAIAAJYEsAIisgIAAJcEsgIiswICAIIEACG0AgIAggQAIQeAAgEAAAABmwJAAAAAAacCAQAAAAGoAgEAAAABqgICAAAAAasCAQAAAAGsAkAAAAABAwAAAFkAICEAAPcGACAiAACMBwAgFAAAAFkAIAoAAM4FACAMAADMBQAgDwAAyQUAIBAAAMoFACARAADLBQAgEgAAzQUAIBMAAM8FACAUAADQBQAgGgAAjAcAIIACAQCBBAAhmwJAAIUEACGsAkAAhQQAIboCAADHBe8CIucCAQCBBAAh6AIBAIEEACHpAiAA0wQAIeoCAQCEBAAh6wIBAIQEACHtAgAAxgXtAiISCgAAzgUAIAwAAMwFACAPAADJBQAgEAAAygUAIBEAAMsFACASAADNBQAgEwAAzwUAIBQAANAFACCAAgEAgQQAIZsCQACFBAAhrAJAAIUEACG6AgAAxwXvAiLnAgEAgQQAIegCAQCBBAAh6QIgANMEACHqAgEAhAQAIesCAQCEBAAh7QIAAMYF7QIiD4ACAQAAAAGbAkAAAAABqAIBAAAAAawCQAAAAAG6AgAAAMQCAscCAQAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAHLAgEAAAABzAIIAAAAAc4CAAAAzgIC0AIAAADQAgLRAggAAAAB0gIgAAAAARUDAACCBQAgBgAArwUAIAoAAIYFACAMAACDBQAgDQAAhAUAIIACAQAAAAGbAkAAAAABpwIBAAAAAagCAQAAAAGsAkAAAAABugIAAADEAgLHAgEAAAAByAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAcwCCAAAAAHOAgAAAM4CAtACAAAA0AIC0QIIAAAAAdICIAAAAAECAAAABQAgIQAAjgcAIAMAAAADACAhAACOBwAgIgAAkgcAIBcAAAADACADAADVBAAgBgAArgUAIAoAANkEACAMAADWBAAgDQAA1wQAIBoAAJIHACCAAgEAgQQAIZsCQACFBAAhpwIBAIQEACGoAgEAgQQAIawCQACFBAAhugIAANIExAIixwIBAIEEACHIAgEAgQQAIckCAQCBBAAhygIBAIEEACHLAgEAgQQAIcwCCACDBAAhzgIAANAEzgIi0AIAANEE0AIi0QIIAIMEACHSAiAA0wQAIRUDAADVBAAgBgAArgUAIAoAANkEACAMAADWBAAgDQAA1wQAIIACAQCBBAAhmwJAAIUEACGnAgEAhAQAIagCAQCBBAAhrAJAAIUEACG6AgAA0gTEAiLHAgEAgQQAIcgCAQCBBAAhyQIBAIEEACHKAgEAgQQAIcsCAQCBBAAhzAIIAIMEACHOAgAA0ATOAiLQAgAA0QTQAiLRAggAgwQAIdICIADTBAAhBoACAQAAAAGpAgEAAAABrAJAAAAAAbgCCAAAAAG6AgAAAL8CAr0CCAAAAAEFgAIBAAAAAbgCCAAAAAG6AgAAALoCArsCQAAAAAG8AkAAAAABB4ACAQAAAAGbAkAAAAABqAIBAAAAAakCAQAAAAGqAgIAAAABqwIBAAAAAawCQAAAAAEDAAAAWQAgIQAA9QYAICIAAJgHACAUAAAAWQAgBQAAyAUAIAoAAM4FACAMAADMBQAgDwAAyQUAIBAAAMoFACARAADLBQAgEwAAzwUAIBQAANAFACAaAACYBwAggAIBAIEEACGbAkAAhQQAIawCQACFBAAhugIAAMcF7wIi5wIBAIEEACHoAgEAgQQAIekCIADTBAAh6gIBAIQEACHrAgEAhAQAIe0CAADGBe0CIhIFAADIBQAgCgAAzgUAIAwAAMwFACAPAADJBQAgEAAAygUAIBEAAMsFACATAADPBQAgFAAA0AUAIIACAQCBBAAhmwJAAIUEACGsAkAAhQQAIboCAADHBe8CIucCAQCBBAAh6AIBAIEEACHpAiAA0wQAIeoCAQCEBAAh6wIBAIQEACHtAgAAxgXtAiIVAwAAggUAIAYAAK8FACAMAACDBQAgDQAAhAUAIA4AAIUFACCAAgEAAAABmwJAAAAAAacCAQAAAAGoAgEAAAABrAJAAAAAAboCAAAAxAICxwIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAggAAAABzgIAAADOAgLQAgAAANACAtECCAAAAAHSAiAAAAABAgAAAAUAICEAAJkHACASBQAArQYAIAwAALEGACAPAACuBgAgEAAArwYAIBEAALAGACASAACyBgAgEwAAtAYAIBQAALUGACCAAgEAAAABmwJAAAAAAawCQAAAAAG6AgAAAO8CAucCAQAAAAHoAgEAAAAB6QIgAAAAAeoCAQAAAAHrAgEAAAAB7QIAAADtAgICAAAAVgAgIQAAmwcAIA4EAACHBQAgBQAAiAUAIAgAAIkFACAJAACKBQAggAIBAAAAAZsCQAAAAAGqAggAAAABrAJAAAAAAa0CAQAAAAGuAgEAAAABsAIAAACwAgKyAgAAALICArMCAgAAAAG0AgIAAAABAgAAALoCACAhAACdBwAgAwAAAAMAICEAAJkHACAiAAChBwAgFwAAAAMAIAMAANUEACAGAACuBQAgDAAA1gQAIA0AANcEACAOAADYBAAgGgAAoQcAIIACAQCBBAAhmwJAAIUEACGnAgEAhAQAIagCAQCBBAAhrAJAAIUEACG6AgAA0gTEAiLHAgEAgQQAIcgCAQCBBAAhyQIBAIEEACHKAgEAgQQAIcsCAQCBBAAhzAIIAIMEACHOAgAA0ATOAiLQAgAA0QTQAiLRAggAgwQAIdICIADTBAAhFQMAANUEACAGAACuBQAgDAAA1gQAIA0AANcEACAOAADYBAAggAIBAIEEACGbAkAAhQQAIacCAQCEBAAhqAIBAIEEACGsAkAAhQQAIboCAADSBMQCIscCAQCBBAAhyAIBAIEEACHJAgEAgQQAIcoCAQCBBAAhywIBAIEEACHMAggAgwQAIc4CAADQBM4CItACAADRBNACItECCACDBAAh0gIgANMEACEDAAAAWQAgIQAAmwcAICIAAKQHACAUAAAAWQAgBQAAyAUAIAwAAMwFACAPAADJBQAgEAAAygUAIBEAAMsFACASAADNBQAgEwAAzwUAIBQAANAFACAaAACkBwAggAIBAIEEACGbAkAAhQQAIawCQACFBAAhugIAAMcF7wIi5wIBAIEEACHoAgEAgQQAIekCIADTBAAh6gIBAIQEACHrAgEAhAQAIe0CAADGBe0CIhIFAADIBQAgDAAAzAUAIA8AAMkFACAQAADKBQAgEQAAywUAIBIAAM0FACATAADPBQAgFAAA0AUAIIACAQCBBAAhmwJAAIUEACGsAkAAhQQAIboCAADHBe8CIucCAQCBBAAh6AIBAIEEACHpAiAA0wQAIeoCAQCEBAAh6wIBAIQEACHtAgAAxgXtAiIDAAAABwAgIQAAnQcAICIAAKcHACAQAAAABwAgBAAAmAQAIAUAAJkEACAIAACaBAAgCQAAmwQAIBoAAKcHACCAAgEAgQQAIZsCQACFBAAhqgIIAIMEACGsAkAAhQQAIa0CAQCBBAAhrgIBAIEEACGwAgAAlgSwAiKyAgAAlwSyAiKzAgIAggQAIbQCAgCCBAAhDgQAAJgEACAFAACZBAAgCAAAmgQAIAkAAJsEACCAAgEAgQQAIZsCQACFBAAhqgIIAIMEACGsAkAAhQQAIa0CAQCBBAAhrgIBAIEEACGwAgAAlgSwAiKyAgAAlwSyAiKzAgIAggQAIbQCAgCCBAAhAQQAAgoFBgMKMAcLAA8MLgkPJgoQKgwRLQESLwQTNA0UOA4HAwACBggECiEHCwALDB0JDR8KDiAFBgQAAgUJAwgNBQkRBgoVBwsACAIGAAQHAAMBBgAEAwMAAgYABAcAAwQFFgAIFwAJGAAKGQACBAACBwADAgMAAgcAAwIKIwAMIgABBAACAQQAAgEEAAIIBTkACj4ADD0ADzoAEDsAETwAEz8AFEAAAAEEAAIBBAACAwsAFCcAFSgAFgAAAAMLABQnABUoABYAAAMLABsnABwoAB0AAAADCwAbJwAcKAAdAQQAAgEEAAIDCwAiJwAjKAAkAAAAAwsAIicAIygAJAEEAAIBBAACAwsAKScAKigAKwAAAAMLACknACooACsAAAADCwAxJwAyKAAzAAAAAwsAMScAMigAMwEEAAIBBAACAwsAOCcAOSgAOgAAAAMLADgnADkoADoCAwACBtQBBAIDAAIG2gEEBQsAPycAQigAQ4kBAECKAQBBAAAAAAAFCwA_JwBCKABDiQEAQIoBAEECBAACBwADAgQAAgcAAwMLAEgnAEkoAEoAAAADCwBIJwBJKABKAgMAAgcAAwIDAAIHAAMFCwBPJwBSKABTiQEAUIoBAFEAAAAAAAULAE8nAFIoAFOJAQBQigEAUQIGAAQHAAMCBgAEBwADBQsAWCcAWygAXIkBAFmKAQBaAAAAAAAFCwBYJwBbKABciQEAWYoBAFoBBgAEAQYABAULAGEnAGQoAGWJAQBiigEAYwAAAAAABQsAYScAZCgAZYkBAGKKAQBjAQQAAgEEAAIFCwBqJwBtKABuiQEAa4oBAGwAAAAAAAULAGonAG0oAG6JAQBrigEAbAMDAAIGAAQHAAMDAwACBgAEBwADBQsAcycAdigAd4kBAHSKAQB1AAAAAAAFCwBzJwB2KAB3iQEAdIoBAHUAAAAFCwB9JwCAASgAgQGJAQB-igEAfwAAAAAABQsAfScAgAEoAIEBiQEAfooBAH8VAgEWQQEXQgEYQwEZRAEbRgEcSBAdSREeSwEfTRAgThIjTwEkUAElURApVBMqVRcrVwIsWAItWwIuXAIvXQIwXwIxYRAyYhgzZAI0ZhA1Zxk2aAI3aQI4ahA5bRo6bh47bw08cA09cQ0-cg0_cw1AdQ1BdxBCeB9Deg1EfBBFfSBGfg1Hfw1IgAEQSYMBIUqEASVLhQEOTIYBDk2HAQ5OiAEOT4kBDlCLAQ5RjQEQUo4BJlOQAQ5UkgEQVZMBJ1aUAQ5XlQEOWJYBEFmZAShamgEsW5wBLVydAS1doAEtXqEBLV-iAS1gpAEtYaYBEGKnAS5jqQEtZKsBEGWsAS9mrQEtZ64BLWivARBpsgEwarMBNGu0AQxstQEMbbYBDG63AQxvuAEMcLoBDHG8ARByvQE1c78BDHTBARB1wgE2dsMBDHfEAQx4xQEQecgBN3rJATt7ygEDfMsBA33MAQN-zQEDf84BA4AB0AEDgQHSARCCAdMBPIMB1gEDhAHYARCFAdkBPYYB2wEDhwHcAQOIAd0BEIsB4AE-jAHhAUSNAeIBCY4B4wEJjwHkAQmQAeUBCZEB5gEJkgHoAQmTAeoBEJQB6wFFlQHtAQmWAe8BEJcB8AFGmAHxAQmZAfIBCZoB8wEQmwH2AUecAfcBS50B-AEKngH5AQqfAfoBCqAB-wEKoQH8AQqiAf4BCqMBgAIQpAGBAkylAYMCCqYBhQIQpwGGAk2oAYcCCqkBiAIKqgGJAhCrAYwCTqwBjQJUrQGOAgWuAY8CBa8BkAIFsAGRAgWxAZICBbIBlAIFswGWAhC0AZcCVbUBmQIFtgGbAhC3AZwCVrgBnQIFuQGeAgW6AZ8CELsBogJXvAGjAl29AaQCBr4BpQIGvwGmAgbAAacCBsEBqAIGwgGqAgbDAawCEMQBrQJexQGvAgbGAbECEMcBsgJfyAGzAgbJAbQCBsoBtQIQywG4AmDMAbkCZs0BuwIEzgG8AgTPAb4CBNABvwIE0QHAAgTSAcICBNMBxAIQ1AHFAmfVAccCBNYByQIQ1wHKAmjYAcsCBNkBzAIE2gHNAhDbAdACadwB0QJv3QHSAgfeAdMCB98B1AIH4AHVAgfhAdYCB-IB2AIH4wHaAhDkAdsCcOUB3QIH5gHfAhDnAeACcegB4QIH6QHiAgfqAeMCEOsB5gJy7AHnAnjtAekCee4B6gJ57wHtAnnwAe4CefEB7wJ58gHxAnnzAfMCEPQB9AJ69QH2Ann2AfgCEPcB-QJ7-AH6Ann5AfsCefoB_AIQ-wH_Anz8AYADggE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CashoutScalarFieldEnum: () => CashoutScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EarningScalarFieldEnum: () => EarningScalarFieldEnum,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  ParcelScalarFieldEnum: () => ParcelScalarFieldEnum,
  ParcelStatusLogScalarFieldEnum: () => ParcelStatusLogScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  RiderRatingScalarFieldEnum: () => RiderRatingScalarFieldEnum,
  RiderScalarFieldEnum: () => RiderScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StatsCacheScalarFieldEnum: () => StatsCacheScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserAddressScalarFieldEnum: () => UserAddressScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  UserAddress: "UserAddress",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Notification: "Notification",
  Parcel: "Parcel",
  ParcelStatusLog: "ParcelStatusLog",
  Payment: "Payment",
  Earning: "Earning",
  Cashout: "Cashout",
  Rider: "Rider",
  RiderRating: "RiderRating",
  StatsCache: "StatsCache"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserAddressScalarFieldEnum = {
  id: "id",
  userId: "userId",
  label: "label",
  address: "address",
  district: "district",
  phone: "phone",
  isDefault: "isDefault",
  createdAt: "createdAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  phone: "phone",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  message: "message",
  type: "type",
  isRead: "isRead",
  createdAt: "createdAt"
};
var ParcelScalarFieldEnum = {
  id: "id",
  trackingId: "trackingId",
  customerId: "customerId",
  riderId: "riderId",
  pickupAddress: "pickupAddress",
  deliveryAddress: "deliveryAddress",
  districtFrom: "districtFrom",
  districtTo: "districtTo",
  weight: "weight",
  parcelType: "parcelType",
  serviceType: "serviceType",
  status: "status",
  price: "price",
  isPaid: "isPaid",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ParcelStatusLogScalarFieldEnum = {
  id: "id",
  parcelId: "parcelId",
  status: "status",
  changedBy: "changedBy",
  note: "note",
  timestamp: "timestamp"
};
var PaymentScalarFieldEnum = {
  id: "id",
  parcelId: "parcelId",
  customerId: "customerId",
  amount: "amount",
  paymentMethod: "paymentMethod",
  transactionId: "transactionId",
  status: "status",
  createdAt: "createdAt"
};
var EarningScalarFieldEnum = {
  id: "id",
  riderId: "riderId",
  parcelId: "parcelId",
  amount: "amount",
  percentage: "percentage",
  status: "status",
  createdAt: "createdAt"
};
var CashoutScalarFieldEnum = {
  id: "id",
  riderId: "riderId",
  amount: "amount",
  status: "status",
  requestedAt: "requestedAt",
  processedAt: "processedAt"
};
var RiderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  district: "district",
  accountStatus: "accountStatus",
  currentStatus: "currentStatus",
  rating: "rating",
  totalRatings: "totalRatings",
  totalDeliveries: "totalDeliveries",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RiderRatingScalarFieldEnum = {
  id: "id",
  riderId: "riderId",
  customerId: "customerId",
  parcelId: "parcelId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StatsCacheScalarFieldEnum = {
  id: "id",
  totalParcels: "totalParcels",
  totalPendingParcels: "totalPendingParcels",
  totalCompletedParcels: "totalCompletedParcels",
  totalUsers: "totalUsers",
  totalRevenue: "totalRevenue",
  dailyRevenue: "dailyRevenue",
  weeklyRevenue: "weeklyRevenue",
  monthlyRevenue: "monthlyRevenue",
  dailyParcels: "dailyParcels",
  weeklyParcels: "weeklyParcels",
  monthlyParcels: "monthlyParcels",
  activeRiders: "activeRiders",
  onlineRiders: "onlineRiders",
  totalRiders: "totalRiders",
  topRiderId: "topRiderId",
  activeCustomers: "activeCustomers",
  totalCustomers: "totalCustomers",
  avgDeliveryTime: "avgDeliveryTime",
  deliverySuccessRate: "deliverySuccessRate",
  avgOrderValue: "avgOrderValue",
  platformRevenue: "platformRevenue",
  riderPayouts: "riderPayouts",
  pendingPayouts: "pendingPayouts",
  newUsersToday: "newUsersToday",
  newUsersThisWeek: "newUsersThisWeek",
  newUsersThisMonth: "newUsersThisMonth",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  RIDER: "RIDER",
  CUSTOMER: "CUSTOMER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var ParcelStatus = {
  REQUESTED: "REQUESTED",
  ASSIGNED: "ASSIGNED",
  PICKED: "PICKED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};
var RiderStatus = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OFFLINE: "OFFLINE"
};
var RiderAccountStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};
var PaymentMethod = {
  STRIPE: "STRIPE",
  MANUAL: "MANUAL",
  BKASH: "BKASH",
  SSLCOMMERZ: "SSLCOMMERZ"
};
var EarningStatus = {
  PENDING: "PENDING",
  PAID: "PAID"
};
var CashoutStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID"
};
var ParcelType = {
  DOCUMENT: "DOCUMENT",
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
  FRAGILE: "FRAGILE",
  ELECTRONICS: "ELECTRONICS"
};
var ServiceType = {
  STANDARD: "STANDARD",
  EXPRESS: "EXPRESS"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/module/parcel/services/getAvailableParcels.service.ts
import status from "http-status";
var getAvailableParcelsService = async (userId, userRole, page = 1, limit = 10) => {
  if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
    const skip2 = (page - 1) * limit;
    const [parcels2, total2] = await Promise.all([
      prisma.parcel.findMany({
        where: {
          status: ParcelStatus.REQUESTED,
          riderId: null
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: skip2,
        take: limit
      }),
      prisma.parcel.count({
        where: {
          status: ParcelStatus.REQUESTED,
          riderId: null
        }
      })
    ]);
    return {
      data: parcels2,
      meta: {
        page,
        limit,
        total: total2,
        totalPages: Math.ceil(total2 / limit)
      }
    };
  }
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new AppError_default(status.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status.FORBIDDEN, "Only active riders can view available parcels");
  }
  const skip = (page - 1) * limit;
  const [parcels, total] = await Promise.all([
    prisma.parcel.findMany({
      where: {
        status: ParcelStatus.REQUESTED,
        riderId: null,
        isPaid: true
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.parcel.count({
      where: {
        status: ParcelStatus.REQUESTED,
        riderId: null,
        isPaid: true
      }
    })
  ]);
  return {
    data: parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// src/app/module/parcel/services/getAssignedParcels.service.ts
import status2 from "http-status";
var getAssignedParcelsService = async (riderId, page = 1, limit = 10) => {
  const rider = await prisma.rider.findUnique({
    where: { userId: riderId }
  });
  if (!rider) {
    throw new AppError_default(status2.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status2.FORBIDDEN, "Only active riders can view assigned parcels");
  }
  const skip = (page - 1) * limit;
  const [parcels, total] = await Promise.all([
    prisma.parcel.findMany({
      where: {
        riderId: rider.id,
        status: {
          in: [ParcelStatus.ASSIGNED, ParcelStatus.IN_TRANSIT]
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: {
          in: [ParcelStatus.ASSIGNED, ParcelStatus.IN_TRANSIT]
        }
      }
    })
  ]);
  return {
    data: parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// src/app/module/parcel/services/pickParcel.service.ts
import status3 from "http-status";
var pickParcelService = async (riderId, parcelId, payload) => {
  const rider = await prisma.rider.findUnique({
    where: { userId: riderId }
  });
  if (!rider) {
    throw new AppError_default(status3.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status3.FORBIDDEN, "Only active riders can pick up parcels");
  }
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status3.NOT_FOUND, "Parcel not found");
  }
  if (parcel.riderId !== rider.id) {
    throw new AppError_default(status3.FORBIDDEN, "This parcel is not assigned to you");
  }
  if (parcel.status !== ParcelStatus.ASSIGNED) {
    throw new AppError_default(status3.BAD_REQUEST, "Parcel must be in ASSIGNED status to pick up");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        status: ParcelStatus.IN_TRANSIT
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: ParcelStatus.IN_TRANSIT,
        changedBy: riderId,
        note: payload.note
      }
    });
    await tx.rider.update({
      where: { id: rider.id },
      data: {
        currentStatus: RiderStatus.BUSY
      }
    });
    return updated;
  });
  return updatedParcel;
};

// src/app/module/parcel/services/deliverParcel.service.ts
import status4 from "http-status";

// src/app/shared/services/statsCache.service.ts
var updateStatsCache = async (updates) => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) {
    await prisma.statsCache.create({
      data: {
        totalUsers: typeof updates.totalUsers === "number" ? updates.totalUsers : 0,
        totalParcels: typeof updates.totalParcels === "number" ? updates.totalParcels : 0,
        totalPendingParcels: typeof updates.totalPendingParcels === "number" ? updates.totalPendingParcels : 0,
        totalCompletedParcels: typeof updates.totalCompletedParcels === "number" ? updates.totalCompletedParcels : 0,
        totalRevenue: typeof updates.totalRevenue === "number" ? updates.totalRevenue : 0,
        dailyRevenue: typeof updates.dailyRevenue === "number" ? updates.dailyRevenue : 0,
        weeklyRevenue: typeof updates.weeklyRevenue === "number" ? updates.weeklyRevenue : 0,
        monthlyRevenue: typeof updates.monthlyRevenue === "number" ? updates.monthlyRevenue : 0,
        dailyParcels: typeof updates.dailyParcels === "number" ? updates.dailyParcels : 0,
        weeklyParcels: typeof updates.weeklyParcels === "number" ? updates.weeklyParcels : 0,
        monthlyParcels: typeof updates.monthlyParcels === "number" ? updates.monthlyParcels : 0,
        activeRiders: typeof updates.activeRiders === "number" ? updates.activeRiders : 0,
        onlineRiders: typeof updates.onlineRiders === "number" ? updates.onlineRiders : 0,
        totalRiders: typeof updates.totalRiders === "number" ? updates.totalRiders : 0,
        topRiderId: updates.topRiderId,
        activeCustomers: typeof updates.activeCustomers === "number" ? updates.activeCustomers : 0,
        totalCustomers: typeof updates.totalCustomers === "number" ? updates.totalCustomers : 0,
        avgDeliveryTime: updates.avgDeliveryTime || 0,
        deliverySuccessRate: updates.deliverySuccessRate || 0,
        avgOrderValue: updates.avgOrderValue || 0,
        platformRevenue: typeof updates.platformRevenue === "number" ? updates.platformRevenue : 0,
        riderPayouts: typeof updates.riderPayouts === "number" ? updates.riderPayouts : 0,
        pendingPayouts: typeof updates.pendingPayouts === "number" ? updates.pendingPayouts : 0,
        newUsersToday: typeof updates.newUsersToday === "number" ? updates.newUsersToday : 0,
        newUsersThisWeek: typeof updates.newUsersThisWeek === "number" ? updates.newUsersThisWeek : 0,
        newUsersThisMonth: typeof updates.newUsersThisMonth === "number" ? updates.newUsersThisMonth : 0
      }
    });
  } else {
    await prisma.statsCache.update({
      where: { id: cache.id },
      data: updates
    });
  }
};
var getStatsCache = async () => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) {
    return prisma.statsCache.create({
      data: {
        totalUsers: 0,
        totalParcels: 0,
        totalPendingParcels: 0,
        totalCompletedParcels: 0,
        totalRevenue: 0,
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        dailyParcels: 0,
        weeklyParcels: 0,
        monthlyParcels: 0,
        activeRiders: 0,
        onlineRiders: 0,
        totalRiders: 0,
        activeCustomers: 0,
        totalCustomers: 0,
        avgDeliveryTime: 0,
        deliverySuccessRate: 0,
        avgOrderValue: 0,
        platformRevenue: 0,
        riderPayouts: 0,
        pendingPayouts: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0
      }
    });
  }
  return cache;
};

// src/app/module/parcel/services/deliverParcel.service.ts
var deliverParcelService = async (riderId, parcelId, payload) => {
  const rider = await prisma.rider.findUnique({
    where: { userId: riderId }
  });
  if (!rider) {
    throw new AppError_default(status4.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status4.FORBIDDEN, "Only active riders can deliver parcels");
  }
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status4.NOT_FOUND, "Parcel not found");
  }
  if (parcel.riderId !== rider.id) {
    throw new AppError_default(status4.FORBIDDEN, "This parcel is not assigned to you");
  }
  if (parcel.status !== ParcelStatus.IN_TRANSIT) {
    throw new AppError_default(status4.BAD_REQUEST, "Parcel must be in IN_TRANSIT status to deliver");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        status: ParcelStatus.DELIVERED
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: ParcelStatus.DELIVERED,
        changedBy: riderId,
        note: payload.note
      }
    });
    const riderPercentage = 0.7;
    const earningAmount = parcel.price * riderPercentage;
    await tx.earning.create({
      data: {
        riderId: rider.id,
        parcelId,
        amount: earningAmount,
        percentage: riderPercentage * 100,
        status: EarningStatus.PENDING
      }
    });
    await tx.rider.update({
      where: { id: rider.id },
      data: {
        currentStatus: RiderStatus.AVAILABLE
      }
    });
    return updated;
  });
  await updateStatsCache({
    totalCompletedParcels: { increment: 1 }
  });
  const parcelLogs = await prisma.parcelStatusLog.findMany({
    where: { parcelId },
    orderBy: { timestamp: "asc" }
  });
  if (parcelLogs.length >= 2) {
    const pickupTime = parcelLogs.find((log) => log.status === ParcelStatus.IN_TRANSIT)?.timestamp;
    const deliveredTime = parcelLogs.find((log) => log.status === ParcelStatus.DELIVERED)?.timestamp;
    if (pickupTime && deliveredTime) {
      const deliveryTimeHours = (deliveredTime.getTime() - pickupTime.getTime()) / (1e3 * 60 * 60);
      const cache = await getStatsCache();
      const newAvg = (cache.avgDeliveryTime * (cache.totalCompletedParcels - 1) + deliveryTimeHours) / cache.totalCompletedParcels;
      await updateStatsCache({ avgDeliveryTime: newAvg });
    }
  }
  const totalParcels = await prisma.parcel.count();
  const cancelledParcels = await prisma.parcel.count({ where: { status: ParcelStatus.CANCELLED } });
  const successRate = totalParcels > 0 ? (totalParcels - cancelledParcels) / totalParcels * 100 : 0;
  await updateStatsCache({ deliverySuccessRate: successRate });
  return updatedParcel;
};

// src/app/module/parcel/services/acceptParcel.service.ts
import status5 from "http-status";
var acceptParcelService = async (riderId, parcelId, payload) => {
  const rider = await prisma.rider.findUnique({
    where: { userId: riderId }
  });
  if (!rider) {
    throw new AppError_default(status5.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status5.FORBIDDEN, "Only active riders can accept parcels");
  }
  if (rider.currentStatus !== RiderStatus.AVAILABLE) {
    throw new AppError_default(status5.BAD_REQUEST, "Rider must be available to accept new parcels");
  }
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status5.NOT_FOUND, "Parcel not found");
  }
  if (parcel.riderId !== null) {
    throw new AppError_default(status5.CONFLICT, "Parcel is already assigned to another rider");
  }
  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError_default(status5.BAD_REQUEST, "Parcel must be in REQUESTED status to accept");
  }
  if (!parcel.isPaid) {
    throw new AppError_default(status5.BAD_REQUEST, "Parcel must be paid before accepting");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        status: ParcelStatus.ASSIGNED,
        riderId: rider.id
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: ParcelStatus.ASSIGNED,
        changedBy: riderId,
        note: payload.note
      }
    });
    return updated;
  });
  await updateStatsCache({
    totalPendingParcels: { decrement: 1 }
  });
  return updatedParcel;
};

// src/app/module/parcel/utils/pricing.ts
var BASE_RATES = {
  [ServiceType.STANDARD]: { sameDistrict: 60, interDistrict: 120 },
  [ServiceType.EXPRESS]: { sameDistrict: 110, interDistrict: 200 }
};
var TYPE_SURCHARGES = {
  [ParcelType.DOCUMENT]: 0,
  [ParcelType.SMALL]: 0,
  [ParcelType.MEDIUM]: 20,
  [ParcelType.LARGE]: 50,
  [ParcelType.FRAGILE]: 50,
  [ParcelType.ELECTRONICS]: 70
};
var WEIGHT_FREE_KG = 1;
var RATE_PER_EXTRA_KG = 15;
function calculateParcelPrice(input) {
  const { weight, parcelType, serviceType, districtFrom, districtTo } = input;
  const isSameDistrict = districtFrom.trim().toLowerCase() === districtTo.trim().toLowerCase();
  const base = isSameDistrict ? BASE_RATES[serviceType].sameDistrict : BASE_RATES[serviceType].interDistrict;
  const typeSurcharge = TYPE_SURCHARGES[parcelType];
  const extraKg = Math.max(0, weight - WEIGHT_FREE_KG);
  const weightSurcharge = Math.ceil(extraKg) * RATE_PER_EXTRA_KG;
  const price = base + typeSurcharge + weightSurcharge;
  return {
    price,
    breakdown: { base, typeSurcharge, weightSurcharge }
  };
}

// src/app/module/parcel/services/createParcel.service.ts
var createParcelService = async (customerId, payload) => {
  const trackingId = `PKG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const { price, breakdown } = calculateParcelPrice({
    weight: payload.weight,
    parcelType: payload.parcelType,
    serviceType: payload.serviceType,
    districtFrom: payload.districtFrom,
    districtTo: payload.districtTo
  });
  const parcel = await prisma.$transaction(async (tx) => {
    const createdParcel = await tx.parcel.create({
      data: {
        trackingId,
        customerId,
        pickupAddress: payload.pickupAddress,
        deliveryAddress: payload.deliveryAddress,
        districtFrom: payload.districtFrom,
        districtTo: payload.districtTo,
        weight: payload.weight,
        parcelType: payload.parcelType,
        serviceType: payload.serviceType,
        price,
        status: ParcelStatus.REQUESTED
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId: createdParcel.id,
        status: ParcelStatus.REQUESTED,
        changedBy: customerId,
        note: payload.note
      }
    });
    return createdParcel;
  });
  await updateStatsCache({
    totalParcels: { increment: 1 },
    totalPendingParcels: { increment: 1 },
    dailyParcels: { increment: 1 },
    weeklyParcels: { increment: 1 },
    monthlyParcels: { increment: 1 }
  });
  return { ...parcel, priceBreakdown: breakdown };
};

// src/app/module/parcel/services/getMyParcels.service.ts
var getMyParcelsService = async (customerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [parcels, total] = await Promise.all([
    prisma.parcel.findMany({
      where: {
        customerId
      },
      include: {
        rider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.parcel.count({
      where: {
        customerId
      }
    })
  ]);
  return {
    data: parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// src/app/module/parcel/services/getParcelById.service.ts
import status6 from "http-status";
var getParcelByIdService = async (parcelId, userId, userRole) => {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      rider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      statusLogs: {
        orderBy: {
          timestamp: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!parcel) {
    throw new AppError_default(status6.NOT_FOUND, "Parcel not found");
  }
  if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
    return parcel;
  }
  if (parcel.customerId !== userId && parcel.riderId) {
    const rider = await prisma.rider.findUnique({
      where: { id: parcel.riderId }
    });
    if (rider?.userId !== userId) {
      throw new AppError_default(status6.FORBIDDEN, "You don't have permission to view this parcel");
    }
  } else if (parcel.customerId !== userId) {
    throw new AppError_default(status6.FORBIDDEN, "You don't have permission to view this parcel");
  }
  return parcel;
};

// src/app/module/parcel/services/cancelParcel.service.ts
import status7 from "http-status";
var cancelParcelService = async (customerId, parcelId, payload) => {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status7.NOT_FOUND, "Parcel not found");
  }
  if (parcel.customerId !== customerId) {
    throw new AppError_default(status7.FORBIDDEN, "You can only cancel your own parcels");
  }
  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError_default(status7.BAD_REQUEST, "Only parcels in REQUESTED status can be cancelled");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        status: ParcelStatus.CANCELLED
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: ParcelStatus.CANCELLED,
        changedBy: customerId,
        note: payload.note
      }
    });
    return updated;
  });
  return updatedParcel;
};

// src/app/module/parcel/services/getAllParcels.service.ts
var getAllParcelsService = async (page = 1, limit = 10, status85, district, date) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (status85) {
    where.status = status85;
  }
  if (district) {
    where.OR = [
      { districtFrom: { contains: district, mode: "insensitive" } },
      { districtTo: { contains: district, mode: "insensitive" } }
    ];
  }
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    where.createdAt = {
      gte: startDate,
      lt: endDate
    };
  }
  const [parcels, total] = await Promise.all([
    prisma.parcel.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        rider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.parcel.count({ where })
  ]);
  return {
    data: parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// src/app/module/parcel/services/assignRider.service.ts
import status8 from "http-status";
var assignRiderService = async (parcelId, payload, adminId) => {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status8.NOT_FOUND, "Parcel not found");
  }
  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError_default(status8.BAD_REQUEST, "Only parcels in REQUESTED status can be assigned to a rider");
  }
  if (parcel.riderId) {
    throw new AppError_default(status8.BAD_REQUEST, "Parcel is already assigned to a rider");
  }
  if (!parcel.isPaid) {
    throw new AppError_default(status8.BAD_REQUEST, "Parcel must be paid before assigning a rider");
  }
  const rider = await prisma.rider.findUnique({
    where: { id: payload.riderId }
  });
  if (!rider) {
    throw new AppError_default(status8.NOT_FOUND, "Rider not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status8.BAD_REQUEST, "Rider account is not active");
  }
  if (rider.currentStatus !== RiderStatus.AVAILABLE) {
    throw new AppError_default(status8.BAD_REQUEST, "Rider is not available for new assignments");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        riderId: payload.riderId,
        status: ParcelStatus.ASSIGNED
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: ParcelStatus.ASSIGNED,
        changedBy: adminId,
        note: payload.note
      }
    });
    return updated;
  });
  return updatedParcel;
};

// src/app/module/parcel/services/updateParcelStatus.service.ts
import status9 from "http-status";
var updateParcelStatusService = async (parcelId, payload, adminId) => {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId }
  });
  if (!parcel) {
    throw new AppError_default(status9.NOT_FOUND, "Parcel not found");
  }
  if (parcel.status === payload.status) {
    throw new AppError_default(status9.BAD_REQUEST, "Parcel is already in the requested status");
  }
  const updatedParcel = await prisma.$transaction(async (tx) => {
    const updated = await tx.parcel.update({
      where: { id: parcelId },
      data: {
        status: payload.status
      }
    });
    await tx.parcelStatusLog.create({
      data: {
        parcelId,
        status: payload.status,
        changedBy: adminId,
        note: payload.note
      }
    });
    return updated;
  });
  return updatedParcel;
};

// src/app/module/parcel/services/parcelPayment.service.ts
import status11 from "http-status";

// src/app/module/payment/services/payment.service.ts
import status10 from "http-status";

// src/app/module/payment/services/stripe.service.ts
import Stripe from "stripe";

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config({ quiet: true });
var loadEnvVariables = () => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "BACKEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SSLCOMMERZ_STORE_ID",
    "SSLCOMMERZ_STORE_PASSWORD",
    "SSLCOMMERZ_IS_SANDBOX"
  ];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SSLCOMMERZ: {
      STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
      STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
      IS_SANDBOX: process.env.SSLCOMMERZ_IS_SANDBOX === "true"
    }
  };
};
var envVars = loadEnvVariables();

// src/app/module/payment/services/stripe.service.ts
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var stripeService = {
  /**
   * Create a Stripe Checkout Session for payment
   */
  async createCheckoutSession(params) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: params.currency || "usd",
            product_data: {
              name: "Payment",
              description: params.metadata.description || "Payment for service"
            },
            unit_amount: Math.round(params.amount * 100)
            // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: params.metadata
    });
    return {
      url: session.url,
      sessionId: session.id
    };
  },
  /**
   * Verify Stripe webhook signature
   */
  async verifyWebhookSignature(payload, signature) {
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  },
  /**
   * Extract metadata from Stripe event
   */
  extractMetadata(event) {
    const session = event.data.object;
    return session.metadata || null;
  },
  /**
   * Extract amount from Stripe event
   */
  extractAmount(event) {
    const session = event.data.object;
    return session.amount_total ? session.amount_total / 100 : 0;
  },
  /**
   * Check if payment was successful
   */
  isPaymentSuccessful(event) {
    return event.type === "checkout.session.completed";
  }
};
var stripe_service_default = stripeService;

// src/app/module/payment/services/sslcommerz.service.ts
import crypto from "crypto";
var SSLCOMMERZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
var SSLCOMMERZ_LIVE_URL = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
var sslcommerzService = {
  /**
   * Get SSL Commerz API URL based on sandbox mode
   */
  getApiUrl() {
    return envVars.SSLCOMMERZ.IS_SANDBOX ? SSLCOMMERZ_SANDBOX_URL : SSLCOMMERZ_LIVE_URL;
  },
  /**
   * Create SSL Commerz payment session
   */
  async createSession(params) {
    const { amount, customerEmail, customerName, cancelUrl, metadata } = params;
    const tranId = `TRANSACTION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const payload = {
      store_id: envVars.SSLCOMMERZ.STORE_ID,
      store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
      total_amount: amount.toString(),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${envVars.BACKEND_URL}/api/v1/payments/sslcommerz/success`,
      fail_url: cancelUrl,
      cancel_url: cancelUrl,
      ipn_url: `${envVars.BACKEND_URL}/api/v1/payments/sslcommerz/ipn`,
      shipping_method: "NO",
      product_name: metadata.description || "Parcel Delivery",
      product_category: "Service",
      product_profile: "non-physical-goods",
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      ship_name: customerName,
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
      multi_card_name: "visa,mastercard,amex",
      value_a: metadata.type || "parcel",
      value_b: metadata.parcelId || "",
      value_c: metadata.description || ""
    };
    try {
      const response = await fetch(this.getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(payload).toString()
      });
      const data = await response.json();
      if (data.status === "FAILED") {
        throw new Error(`SSL Commerz session creation failed: ${data.failedreason}`);
      }
      return {
        url: data.GatewayPageURL,
        sessionId: tranId
      };
    } catch (error) {
      throw new Error(`SSL Commerz session creation error: ${error instanceof Error ? error.message : "Unknown error"}`, { cause: error });
    }
  },
  /**
   * Verify SSL Commerz IPN signature
   */
  verifyIPN(ipnData) {
    const storeId = envVars.SSLCOMMERZ.STORE_ID;
    const storePassword = envVars.SSLCOMMERZ.STORE_PASSWORD;
    const status85 = ipnData.status;
    const tranId = ipnData.tran_id;
    const amount = ipnData.amount;
    const currency = ipnData.currency;
    const validationString = `${storeId},${amount},${currency},${tranId},${status85},${storePassword}`;
    const calculatedHash = crypto.createHash("md5").update(validationString).digest("hex");
    return calculatedHash === ipnData.val_id;
  },
  /**
   * Extract transaction ID from IPN data
   */
  extractTransactionId(ipnData) {
    return ipnData.tran_id || "";
  },
  /**
   * Extract amount from IPN data
   */
  extractAmount(ipnData) {
    return parseFloat(ipnData.amount) || 0;
  },
  /**
   * Extract metadata from IPN data
   */
  extractMetadata(ipnData) {
    return {
      type: ipnData.value_a || "",
      parcelId: ipnData.value_b || "",
      description: ipnData.value_c || ""
    };
  },
  /**
   * Check if payment was successful
   */
  isPaymentSuccessful(ipnData) {
    return ipnData.status === "VALID" || ipnData.status === "VALIDATED";
  },
  /**
   * Validate payment using SSL Commerz validation API
   */
  async validatePayment(valId) {
    const validationUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${envVars.SSLCOMMERZ.STORE_ID}&store_passwd=${envVars.SSLCOMMERZ.STORE_PASSWORD}&v=1&format=json`;
    try {
      const response = await fetch(validationUrl);
      const data = await response.json();
      if (data.status !== "VALID") {
        return {
          isValid: false,
          tranId: "",
          amount: 0,
          cardType: "",
          tranDate: ""
        };
      }
      return {
        isValid: true,
        tranId: data.tran_id || "",
        amount: parseFloat(data.amount) || 0,
        cardType: data.card_type || "",
        tranDate: data.tran_date || ""
      };
    } catch (error) {
      throw new Error(`SSL Commerz validation error: ${error instanceof Error ? error.message : "Unknown error"}`, { cause: error });
    }
  }
};
var sslcommerz_service_default = sslcommerzService;

// src/app/module/payment/services/payment.service.ts
var webhookCallbacks = /* @__PURE__ */ new Map();
var paymentService = {
  /**
   * Register a webhook callback for a specific module/type
   */
  registerWebhookCallback(type, callback) {
    webhookCallbacks.set(type, callback);
  },
  /**
   * Initiate payment (generic)
   */
  async initiatePayment(payload) {
    const { amount, customerEmail, customerName, paymentMethod, metadata, successUrl, cancelUrl, currency } = payload;
    if (amount <= 0) {
      throw new AppError_default(status10.BAD_REQUEST, "Invalid payment amount");
    }
    let paymentUrl;
    let sessionId;
    if (paymentMethod === "STRIPE") {
      const stripeResult = await stripe_service_default.createCheckoutSession({
        amount,
        customerEmail,
        customerName,
        successUrl,
        cancelUrl,
        metadata,
        currency
      });
      paymentUrl = stripeResult.url;
      sessionId = stripeResult.sessionId;
    } else if (paymentMethod === "SSLCOMMERZ") {
      const sslcommerzResult = await sslcommerz_service_default.createSession({
        amount,
        customerEmail,
        customerName,
        successUrl,
        cancelUrl,
        metadata
      });
      paymentUrl = sslcommerzResult.url;
      sessionId = sslcommerzResult.sessionId;
    } else if (paymentMethod === "MANUAL") {
      throw new AppError_default(status10.BAD_REQUEST, "Manual payment not implemented yet");
    } else if (paymentMethod === "BKASH") {
      throw new AppError_default(status10.BAD_REQUEST, "bKash payment not implemented yet");
    } else {
      throw new AppError_default(status10.BAD_REQUEST, "Invalid payment method");
    }
    return {
      paymentUrl,
      sessionId,
      amount,
      metadata
    };
  },
  /**
   * Handle Stripe webhook (generic)
   */
  async handleStripeWebhook(event) {
    const stripeEvent = event;
    const metadata = stripe_service_default.extractMetadata(stripeEvent);
    if (!metadata) {
      throw new Error("Metadata not found in webhook");
    }
    if (!stripe_service_default.isPaymentSuccessful(stripeEvent)) {
      return;
    }
    const amount = stripe_service_default.extractAmount(stripeEvent);
    const paymentType = metadata.type || "default";
    const callback = webhookCallbacks.get(paymentType);
    if (callback) {
      await callback(metadata, amount);
    } else {
      console.warn(`No callback registered for payment type: ${paymentType}`);
    }
  },
  /**
   * Handle generic webhook callback (for SSL Commerz and other providers)
   */
  async handleWebhookCallback(paymentType, metadata, amount) {
    const callback = webhookCallbacks.get(paymentType);
    if (callback) {
      await callback(metadata, amount);
    } else {
      console.warn(`No callback registered for payment type: ${paymentType}`);
    }
  },
  /**
   * Find payment by transaction ID
   */
  async findPaymentByTransactionId(transactionId) {
    return await prisma.payment.findUnique({
      where: { transactionId }
    });
  },
  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId, status85) {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: { status: status85 }
    });
  }
};
var payment_service_default = paymentService;

// src/app/module/parcel/services/parcelPayment.service.ts
var EARNING_PERCENTAGE = 0.7;
var parcelPaymentService = {
  /**
   * Initiate payment for a parcel
   */
  async initiateParcelPayment(parcelId, paymentMethod, userId) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: {
        customer: true
      }
    });
    if (!parcel) {
      throw new AppError_default(status11.NOT_FOUND, "Parcel not found");
    }
    if (parcel.customerId !== userId) {
      throw new AppError_default(status11.FORBIDDEN, "You can only pay for your own parcels");
    }
    if (parcel.isPaid) {
      throw new AppError_default(status11.BAD_REQUEST, "Parcel is already paid");
    }
    if (parcel.status !== ParcelStatus.REQUESTED) {
      throw new AppError_default(
        status11.BAD_REQUEST,
        "Payment can only be initiated for parcels in REQUESTED status"
      );
    }
    if (parcel.price <= 0) {
      throw new AppError_default(status11.BAD_REQUEST, "Invalid parcel price");
    }
    const existingPayment = await prisma.payment.findUnique({
      where: { parcelId: parcel.id }
    });
    let payment;
    if (existingPayment) {
      if (existingPayment.status === "PENDING" || existingPayment.status === "FAILED") {
        payment = await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            amount: parcel.price,
            paymentMethod,
            status: "PENDING"
          }
        });
      } else {
        throw new AppError_default(status11.BAD_REQUEST, "Payment already completed for this parcel");
      }
    } else {
      payment = await prisma.payment.create({
        data: {
          parcelId: parcel.id,
          customerId: userId,
          amount: parcel.price,
          paymentMethod,
          status: "PENDING"
        }
      });
    }
    const result = await payment_service_default.initiatePayment({
      amount: parcel.price,
      customerEmail: parcel.customer.email,
      customerName: parcel.customer.name,
      paymentMethod,
      metadata: {
        type: "parcel",
        parcelId: parcel.id,
        description: `Parcel Delivery - ${parcel.trackingId}`
      },
      successUrl: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${envVars.FRONTEND_URL}/payment/cancel?parcel_id=${parcel.id}`,
      currency: "bdt"
    });
    await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: result.sessionId }
    });
    return {
      ...result,
      paymentId: payment.id
    };
  },
  /**
   * Handle parcel payment webhook callback
   */
  async handleParcelPaymentWebhook(metadata, amount) {
    const parcelId = metadata.parcelId;
    if (!parcelId) {
      throw new Error("Parcel ID not found in webhook metadata");
    }
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          parcelId,
          status: PaymentStatus.PENDING
        },
        data: {
          status: PaymentStatus.SUCCESS
        }
      });
      const parcel = await tx.parcel.update({
        where: { id: parcelId },
        data: { isPaid: true }
      });
      if (parcel.riderId) {
        await tx.earning.create({
          data: {
            riderId: parcel.riderId,
            parcelId: parcel.id,
            amount: parcel.price * EARNING_PERCENTAGE,
            percentage: EARNING_PERCENTAGE,
            status: PaymentStatus.PENDING
          }
        });
      }
    });
    await updateStatsCache({
      totalRevenue: { increment: amount },
      dailyRevenue: { increment: amount },
      weeklyRevenue: { increment: amount },
      monthlyRevenue: { increment: amount },
      platformRevenue: { increment: amount * 0.3 }
      // Platform takes 30%
    });
  }
};
var parcelPayment_service_default = parcelPaymentService;

// src/app/module/parcel/services/trackParcel.service.ts
import status12 from "http-status";
var trackParcelService = async (trackingId) => {
  const parcel = await prisma.parcel.findFirst({
    where: {
      trackingId: {
        contains: trackingId,
        mode: "insensitive"
      }
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      rider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      statusLogs: {
        orderBy: {
          timestamp: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!parcel) {
    throw new AppError_default(status12.NOT_FOUND, "Parcel not found");
  }
  return parcel;
};

// src/app/shared/pagination.ts
var calculatePaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages
  };
};
var getPaginationParams = (page, limit) => {
  const pageNum = page ? parseInt(Array.isArray(page) ? page[0] : page, 10) : 1;
  const limitNum = limit ? parseInt(Array.isArray(limit) ? limit[0] : limit, 10) : 10;
  return {
    page: isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
    limit: isNaN(limitNum) || limitNum < 1 ? 10 : limitNum
  };
};
var paginationHelper = (query) => {
  const { page, limit } = getPaginationParams(query.page, query.limit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// src/app/module/parcel/controllers/getAvailableParcels.controller.ts
var getAvailableParcelsController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status13.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    if (!userRole) {
      sendResponse(res, {
        httpStatusCode: status13.UNAUTHORIZED,
        success: false,
        message: "User role not found"
      });
      return;
    }
    const { page, limit } = getPaginationParams(
      req.query.page ? String(req.query.page) : void 0,
      req.query.limit ? String(req.query.limit) : void 0
    );
    const result = await getAvailableParcelsService(userId, userRole, page, limit);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Available parcels fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/parcel/controllers/getAssignedParcels.controller.ts
import status14 from "http-status";
var getAssignedParcelsController = catchAsync(
  async (req, res) => {
    const riderId = req.user?.userId;
    if (!riderId) {
      sendResponse(res, {
        httpStatusCode: status14.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const { page, limit } = getPaginationParams(
      req.query.page ? String(req.query.page) : void 0,
      req.query.limit ? String(req.query.limit) : void 0
    );
    const result = await getAssignedParcelsService(riderId, page, limit);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "Assigned parcels fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/parcel/controllers/pickParcel.controller.ts
import status15 from "http-status";

// src/app/module/parcel/validations/parcel.validation.ts
import { z } from "zod";
var BANGLADESH_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Comilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jessore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon"
];
var districtSchema = z.enum(BANGLADESH_DISTRICTS, {
  message: "Invalid district. Must be a valid Bangladesh district"
});
var pickParcelValidation = z.object({
  note: z.string().optional()
});
var deliverParcelValidation = z.object({
  note: z.string().optional()
});
var acceptParcelValidation = z.object({
  note: z.string().optional()
});
var createParcelValidation = z.object({
  pickupAddress: z.string().min(1, "Pickup address is required").max(500, "Pickup address must not exceed 500 characters"),
  deliveryAddress: z.string().min(1, "Delivery address is required").max(500, "Delivery address must not exceed 500 characters"),
  districtFrom: districtSchema,
  districtTo: districtSchema,
  weight: z.number().positive("Weight must be a positive number").max(50, "Maximum parcel weight is 50 kg"),
  parcelType: z.nativeEnum(ParcelType, { message: "Invalid parcel type" }),
  serviceType: z.nativeEnum(ServiceType, { message: "Invalid service type" }).default(ServiceType.STANDARD),
  note: z.string().optional()
});
var cancelParcelValidation = z.object({
  note: z.string().optional()
});
var assignRiderValidation = z.object({
  riderId: z.string().min(1, "Rider ID is required"),
  note: z.string().optional()
});
var updateParcelStatusValidation = z.object({
  status: z.nativeEnum(ParcelStatus),
  note: z.string().optional()
});
var parcelPaymentValidation = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: "Payment method must be STRIPE, MANUAL, BKASH, or SSLCOMMERZ"
  })
});

// src/app/module/parcel/controllers/pickParcel.controller.ts
var pickParcelController = catchAsync(
  async (req, res) => {
    const riderId = req.user?.userId;
    const parcelId = req.params.id;
    if (!riderId) {
      sendResponse(res, {
        httpStatusCode: status15.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = pickParcelValidation.parse(req.body);
    const payload = {
      note: validatedPayload.note
    };
    const parcel = await pickParcelService(riderId, parcelId, payload);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "Parcel picked up successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/deliverParcel.controller.ts
import status16 from "http-status";
var deliverParcelController = catchAsync(
  async (req, res) => {
    const riderId = req.user?.userId;
    const parcelId = req.params.id;
    if (!riderId) {
      sendResponse(res, {
        httpStatusCode: status16.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = deliverParcelValidation.parse(req.body);
    const payload = {
      note: validatedPayload.note
    };
    const parcel = await deliverParcelService(riderId, parcelId, payload);
    sendResponse(res, {
      httpStatusCode: status16.OK,
      success: true,
      message: "Parcel delivered successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/acceptParcel.controller.ts
import status17 from "http-status";
var acceptParcelController = catchAsync(
  async (req, res) => {
    const riderId = req.user?.userId;
    const parcelId = req.params.id;
    if (!riderId) {
      sendResponse(res, {
        httpStatusCode: status17.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = acceptParcelValidation.parse(req.body);
    const payload = {
      note: validatedPayload.note
    };
    const parcel = await acceptParcelService(riderId, parcelId, payload);
    sendResponse(res, {
      httpStatusCode: status17.OK,
      success: true,
      message: "Parcel accepted successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/createParcel.controller.ts
import status18 from "http-status";
var createParcelController = catchAsync(
  async (req, res) => {
    const customerId = req.user?.userId;
    if (!customerId) {
      sendResponse(res, {
        httpStatusCode: status18.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = createParcelValidation.parse(req.body);
    const payload = {
      pickupAddress: validatedPayload.pickupAddress,
      deliveryAddress: validatedPayload.deliveryAddress,
      districtFrom: validatedPayload.districtFrom,
      districtTo: validatedPayload.districtTo,
      weight: validatedPayload.weight,
      parcelType: validatedPayload.parcelType,
      serviceType: validatedPayload.serviceType,
      note: validatedPayload.note
    };
    const parcel = await createParcelService(customerId, payload);
    sendResponse(res, {
      httpStatusCode: status18.CREATED,
      success: true,
      message: "Parcel created successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/getMyParcels.controller.ts
import status19 from "http-status";
var getMyParcelsController = catchAsync(
  async (req, res) => {
    const customerId = req.user?.userId;
    if (!customerId) {
      sendResponse(res, {
        httpStatusCode: status19.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const { page, limit } = getPaginationParams(
      req.query.page ? String(req.query.page) : void 0,
      req.query.limit ? String(req.query.limit) : void 0
    );
    const result = await getMyParcelsService(customerId, page, limit);
    sendResponse(res, {
      httpStatusCode: status19.OK,
      success: true,
      message: "My parcels fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/parcel/controllers/getParcelById.controller.ts
import status20 from "http-status";
var getParcelByIdController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const parcelId = req.params.id;
    if (!userId || !userRole) {
      sendResponse(res, {
        httpStatusCode: status20.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const parcel = await getParcelByIdService(parcelId, userId, userRole);
    sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Parcel fetched successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/cancelParcel.controller.ts
import status21 from "http-status";
var cancelParcelController = catchAsync(
  async (req, res) => {
    const customerId = req.user?.userId;
    const parcelId = req.params.id;
    if (!customerId) {
      sendResponse(res, {
        httpStatusCode: status21.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = cancelParcelValidation.parse(req.body);
    const payload = {
      note: validatedPayload.note
    };
    const parcel = await cancelParcelService(customerId, parcelId, payload);
    sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Parcel cancelled successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/getAllParcels.controller.ts
import status22 from "http-status";
var getAllParcelsController = catchAsync(
  async (req, res) => {
    const { page, limit } = getPaginationParams(
      req.query.page ? String(req.query.page) : void 0,
      req.query.limit ? String(req.query.limit) : void 0
    );
    const statusFilter = req.query.status;
    const districtFilter = req.query.district;
    const dateFilter = req.query.date;
    const result = await getAllParcelsService(
      page,
      limit,
      statusFilter,
      districtFilter,
      dateFilter
    );
    sendResponse(res, {
      httpStatusCode: status22.OK,
      success: true,
      message: "Parcels fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/parcel/controllers/assignRider.controller.ts
import status23 from "http-status";
var assignRiderController = catchAsync(
  async (req, res) => {
    const adminId = req.user?.userId;
    const parcelId = req.params.id;
    if (!adminId) {
      sendResponse(res, {
        httpStatusCode: status23.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = assignRiderValidation.parse(req.body);
    const payload = {
      riderId: validatedPayload.riderId,
      note: validatedPayload.note
    };
    const parcel = await assignRiderService(parcelId, payload, adminId);
    sendResponse(res, {
      httpStatusCode: status23.OK,
      success: true,
      message: "Rider assigned successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/updateParcelStatus.controller.ts
import status24 from "http-status";
var updateParcelStatusController = catchAsync(
  async (req, res) => {
    const adminId = req.user?.userId;
    const parcelId = req.params.id;
    if (!adminId) {
      sendResponse(res, {
        httpStatusCode: status24.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = updateParcelStatusValidation.parse(req.body);
    const payload = {
      status: validatedPayload.status,
      note: validatedPayload.note
    };
    const parcel = await updateParcelStatusService(parcelId, payload, adminId);
    sendResponse(res, {
      httpStatusCode: status24.OK,
      success: true,
      message: "Parcel status updated successfully",
      data: parcel
    });
  }
);

// src/app/module/parcel/controllers/initiateParcelPayment.controller.ts
import status25 from "http-status";
var initiateParcelPaymentController = catchAsync(
  async (req, res) => {
    const customerId = req.user?.userId;
    const parcelId = req.params.id;
    if (!customerId) {
      sendResponse(res, {
        httpStatusCode: status25.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = parcelPaymentValidation.parse(req.body);
    const result = await parcelPayment_service_default.initiateParcelPayment(
      parcelId,
      validatedPayload.paymentMethod,
      customerId
    );
    sendResponse(res, {
      httpStatusCode: status25.OK,
      success: true,
      message: "Payment initiated successfully",
      data: result
    });
  }
);

// src/app/module/parcel/controllers/trackParcel.controller.ts
import status26 from "http-status";
var trackParcelController = catchAsync(
  async (req, res) => {
    const trackingId = req.params.trackingId;
    const parcel = await trackParcelService(trackingId);
    sendResponse(res, {
      httpStatusCode: status26.OK,
      success: true,
      message: "Parcel fetched successfully",
      data: parcel
    });
  }
);

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/middleware/checkAuth.ts
import status27 from "http-status";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  return jwt.decode(token);
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/middleware/checkAuth.ts
var checkAuth = (...authRoles) => {
  return async (req, res, next) => {
    try {
      const rawSessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
      if (!rawSessionToken) {
        throw new AppError_default(status27.UNAUTHORIZED, "Unauthorized access! no session token provided");
      }
      const sessionToken = rawSessionToken.split(".")[0];
      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: /* @__PURE__ */ new Date()
            }
          },
          include: {
            user: true
          }
        });
        if (!sessionExist || !sessionExist.user) {
          throw new AppError_default(status27.UNAUTHORIZED, "Unauthorized access! Invalid session token");
        }
        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
          const now = /* @__PURE__ */ new Date();
          const expiresAt = new Date(sessionExist.expiresAt);
          const createdAt = new Date(sessionExist.createdAt);
          const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
          const timeLeft = expiresAt.getTime() - now.getTime();
          const timeLeftPercent = timeLeft / sessionLifetime * 100;
          if (timeLeftPercent <= 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Left", timeLeft.toString());
            console.log("Session token is about to expire.");
          }
          if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
            throw new AppError_default(status27.FORBIDDEN, `Your account has been ${user.status === UserStatus.BLOCKED ? "blocked" : "deleted"}. Please contact support.`);
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            console.log("User role:", user.role, "Required roles:", authRoles);
            throw new AppError_default(status27.FORBIDDEN, "You are not authorized to access this resource");
          }
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role
          };
        }
      }
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError_default(status27.UNAUTHORIZED, "Unauthorized access! no access token provided");
      }
      const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
      if (!verifiedToken.success) {
        throw new AppError_default(status27.UNAUTHORIZED, "Unauthorized access! invalid access token provided");
      }
      if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
        throw new AppError_default(status27.UNAUTHORIZED, "Forbidden access! you do not have permission to access this route");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body && req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const bodyToValidate = req.body || {};
    const parsedResult = zodSchema.safeParse(bodyToValidate);
    if (!parsedResult.success) {
      console.log("Zod validation error", parsedResult.error);
      next(parsedResult.error);
      return;
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/parcel/parcel.route.ts
var router = Router();
router.post(
  "/",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(createParcelValidation),
  createParcelController
);
router.get(
  "/my",
  checkAuth(UserRole.CUSTOMER),
  getMyParcelsController
);
router.get(
  "/available",
  checkAuth(UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getAvailableParcelsController
);
router.get(
  "/assigned",
  checkAuth(UserRole.RIDER),
  getAssignedParcelsController
);
router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getAllParcelsController
);
router.patch(
  "/:id/cancel",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(cancelParcelValidation),
  cancelParcelController
);
router.post(
  "/:id/payment",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(parcelPaymentValidation),
  initiateParcelPaymentController
);
router.patch(
  "/:id/assign-rider",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(assignRiderValidation),
  assignRiderController
);
router.patch(
  "/:id/status",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateParcelStatusValidation),
  updateParcelStatusController
);
router.patch(
  "/:id/pick",
  checkAuth(UserRole.RIDER),
  validateRequest(pickParcelValidation),
  pickParcelController
);
router.patch(
  "/:id/deliver",
  checkAuth(UserRole.RIDER),
  validateRequest(deliverParcelValidation),
  deliverParcelController
);
router.patch(
  "/:id/accept",
  checkAuth(UserRole.RIDER),
  validateRequest(acceptParcelValidation),
  acceptParcelController
);
router.get(
  "/track/:trackingId",
  trackParcelController
);
router.get(
  "/:id",
  checkAuth(UserRole.CUSTOMER, UserRole.RIDER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getParcelByIdController
);
var ParcelRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1e3
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/controllers/auth.register.controller.ts
import status30 from "http-status";

// src/app/module/auth/services/auth.register.service.ts
import status29 from "http-status";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status28 from "http-status";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  }
});
var buildEmailHtml = ({ title, name, otp, subtitle, otpLabel, note, warning }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden; }
    .header { background-color: #4d7c0f; padding: 32px 20px; text-align: center; border-bottom: 3px solid #3a5a09; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
    .header .logo { font-size: 18px; font-weight: 800; color: #d9f99d; margin-bottom: 6px; }
    .content { padding: 40px 32px; text-align: center; }
    .greeting { font-size: 16px; color: #444; margin: 0 0 8px 0; }
    .subtitle { font-size: 14px; color: #777; margin: 0 0 32px 0; }
    .otp-label { font-size: 12px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .otp-box { background-color: #f7fee7; border: 2px solid #a3e635; border-radius: 8px; padding: 20px 32px; margin: 0 auto 32px auto; display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #3f6212; font-family: 'Courier New', monospace; }
    .note { font-size: 13px; color: #777; margin: 0 0 12px 0; }
    .warning { background-color: #fefce8; border: 1px solid #fde047; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #713f12; margin-top: 24px; text-align: left; }
    .footer { background-color: #fafafa; padding: 20px 32px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NexDrop</div>
      <h1>${title}</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello, <strong>${name}</strong></p>
      <p class="subtitle">${subtitle}</p>
      <div class="otp-label">${otpLabel}</div>
      <div class="otp-box">${otp}</div>
      <p class="note">${note}</p>
      <div class="warning"><strong>Important:</strong> ${warning}</div>
    </div>
    <div class="footer">
      <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} NexDrop. All rights reserved.</p>
      <p>This is an automated email &mdash; please do not reply.</p>
    </div>
  </div>
</body>
</html>`;
var templates = {
  "otp": (data) => buildEmailHtml({
    title: "Email Verification",
    name: data.name,
    otp: data.otp,
    subtitle: "Use the code below to verify your email address.",
    otpLabel: "Your verification code",
    note: "Enter this code on the verification page to complete your registration.",
    warning: "This code expires in 3 minutes. Never share it with anyone. If you did not request this, you can safely ignore this email."
  }),
  "password-reset-otp": (data) => buildEmailHtml({
    title: "Password Reset OTP",
    name: data.name,
    otp: data.otp,
    subtitle: "We received a request to reset your password. Use the code below to proceed.",
    otpLabel: "Your reset code",
    note: "Enter this code on the password reset page along with your new password.",
    warning: "This code expires in 3 minutes. If you did not request a password reset, ignore this email \u2014 your account will remain unchanged. Never share this code with anyone."
  })
};
var sendEmail = async ({ subject, templateName, templateData, to }) => {
  try {
    const renderTemplate = templates[templateName];
    if (!renderTemplate) {
      throw new Error(`Unknown email template: "${templateName}"`);
    }
    const html = renderTemplate(templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw new AppError_default(status28.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  trustedOrigins: [
    envVars.FRONTEND_URL,
    envVars.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000",
    "https://nex-drop-client.vercel.app"
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
          emailVerified: true
        };
      }
    }
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false
      },
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.log(`User with email ${email} not found`);
            return;
          }
          if (user && user.role === UserRole.SUPER_ADMIN) {
            console.log(`User with the email ${email} is a super admin, Skipping email verification`);
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email - Nex Drop",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            }).catch((err) => console.error("Failed to send verification email:", err));
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user && !user.emailVerified) {
            console.log(`User with email ${email} is not verified, Skipping sending password reset OTP`);
            return;
          }
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP - Nex Drop",
              templateName: "password-reset-otp",
              templateData: {
                name: user.name,
                otp
              }
            }).catch((err) => console.error("Failed to send password reset email:", err));
          }
        }
      },
      expiresIn: 3 * 60,
      // 3 minutes
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    // 7 days
    updateAge: 24 * 60 * 60,
    // extend session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // cache session data for 5 minutes
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: true,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionData: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/module/auth/services/auth.register.service.ts
var registerService = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError_default(status29.CONFLICT, "User already exists. Use another email.");
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status29.BAD_REQUEST, "Failed to register user");
  }
  await updateStatsCache({
    totalUsers: { increment: 1 },
    totalCustomers: { increment: 1 },
    newUsersToday: { increment: 1 },
    newUsersThisWeek: { increment: 1 },
    newUsersThisMonth: { increment: 1 }
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken
  };
};
var auth_register_service_default = registerService;

// src/app/module/auth/controllers/auth.register.controller.ts
var registerController = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await auth_register_service_default(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status30.CREATED,
      success: true,
      message: "User registered successfully",
      data: {
        ...rest,
        token,
        accessToken,
        refreshToken
      }
    });
  }
);

// src/app/module/auth/controllers/auth.login.controller.ts
import status38 from "http-status";

// src/app/module/auth/services/auth.login.service.ts
import status31 from "http-status";
var loginService = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data?.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status31.FORBIDDEN, "Your account has been blocked. Please contact support.");
  }
  if (data?.user?.status === UserStatus.DELETED) {
    throw new AppError_default(status31.GONE, "Your account has been deleted. Please contact support.");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};

// src/app/module/auth/services/auth.me.service.ts
var getMeService = async (id) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!isUserExist) {
    throw new Error("User not found");
  }
  return isUserExist;
};

// src/app/module/auth/services/auth.get-new-token.service.ts
import status32 from "http-status";
var getNewTokenService = async (refreshToken, sessionToken) => {
  const isSessionExist = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionExist || !isSessionExist.user) {
    throw new AppError_default(status32.UNAUTHORIZED, "Unauthorized access! Invalid session token");
  }
  const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifyRefreshToken.success && verifyRefreshToken.error) {
    throw new AppError_default(status32.UNAUTHORIZED, "Unauthorized access! Invalid refresh token");
  }
  const data = verifyRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
      // 7 days
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    sessionToken: token,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

// src/app/module/auth/services/auth.change-password.service.ts
import status33 from "http-status";
var changePasswordService = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status33.UNAUTHORIZED, "Unauthorized access! Invalid session token");
  }
  const isGoogleAuthenticatedUser = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "google"
    }
  });
  if (isGoogleAuthenticatedUser) {
    throw new AppError_default(status33.BAD_REQUEST, "Google authenticated users can not change password");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};

// src/app/module/auth/services/auth.logout.service.ts
var logoutService = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};

// src/app/module/auth/services/auth.verify-email.service.ts
import status34 from "http-status";
var verifyEmailService = async (email, otp) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status34.NOT_FOUND, "User not found");
  }
  const isGoogleAuthenticatedUser = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "google"
    }
  });
  if (isGoogleAuthenticatedUser) {
    throw new AppError_default(status34.BAD_REQUEST, "Google authenticated users can not verify email");
  }
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};

// src/app/module/auth/services/auth.forget-password.service.ts
import status35 from "http-status";
var forgetPasswordService = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status35.NOT_FOUND, "User not found");
  }
  const isGoogleAuthenticatedUser = await prisma.account.findFirst({
    where: {
      userId: isUserExist.id,
      providerId: "google"
    }
  });
  if (isGoogleAuthenticatedUser) {
    throw new AppError_default(status35.BAD_REQUEST, "Google authenticated users can not reset password");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status35.BAD_REQUEST, "Email is not verified");
  }
  if (isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status35.BAD_REQUEST, "User is deleted");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};

// src/app/module/auth/services/auth.reset-password.service.ts
import status36 from "http-status";
var resetPasswordService = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status36.NOT_FOUND, "User not found");
  }
  const isGoogleAuthenticatedUser = await prisma.account.findFirst({
    where: {
      userId: isUserExist.id,
      providerId: "google"
    }
  });
  if (isGoogleAuthenticatedUser) {
    throw new AppError_default(status36.BAD_REQUEST, "Google authenticated users can not reset password");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status36.BAD_REQUEST, "Email is not verified");
  }
  if (isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status36.BAD_REQUEST, "User is deleted");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};

// src/app/module/auth/services/auth.google-login.service.ts
var googleLoginService = async (session) => {
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role
  });
  return {
    accessToken,
    refreshToken
  };
};

// src/app/module/auth/services/auth.resend-otp.service.ts
import status37 from "http-status";
var resendOtpService = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status37.NOT_FOUND, "User not found");
  }
  const isGoogleAuthenticatedUser = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "google"
    }
  });
  if (isGoogleAuthenticatedUser) {
    throw new AppError_default(status37.BAD_REQUEST, "Google authenticated users do not require email verification");
  }
  if (user.emailVerified) {
    throw new AppError_default(status37.BAD_REQUEST, "Email is already verified");
  }
  if (user.status === UserStatus.DELETED) {
    throw new AppError_default(status37.BAD_REQUEST, "User is deleted");
  }
  await auth.api.sendVerificationOTP({
    body: {
      email,
      type: "email-verification"
    }
  });
};

// src/app/module/auth/controllers/auth.login.controller.ts
var loginController = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await loginService(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status38.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        ...rest,
        token,
        accessToken,
        refreshToken
      }
    });
  }
);

// src/app/module/auth/controllers/auth.me.controller.ts
import status39 from "http-status";
var getMeController = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await getMeService(user.userId);
    sendResponse(res, {
      httpStatusCode: status39.OK,
      success: true,
      message: "User fetched successfully",
      data: result
    });
  }
);

// src/app/module/auth/controllers/auth.get-new-token.controller.ts
import status40 from "http-status";
var getNewTokenController = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    console.log({
      refreshToken,
      betterAuthSessionToken
    });
    if (!refreshToken && !betterAuthSessionToken) {
      throw new AppError_default(status40.UNAUTHORIZED, "Unauthorized access! no refresh token provided");
    }
    const result = await getNewTokenService(refreshToken, betterAuthSessionToken);
    const {
      sessionToken,
      accessToken,
      refreshToken: newRefreshToken
    } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status40.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);

// src/app/module/auth/controllers/auth.change-password.controller.ts
import status41 from "http-status";
var changePasswordController = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await changePasswordService(payload, betterAuthSessionToken);
    const {
      accessToken,
      refreshToken,
      token
    } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status41.OK,
      success: true,
      message: "Password changed successfully",
      data: result
    });
  }
);

// src/app/module/auth/controllers/auth.logout.controller.ts
import status42 from "http-status";
var logoutController = catchAsync(
  async (req, res) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await logoutService(betterAuthSessionToken);
    cookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
      path: "/"
    });
    cookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
      path: "/"
    });
    cookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
      path: "/"
    });
    sendResponse(res, {
      httpStatusCode: status42.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);

// src/app/module/auth/controllers/auth.verify-email.controller.ts
import status43 from "http-status";
var verifyEmailController = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    await verifyEmailService(email, otp);
    sendResponse(res, {
      httpStatusCode: status43.OK,
      success: true,
      message: "Email verified successfully"
    });
  }
);

// src/app/module/auth/controllers/auth.forget-password.controller.ts
import status44 from "http-status";
var forgetPasswordController = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await forgetPasswordService(email);
    sendResponse(res, {
      httpStatusCode: status44.OK,
      success: true,
      message: "Password reset OTP sent to your email successfully"
    });
  }
);

// src/app/module/auth/controllers/auth.reset-password.controller.ts
import status45 from "http-status";
var resetPasswordController = catchAsync(
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await resetPasswordService(email, otp, newPassword);
    sendResponse(res, {
      httpStatusCode: status45.OK,
      success: true,
      message: "Password reset successfully"
    });
  }
);

// src/app/module/auth/controllers/auth.google-login.controller.ts
var googleLoginController = catchAsync(
  async (req, res) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const encodedRedirectPath = encodeURIComponent(redirectPath);
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
    res.render("googleRedirect", {
      callbackURL,
      betterAuthUrl: envVars.BETTER_AUTH_URL
    });
  }
);
var googleLoginSuccessController = catchAsync(
  async (req, res) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const oauthError = req.query.error;
    if (oauthError) {
      console.error("[Google OAuth] Better Auth callback error:", oauthError, req.query);
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=${encodeURIComponent(oauthError)}`);
    }
    const sessionToken = req.cookies["better-auth.session_token"] ?? req.cookies["__Secure-better-auth.session_token"] ?? req.headers.cookie?.split(";").find((c) => c.trim().startsWith("better-auth.session_token="))?.split("=").slice(1).join("=").trim() ?? req.headers.cookie?.split(";").find((c) => c.trim().startsWith("__Secure-better-auth.session_token="))?.split("=").slice(1).join("=").trim();
    console.log("[Google OAuth] Cookies received:", Object.keys(req.cookies));
    if (!sessionToken) {
      console.error("[Google OAuth] No session token cookie found. Available cookies:", req.cookies);
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }
    const isSecurePrefix = !!req.cookies["__Secure-better-auth.session_token"];
    const cookieName = isSecurePrefix ? "__Secure-better-auth.session_token" : "better-auth.session_token";
    const session = await auth.api.getSession({
      headers: {
        "Cookie": `${cookieName}=${sessionToken}`
      }
    });
    if (!session) {
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }
    if (session && !session?.user) {
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }
    const result = await googleLoginService(session);
    const { accessToken, refreshToken } = result;
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      redirect: finalRedirectPath
    });
    res.redirect(`${envVars.FRONTEND_URL}/api/auth/set-cookies?${params.toString()}`);
  }
);
var handleOAuthErrorController = catchAsync(
  async (req, res) => {
    const error = req.query.error || "oauth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
  }
);

// src/app/module/auth/controllers/auth.resend-otp.controller.ts
import status46 from "http-status";
var resendOtpController = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await resendOtpService(email);
    sendResponse(res, {
      httpStatusCode: status46.OK,
      success: true,
      message: "OTP sent successfully"
    });
  }
);

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", registerController);
router2.post("/login", loginController);
router2.get(
  "/me",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  getMeController
);
router2.post(
  "/refresh-token",
  getNewTokenController
);
router2.post(
  "/change-password",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  changePasswordController
);
router2.post(
  "/logout",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  logoutController
);
router2.post(
  "/verify-email",
  verifyEmailController
);
router2.post(
  "/resend-otp",
  resendOtpController
);
router2.post(
  "/forget-password",
  forgetPasswordController
);
router2.post(
  "/reset-password",
  resetPasswordController
);
router2.get("/login/google", googleLoginController);
router2.get("/google/success", googleLoginSuccessController);
router2.get("/oauth/error", handleOAuthErrorController);
var AuthRoutes = router2;

// src/app/module/user/user.route.ts
import { Router as Router3 } from "express";

// src/app/module/user/controllers/getUsers.controller.ts
import status51 from "http-status";

// src/app/module/user/services/getUsers.service.ts
var getUsersService = async (search, page = 1, limit = 10) => {
  const where = search ? {
    OR: [
      {
        email: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }
    ]
  } : {};
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  const meta = calculatePaginationMeta(page, limit, total);
  return {
    data: users,
    meta
  };
};

// src/app/module/user/services/getUserById.service.ts
import status47 from "http-status";
var getUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      phone: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError_default(status47.NOT_FOUND, "User not found");
  }
  return user;
};

// src/app/module/user/services/updateUserRole.service.ts
import status48 from "http-status";
var updateUserRoleService = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status48.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: payload.role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      phone: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};

// src/app/module/user/services/updateUserStatus.service.ts
import status49 from "http-status";
var updateUserStatusService = async (id, payload, currentUserId) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status49.NOT_FOUND, "User not found");
  }
  if (id === currentUserId && payload.status !== UserStatus.DELETED) {
    throw new AppError_default(status49.FORBIDDEN, "You cannot change your own status");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status: payload.status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      phone: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};

// src/app/module/user/services/updateMyProfile.service.ts
import status50 from "http-status";
var updateMyProfileService = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(status50.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      phone: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};

// src/app/module/user/services/userDashboard.service.ts
var getUserDashboardService = async (userId) => {
  const [
    totalParcels,
    totalSpent,
    activeParcels,
    deliveredParcels,
    todayParcels,
    thisWeekParcels,
    thisMonthParcels
  ] = await Promise.all([
    // Total parcels sent
    prisma.parcel.count({
      where: { customerId: userId }
    }),
    // Total spent (successful payments)
    prisma.payment.aggregate({
      where: {
        parcel: { customerId: userId }
      },
      _sum: { amount: true }
    }),
    // Active parcels (not delivered)
    prisma.parcel.count({
      where: {
        customerId: userId,
        status: {
          not: ParcelStatus.DELIVERED
        }
      }
    }),
    // Delivered parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        status: ParcelStatus.DELIVERED
      }
    }),
    // Today's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
        }
      }
    }),
    // This week's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
        }
      }
    }),
    // This month's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1)
        }
      }
    })
  ]);
  const customerParcels = await prisma.parcel.findMany({
    where: {
      customerId: userId,
      status: ParcelStatus.DELIVERED
    },
    include: {
      statusLogs: {
        orderBy: { timestamp: "asc" }
      }
    },
    take: 100
    // Limit to last 100 for performance
  });
  let totalDeliveryTime = 0;
  let deliveryTimeCount = 0;
  for (const parcel of customerParcels) {
    const firstLog = parcel.statusLogs[0];
    const lastLog = parcel.statusLogs[parcel.statusLogs.length - 1];
    if (firstLog && lastLog) {
      const hours = (lastLog.timestamp.getTime() - firstLog.timestamp.getTime()) / (1e3 * 60 * 60);
      totalDeliveryTime += hours;
      deliveryTimeCount++;
    }
  }
  const avgDeliveryTime = deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0;
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dayPayments = await prisma.payment.aggregate({
      where: {
        parcel: {
          customerId: userId
        },
        createdAt: {
          gte: date,
          lt: nextDate
        }
      },
      _sum: { amount: true },
      _count: true
    });
    const dayParcels = await prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: date,
          lt: nextDate
        }
      }
    });
    last7Days.push({
      date: date.toISOString().split("T")[0],
      spent: dayPayments._sum.amount || 0,
      parcels: dayParcels
    });
  }
  const statusDistribution = await prisma.parcel.groupBy({
    by: ["status"],
    where: {
      customerId: userId
    },
    _count: true
  });
  const pieChartData = statusDistribution.map((item) => ({
    status: item.status,
    count: item._count
  }));
  const overview = {
    totalParcels,
    totalSpent: totalSpent._sum.amount || 0,
    activeParcels,
    deliveredParcels,
    avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
    // Round to 1 decimal
    todayParcels,
    thisWeekParcels,
    thisMonthParcels
  };
  return {
    overview,
    barChart: {
      title: "Spending & Parcels (Last 7 Days)",
      data: last7Days
    },
    pieChart: {
      title: "Parcel Status Distribution",
      data: pieChartData
    }
  };
};

// src/app/module/user/controllers/getUsers.controller.ts
var getUsersController = catchAsync(
  async (req, res) => {
    const { search, page, limit } = req.query;
    const { page: pageNum, limit: limitNum } = getPaginationParams(page, limit);
    const result = await getUsersService(search, pageNum, limitNum);
    sendResponse(res, {
      httpStatusCode: status51.OK,
      success: true,
      message: "Users fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/user/controllers/getUserById.controller.ts
import status52 from "http-status";
var getUserByIdController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await getUserByIdService(id);
    sendResponse(res, {
      httpStatusCode: status52.OK,
      success: true,
      message: "User fetched successfully",
      data: result
    });
  }
);

// src/app/module/user/controllers/updateUserRole.controller.ts
import status53 from "http-status";
var updateUserRoleController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateUserRoleService(id, payload);
    sendResponse(res, {
      httpStatusCode: status53.OK,
      success: true,
      message: "User role updated successfully",
      data: result
    });
  }
);

// src/app/module/user/controllers/updateUserStatus.controller.ts
import status54 from "http-status";
var updateUserStatusController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const user = req.user;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await updateUserStatusService(id, payload, user.userId);
    sendResponse(res, {
      httpStatusCode: status54.OK,
      success: true,
      message: "User status updated successfully",
      data: result
    });
  }
);

// src/app/module/user/controllers/updateMyProfile.controller.ts
import status55 from "http-status";
var updateMyProfileController = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await updateMyProfileService(user.userId, payload);
    sendResponse(res, {
      httpStatusCode: status55.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);

// src/app/module/user/controllers/userDashboard.controller.ts
import status56 from "http-status";
var getUserDashboardController = catchAsync(async (req, res) => {
  const dashboardData = await getUserDashboardService(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status56.OK,
    success: true,
    message: "User dashboard fetched successfully",
    data: dashboardData
  });
});

// src/app/module/user/validations/user.validation.ts
import { z as z2 } from "zod";
var updateUserRoleValidation = z2.object({
  role: z2.nativeEnum(UserRole)
});
var updateUserStatusValidation = z2.object({
  status: z2.nativeEnum(UserStatus)
});
var updateMyProfileValidation = z2.object({
  name: z2.string().min(1).max(255).optional(),
  phone: z2.string().optional()
}).refine((data) => data.name || data.phone, {
  message: "At least one field (name or phone) must be provided"
});

// src/app/module/user/user.route.ts
var router3 = Router3();
router3.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getUsersController
);
router3.get(
  "/dashboard",
  checkAuth(UserRole.CUSTOMER),
  getUserDashboardController
);
router3.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getUserByIdController
);
router3.patch(
  "/:id/role",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(updateUserRoleValidation),
  updateUserRoleController
);
router3.patch(
  "/:id/status",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateUserStatusValidation),
  updateUserStatusController
);
router3.patch(
  "/me",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  validateRequest(updateMyProfileValidation),
  updateMyProfileController
);
var UserRoutes = router3;

// src/app/module/address/address.route.ts
import { Router as Router4 } from "express";

// src/app/module/address/controllers/getAddresses.controller.ts
import status60 from "http-status";

// src/app/module/address/services/getAddresses.service.ts
var getAddressesService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [addresses, total] = await Promise.all([
    prisma.userAddress.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit
    }),
    prisma.userAddress.count({ where: { userId } })
  ]);
  const meta = calculatePaginationMeta(page, limit, total);
  return {
    data: addresses,
    meta
  };
};

// src/app/module/address/services/createAddress.service.ts
var createAddressService = async (userId, payload) => {
  if (payload.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }
  const address = await prisma.userAddress.create({
    data: {
      ...payload,
      userId
    }
  });
  return address;
};

// src/app/module/address/services/updateAddress.service.ts
import status57 from "http-status";
var updateAddressService = async (id, userId, payload) => {
  const address = await prisma.userAddress.findUnique({
    where: { id }
  });
  if (!address) {
    throw new AppError_default(status57.NOT_FOUND, "Address not found");
  }
  if (address.userId !== userId) {
    throw new AppError_default(status57.FORBIDDEN, "You can only update your own addresses");
  }
  if (payload.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }
  const updatedAddress = await prisma.userAddress.update({
    where: { id },
    data: payload
  });
  return updatedAddress;
};

// src/app/module/address/services/deleteAddress.service.ts
import status58 from "http-status";
var deleteAddressService = async (id, userId) => {
  const address = await prisma.userAddress.findUnique({
    where: { id }
  });
  if (!address) {
    throw new AppError_default(status58.NOT_FOUND, "Address not found");
  }
  if (address.userId !== userId) {
    throw new AppError_default(status58.FORBIDDEN, "You can only delete your own addresses");
  }
  await prisma.userAddress.delete({
    where: { id }
  });
  return { message: "Address deleted successfully" };
};

// src/app/module/address/services/setDefaultAddress.service.ts
import status59 from "http-status";
var setDefaultAddressService = async (id, userId) => {
  const address = await prisma.userAddress.findUnique({
    where: { id }
  });
  if (!address) {
    throw new AppError_default(status59.NOT_FOUND, "Address not found");
  }
  if (address.userId !== userId) {
    throw new AppError_default(status59.FORBIDDEN, "You can only set your own addresses as default");
  }
  await prisma.userAddress.updateMany({
    where: { userId },
    data: { isDefault: false }
  });
  const updatedAddress = await prisma.userAddress.update({
    where: { id },
    data: { isDefault: true }
  });
  return updatedAddress;
};

// src/app/module/address/controllers/getAddresses.controller.ts
var getAddressesController = catchAsync(
  async (req, res) => {
    const user = req.user;
    const { page, limit } = req.query;
    if (!user) {
      throw new Error("Request User not found");
    }
    const { page: pageNum, limit: limitNum } = getPaginationParams(page, limit);
    const result = await getAddressesService(user.userId, pageNum, limitNum);
    sendResponse(res, {
      httpStatusCode: status60.OK,
      success: true,
      message: "Addresses fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);

// src/app/module/address/controllers/createAddress.controller.ts
import status61 from "http-status";
var createAddressController = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await createAddressService(user.userId, payload);
    sendResponse(res, {
      httpStatusCode: status61.CREATED,
      success: true,
      message: "Address created successfully",
      data: result
    });
  }
);

// src/app/module/address/controllers/updateAddress.controller.ts
import status62 from "http-status";
var updateAddressController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const payload = req.body;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await updateAddressService(id, user.userId, payload);
    sendResponse(res, {
      httpStatusCode: status62.OK,
      success: true,
      message: "Address updated successfully",
      data: result
    });
  }
);

// src/app/module/address/controllers/deleteAddress.controller.ts
import status63 from "http-status";
var deleteAddressController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await deleteAddressService(id, user.userId);
    sendResponse(res, {
      httpStatusCode: status63.OK,
      success: true,
      message: "Address deleted successfully",
      data: result
    });
  }
);

// src/app/module/address/controllers/setDefaultAddress.controller.ts
import status64 from "http-status";
var setDefaultAddressController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      throw new Error("Request User not found");
    }
    const result = await setDefaultAddressService(id, user.userId);
    sendResponse(res, {
      httpStatusCode: status64.OK,
      success: true,
      message: "Default address set successfully",
      data: result
    });
  }
);

// src/app/module/address/validations/address.validation.ts
import { z as z3 } from "zod";
var createAddressValidation = z3.object({
  label: z3.string().min(1).max(255),
  address: z3.string().min(1).max(500),
  district: z3.string().min(1).max(255),
  phone: z3.string().optional(),
  isDefault: z3.boolean().optional()
});
var updateAddressValidation = z3.object({
  label: z3.string().min(1).max(255).optional(),
  address: z3.string().min(1).max(500).optional(),
  district: z3.string().min(1).max(255).optional(),
  phone: z3.string().optional(),
  isDefault: z3.boolean().optional()
}).refine((data) => data.label || data.address || data.district || data.phone || data.isDefault !== void 0, {
  message: "At least one field must be provided"
});

// src/app/module/address/address.route.ts
var router4 = Router4();
router4.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  getAddressesController
);
router4.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  validateRequest(createAddressValidation),
  createAddressController
);
router4.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  validateRequest(updateAddressValidation),
  updateAddressController
);
router4.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  deleteAddressController
);
router4.patch(
  "/:id/default",
  checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  setDefaultAddressController
);
var AddressRoutes = router4;

// src/app/module/rider/rider.route.ts
import { Router as Router5 } from "express";

// src/app/module/rider/controllers/getRiderMe.controller.ts
import status68 from "http-status";

// src/app/module/rider/services/getRiderMe.service.ts
import status65 from "http-status";
var getRiderMeService = async (userId) => {
  const rider = await prisma.rider.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  });
  if (!rider) {
    throw new AppError_default(status65.NOT_FOUND, "Rider profile not found");
  }
  return rider;
};

// src/app/module/rider/services/riderApply.service.ts
import status66 from "http-status";
var riderApplyService = async (userId, payload) => {
  if (userId) {
    const riderProfile = await prisma.rider.create({
      data: {
        userId,
        district: payload.district,
        accountStatus: RiderAccountStatus.PENDING,
        currentStatus: RiderStatus.AVAILABLE
      }
    });
    await updateStatsCache({
      totalRiders: { increment: 1 }
    });
    return {
      rider: riderProfile
    };
  }
  const unauthenticatedPayload = payload;
  const { name, email, password, district } = unauthenticatedPayload;
  let createdUserId = null;
  try {
    const authData = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      }
    });
    if (!authData.user) {
      throw new AppError_default(status66.BAD_REQUEST, "Failed to register user");
    }
    createdUserId = authData.user.id;
    const riderProfile = await prisma.rider.create({
      data: {
        userId: authData.user.id,
        district,
        accountStatus: RiderAccountStatus.PENDING,
        currentStatus: RiderStatus.AVAILABLE
      }
    });
    await updateStatsCache({
      totalUsers: { increment: 1 },
      totalRiders: { increment: 1 },
      newUsersToday: { increment: 1 },
      newUsersThisWeek: { increment: 1 },
      newUsersThisMonth: { increment: 1 }
    });
    return {
      user: {
        id: authData.user.id,
        name: authData.user.name,
        email: authData.user.email,
        role: authData.user.role,
        status: authData.user.status
      },
      rider: riderProfile
    };
  } catch (error) {
    if (createdUserId) {
      try {
        await prisma.user.delete({
          where: { id: createdUserId }
        });
      } catch {
      }
    }
    throw error;
  }
};

// src/app/module/rider/services/riderEarnings.service.ts
var getCurrentEarningsService = async (userId) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new Error("Rider profile not found");
  }
  const totalAvailable = await prisma.earning.aggregate({
    where: {
      riderId: rider.id,
      status: EarningStatus.PENDING
    },
    _sum: {
      amount: true
    }
  });
  const recentEarnings = await prisma.earning.findMany({
    where: {
      riderId: rider.id,
      status: EarningStatus.PENDING
    },
    include: {
      parcel: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  });
  return {
    totalAvailable: totalAvailable._sum.amount || 0,
    recentEarnings
  };
};
var getEarningsHistoryService = async (userId, query) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new Error("Rider profile not found");
  }
  const { page, limit, skip } = paginationHelper(query);
  const where = {
    riderId: rider.id
  };
  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }
  if (query.startDate || query.endDate) {
    const dateFilter = {};
    if (query.startDate) {
      dateFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      dateFilter.lte = new Date(query.endDate);
    }
    where.createdAt = dateFilter;
  }
  if (query.search) {
    where.parcel = {
      trackingId: {
        contains: query.search,
        mode: "insensitive"
      }
    };
  }
  const orderBy = {};
  if (query.sortBy) {
    orderBy[query.sortBy] = query.sortOrder === "asc" ? "asc" : "desc";
  } else {
    orderBy.createdAt = "desc";
  }
  const [earnings, total] = await Promise.all([
    prisma.earning.findMany({
      where,
      include: {
        parcel: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.earning.count({ where })
  ]);
  const totalAmount = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  return {
    earnings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      totalAmount
    }
  };
};

// src/app/module/rider/services/updateRiderStatus.service.ts
import status67 from "http-status";
var updateRiderStatusService = async (userId, payload) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new AppError_default(status67.NOT_FOUND, "Rider profile not found");
  }
  if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
    throw new AppError_default(status67.FORBIDDEN, "Only active riders can update their status");
  }
  const updatedRider = await prisma.rider.update({
    where: { userId },
    data: {
      currentStatus: payload.currentStatus
    }
  });
  return updatedRider;
};

// src/app/module/rider/services/cashout.service.ts
var requestCashoutService = async (userId, amount) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new Error("Rider profile not found");
  }
  const totalAvailable = await prisma.earning.aggregate({
    where: {
      riderId: rider.id,
      status: EarningStatus.PENDING
    },
    _sum: {
      amount: true
    }
  });
  const availableAmount = totalAvailable._sum.amount || 0;
  if (amount > availableAmount) {
    throw new Error(`Insufficient balance. Available: ${availableAmount}, Requested: ${amount}`);
  }
  const cashout = await prisma.cashout.create({
    data: {
      riderId: rider.id,
      amount,
      status: CashoutStatus.PENDING
    }
  });
  await updateStatsCache({
    pendingPayouts: { increment: amount }
  });
  return cashout;
};
var getMyCashoutsService = async (userId, query) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new Error("Rider profile not found");
  }
  const { page, limit, skip } = paginationHelper(query);
  const where = {
    riderId: rider.id
  };
  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }
  if (query.startDate || query.endDate) {
    const dateFilter = {};
    if (query.startDate) {
      dateFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      dateFilter.lte = new Date(query.endDate);
    }
    where.requestedAt = dateFilter;
  }
  const [cashouts, total] = await Promise.all([
    prisma.cashout.findMany({
      where,
      orderBy: {
        requestedAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.cashout.count({ where })
  ]);
  return {
    cashouts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllCashoutsService = async (query) => {
  const { page, limit, skip } = paginationHelper(query);
  const where = {};
  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }
  if (query.startDate || query.endDate) {
    const dateFilter = {};
    if (query.startDate) {
      dateFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      dateFilter.lte = new Date(query.endDate);
    }
    where.requestedAt = dateFilter;
  }
  const [cashouts, total] = await Promise.all([
    prisma.cashout.findMany({
      where,
      include: {
        rider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        requestedAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.cashout.count({ where })
  ]);
  return {
    cashouts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updateCashoutStatusService = async (cashoutId, status85) => {
  const cashout = await prisma.cashout.findUnique({
    where: { id: cashoutId }
  });
  if (!cashout) {
    throw new Error("Cashout not found");
  }
  const validTransitions = {
    [CashoutStatus.PENDING]: [CashoutStatus.APPROVED, CashoutStatus.REJECTED],
    [CashoutStatus.REJECTED]: [CashoutStatus.APPROVED],
    // Can reverse rejection
    [CashoutStatus.APPROVED]: [CashoutStatus.PAID],
    // Can mark as paid after processing
    [CashoutStatus.PAID]: []
    // No further transitions allowed
  };
  const allowedTransitions = validTransitions[cashout.status];
  if (!allowedTransitions || !allowedTransitions.includes(status85)) {
    throw new Error(`Invalid status transition from ${cashout.status} to ${status85}`);
  }
  const updatedCashout = await prisma.cashout.update({
    where: { id: cashoutId },
    data: {
      status: status85,
      processedAt: /* @__PURE__ */ new Date()
    }
  });
  if (status85 === CashoutStatus.PAID) {
    await updateStatsCache({
      riderPayouts: { increment: updatedCashout.amount },
      pendingPayouts: { decrement: updatedCashout.amount }
    });
  } else if (status85 === CashoutStatus.APPROVED) {
  } else if (status85 === CashoutStatus.REJECTED) {
    await updateStatsCache({
      pendingPayouts: { decrement: updatedCashout.amount }
    });
  }
  if (status85 === CashoutStatus.APPROVED) {
    const totalAmount = updatedCashout.amount;
    const pendingEarnings = await prisma.earning.findMany({
      where: {
        riderId: cashout.riderId,
        status: EarningStatus.PENDING
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    let remainingAmount = totalAmount;
    const earningsToUpdate = [];
    for (const earning of pendingEarnings) {
      if (remainingAmount <= 0) break;
      earningsToUpdate.push(earning.id);
      remainingAmount -= earning.amount;
    }
    if (earningsToUpdate.length > 0) {
      await prisma.earning.updateMany({
        where: {
          id: { in: earningsToUpdate }
        },
        data: {
          status: EarningStatus.PAID
        }
      });
    }
  }
  return updatedCashout;
};

// src/app/module/rider/services/riderDashboard.service.ts
var getRiderDashboardService = async (userId) => {
  const rider = await prisma.rider.findUnique({
    where: { userId }
  });
  if (!rider) {
    throw new Error("Rider profile not found");
  }
  const [
    totalDeliveries,
    totalEarnings,
    availableEarnings,
    todayDeliveries,
    thisWeekDeliveries,
    thisMonthDeliveries
  ] = await Promise.all([
    // Total completed deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED
      }
    }),
    // Total earnings (paid + pending)
    prisma.earning.aggregate({
      where: { riderId: rider.id },
      _sum: { amount: true }
    }),
    // Available earnings (pending only)
    prisma.earning.aggregate({
      where: {
        riderId: rider.id,
        status: EarningStatus.PENDING
      },
      _sum: { amount: true }
    }),
    // Today's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
        }
      }
    }),
    // This week's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
        }
      }
    }),
    // This month's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1)
        }
      }
    })
  ]);
  const deliveredParcels = await prisma.parcel.findMany({
    where: {
      riderId: rider.id,
      status: ParcelStatus.DELIVERED
    },
    include: {
      statusLogs: {
        orderBy: { timestamp: "asc" }
      }
    },
    take: 100
    // Limit to last 100 for performance
  });
  let totalDeliveryTime = 0;
  let deliveryTimeCount = 0;
  for (const parcel of deliveredParcels) {
    const firstLog = parcel.statusLogs[0];
    const lastLog = parcel.statusLogs[parcel.statusLogs.length - 1];
    if (firstLog && lastLog) {
      const hours = (lastLog.timestamp.getTime() - firstLog.timestamp.getTime()) / (1e3 * 60 * 60);
      totalDeliveryTime += hours;
      deliveryTimeCount++;
    }
  }
  const avgDeliveryTime = deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0;
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dayEarnings = await prisma.earning.aggregate({
      where: {
        riderId: rider.id,
        createdAt: {
          gte: date,
          lt: nextDate
        }
      },
      _sum: { amount: true },
      _count: true
    });
    last7Days.push({
      date: date.toISOString().split("T")[0],
      earnings: dayEarnings._sum.amount || 0,
      deliveries: dayEarnings._count
    });
  }
  const statusDistribution = await prisma.parcel.groupBy({
    by: ["status"],
    where: {
      riderId: rider.id
    },
    _count: true
  });
  const pieChartData = statusDistribution.map((item) => ({
    status: item.status,
    count: item._count
  }));
  const overview = {
    totalDeliveries,
    totalEarnings: totalEarnings._sum.amount || 0,
    availableEarnings: availableEarnings._sum.amount || 0,
    rating: rider.rating,
    totalRatings: rider.totalRatings,
    avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
    // Round to 1 decimal
    todayDeliveries,
    thisWeekDeliveries,
    thisMonthDeliveries
  };
  return {
    overview,
    barChart: {
      title: "Earnings & Deliveries (Last 7 Days)",
      data: last7Days
    },
    pieChart: {
      title: "Delivery Status Distribution",
      data: pieChartData
    }
  };
};

// src/app/module/rider/controllers/getRiderMe.controller.ts
var getRiderMeController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status68.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const rider = await getRiderMeService(userId);
    sendResponse(res, {
      httpStatusCode: status68.OK,
      success: true,
      message: "Rider profile fetched successfully",
      data: rider
    });
  }
);

// src/app/module/rider/controllers/riderApply.controller.ts
import status69 from "http-status";

// src/app/module/rider/validations/rider.validation.ts
import { z as z4 } from "zod";
var applyRiderAuthenticatedValidation = z4.object({
  district: z4.string().min(1, "District is required").max(255, "District must be at most 255 characters")
});
var applyRiderUnauthenticatedValidation = z4.object({
  name: z4.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  email: z4.string().email("Invalid email format"),
  password: z4.string().min(8, "Password must be at least 8 characters"),
  district: z4.string().min(1, "District is required").max(255, "District must be at most 255 characters")
});
var updateRiderStatusValidation = z4.object({
  currentStatus: z4.nativeEnum(RiderStatus)
});

// src/app/module/rider/validations/cashout.validation.ts
import { z as z5 } from "zod";
var requestCashoutValidation = z5.object({
  amount: z5.number().min(1, "Amount must be at least 1").max(1e5, "Amount cannot exceed 100000")
});
var getCashoutsValidation = z5.object({
  query: z5.object({
    page: z5.string().optional(),
    limit: z5.string().optional(),
    status: z5.enum(["PENDING", "APPROVED", "REJECTED", "PAID", "ALL"]).optional(),
    startDate: z5.string().optional(),
    endDate: z5.string().optional()
  })
});
var updateCashoutStatusValidation = z5.object({
  status: z5.enum(["APPROVED", "REJECTED"])
});

// src/app/module/rider/controllers/riderApply.controller.ts
var riderApplyController = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const userId = user?.userId;
    if (user) {
      if (user.role !== UserRole.CUSTOMER) {
        sendResponse(res, {
          httpStatusCode: status69.FORBIDDEN,
          success: false,
          message: "Only customers can apply for rider role"
        });
        return;
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { riderProfile: true }
      });
      if (!dbUser) {
        sendResponse(res, {
          httpStatusCode: status69.NOT_FOUND,
          success: false,
          message: "User not found"
        });
        return;
      }
      if (dbUser.riderProfile) {
        sendResponse(res, {
          httpStatusCode: status69.CONFLICT,
          success: false,
          message: "You already have a rider profile"
        });
        return;
      }
      const validatedPayload = applyRiderAuthenticatedValidation.parse({
        district: payload.district
      });
      const authenticatedPayload = {
        district: validatedPayload.district
      };
      const result = await riderApplyService(userId, authenticatedPayload);
      sendResponse(res, {
        httpStatusCode: status69.CREATED,
        success: true,
        message: "Rider application submitted successfully. Your profile is under review.",
        data: result
      });
    } else {
      const validatedPayload = applyRiderUnauthenticatedValidation.parse(payload);
      const unauthenticatedPayload = {
        name: validatedPayload.name,
        email: validatedPayload.email,
        password: validatedPayload.password,
        district: validatedPayload.district
      };
      const result = await riderApplyService(void 0, unauthenticatedPayload);
      sendResponse(res, {
        httpStatusCode: status69.CREATED,
        success: true,
        message: "User profile created and rider application submitted successfully. Please check your email to verify your account.",
        data: result
      });
    }
  }
);

// src/app/module/rider/controllers/riderEarnings.controller.ts
import status70 from "http-status";
var getCurrentEarningsController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status70.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const result = await getCurrentEarningsService(userId);
    sendResponse(res, {
      httpStatusCode: status70.OK,
      success: true,
      message: "Current earnings fetched successfully",
      data: result
    });
  }
);
var getEarningsHistoryController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status70.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const result = await getEarningsHistoryService(userId, req.query);
    sendResponse(res, {
      httpStatusCode: status70.OK,
      success: true,
      message: "Earnings history fetched successfully",
      data: result.earnings,
      meta: result.meta
    });
  }
);

// src/app/module/rider/controllers/updateRiderStatus.controller.ts
import status71 from "http-status";
var updateRiderStatusController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status71.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const validatedPayload = updateRiderStatusValidation.parse(req.body);
    const payload = {
      currentStatus: validatedPayload.currentStatus
    };
    const rider = await updateRiderStatusService(userId, payload);
    sendResponse(res, {
      httpStatusCode: status71.OK,
      success: true,
      message: "Rider status updated successfully",
      data: rider
    });
  }
);

// src/app/module/rider/controllers/cashout.controller.ts
import status72 from "http-status";
var requestCashoutController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status72.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const { amount } = req.body;
    const result = await requestCashoutService(userId, amount);
    sendResponse(res, {
      httpStatusCode: status72.CREATED,
      success: true,
      message: "Cashout request submitted successfully",
      data: result
    });
  }
);
var getMyCashoutsController = catchAsync(
  async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendResponse(res, {
        httpStatusCode: status72.UNAUTHORIZED,
        success: false,
        message: "Unauthorized access"
      });
      return;
    }
    const result = await getMyCashoutsService(userId, req.query);
    sendResponse(res, {
      httpStatusCode: status72.OK,
      success: true,
      message: "Cashouts fetched successfully",
      data: result.cashouts,
      meta: result.meta
    });
  }
);
var getAllCashoutsController = catchAsync(
  async (req, res) => {
    const result = await getAllCashoutsService(req.query);
    sendResponse(res, {
      httpStatusCode: status72.OK,
      success: true,
      message: "All cashouts fetched successfully",
      data: result.cashouts,
      meta: result.meta
    });
  }
);
var updateCashoutStatusController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { status: cashoutStatus } = req.body;
    const result = await updateCashoutStatusService(id, cashoutStatus);
    sendResponse(res, {
      httpStatusCode: status72.OK,
      success: true,
      message: `Cashout ${cashoutStatus.toLowerCase()} successfully`,
      data: result
    });
  }
);

// src/app/module/rider/controllers/riderDashboard.controller.ts
import status73 from "http-status";
var getRiderDashboardController = catchAsync(async (req, res) => {
  const dashboardData = await getRiderDashboardService(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status73.OK,
    success: true,
    message: "Rider dashboard fetched successfully",
    data: dashboardData
  });
});

// src/app/middleware/optionalAuth.ts
import status74 from "http-status";
var optionalAuth = (...authRoles) => {
  return async (req, res, next) => {
    try {
      const rawSessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
      if (rawSessionToken) {
        const sessionToken = rawSessionToken.split(".")[0];
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: /* @__PURE__ */ new Date()
            }
          },
          include: {
            user: true
          }
        });
        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
          const now = /* @__PURE__ */ new Date();
          const expiresAt = new Date(sessionExist.expiresAt);
          const createdAt = new Date(sessionExist.createdAt);
          const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
          const timeLeft = expiresAt.getTime() - now.getTime();
          const timeLeftPercent = timeLeft / sessionLifetime * 100;
          if (timeLeftPercent <= 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Left", timeLeft.toString());
          }
          if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
            throw new AppError_default(status74.FORBIDDEN, `Your account has been ${user.status === UserStatus.BLOCKED ? "blocked" : "deleted"}. Please contact support.`);
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError_default(status74.FORBIDDEN, "You are not authorized to access this resource");
          }
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role
          };
        }
      }
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
        if (verifiedToken.success) {
          if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
            throw new AppError_default(status74.FORBIDDEN, "Forbidden access! you do not have permission to access this route");
          }
          if (!req.user) {
            req.user = {
              userId: verifiedToken.data.userId,
              email: verifiedToken.data.email,
              role: verifiedToken.data.role
            };
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/rider/rider.route.ts
var router5 = Router5();
router5.post(
  "/apply",
  optionalAuth(),
  riderApplyController
);
router5.get(
  "/me",
  checkAuth(UserRole.RIDER, UserRole.CUSTOMER),
  getRiderMeController
);
router5.get(
  "/dashboard",
  checkAuth(UserRole.RIDER),
  getRiderDashboardController
);
router5.patch(
  "/status",
  checkAuth(UserRole.RIDER),
  validateRequest(updateRiderStatusValidation),
  updateRiderStatusController
);
router5.get(
  "/earnings/me",
  checkAuth(UserRole.RIDER),
  getCurrentEarningsController
);
router5.get(
  "/earnings/history",
  checkAuth(UserRole.RIDER),
  getEarningsHistoryController
);
router5.post(
  "/cashouts/request",
  checkAuth(UserRole.RIDER),
  validateRequest(requestCashoutValidation),
  requestCashoutController
);
router5.get(
  "/cashouts/me",
  checkAuth(UserRole.RIDER),
  getMyCashoutsController
);
router5.get(
  "/cashouts",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getAllCashoutsController
);
router5.patch(
  "/cashouts/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateCashoutStatusValidation),
  updateCashoutStatusController
);
var RiderRoutes = router5;

// src/app/module/payment/routes/payment.route.ts
import { Router as Router6 } from "express";

// src/app/module/payment/validations/payment.validation.ts
import { z as z6 } from "zod";
var paymentInitiateSchema = z6.object({
  parcelId: z6.string().uuid("Invalid parcel ID format"),
  paymentMethod: z6.enum(["STRIPE", "SSLCOMMERZ"], {
    message: "Payment method must be STRIPE or SSLCOMMERZ"
  })
});

// src/app/module/payment/controllers/payment.initiate.controller.ts
import status75 from "http-status";
var initiatePaymentController = catchAsync(
  async (req, res) => {
    const userId = req.user.userId;
    const { parcelId, paymentMethod } = req.body;
    const result = await parcelPayment_service_default.initiateParcelPayment(
      parcelId,
      paymentMethod,
      userId
    );
    sendResponse(res, {
      httpStatusCode: status75.OK,
      success: true,
      message: "Payment initiated successfully",
      data: result
    });
  }
);

// src/app/module/payment/controllers/payment.webhook.controller.ts
import status76 from "http-status";
var webhookController = catchAsync(
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const payload = req.body;
    try {
      const event = await stripe_service_default.verifyWebhookSignature(payload, sig);
      await payment_service_default.handleStripeWebhook(event);
      sendResponse(res, {
        httpStatusCode: status76.OK,
        success: true,
        message: "Webhook processed successfully",
        data: null
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(status76.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

// src/app/module/payment/controllers/payment.sslcommerz.controller.ts
import status77 from "http-status";
var sslcommerzIPNController = catchAsync(
  async (req, res) => {
    const ipnData = req.body;
    try {
      const isValid = sslcommerz_service_default.verifyIPN(ipnData);
      if (!isValid) {
        console.error("SSL Commerz IPN signature verification failed");
        return res.status(status77.BAD_REQUEST).json({
          success: false,
          message: "Invalid IPN signature"
        });
      }
      const metadata = sslcommerz_service_default.extractMetadata(ipnData);
      const amount = sslcommerz_service_default.extractAmount(ipnData);
      if (!sslcommerz_service_default.isPaymentSuccessful(ipnData)) {
        console.log(`SSL Commerz payment failed: ${ipnData.status}`);
        return res.status(status77.OK).json({
          success: true,
          message: "IPN received (payment not successful)"
        });
      }
      const paymentType = metadata.type || "default";
      await payment_service_default.handleWebhookCallback(paymentType, metadata, amount);
      sendResponse(res, {
        httpStatusCode: status77.OK,
        success: true,
        message: "SSL Commerz IPN processed successfully",
        data: null
      });
    } catch (error) {
      console.error("SSL Commerz IPN error:", error);
      return res.status(status77.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : "Error processing SSL Commerz IPN"
      });
    }
  }
);
var sslcommerzSuccessController = catchAsync(
  async (req, res) => {
    const { val_id } = req.body;
    if (!val_id || typeof val_id !== "string") {
      console.log("Missing val_id in request body", { body: req.body });
      return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Invalid validation ID`);
    }
    try {
      const validation = await sslcommerz_service_default.validatePayment(val_id);
      if (!validation.isValid) {
        console.log("SSL Commerz payment validation failed");
        return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Invalid payment`);
      }
      const payment = await payment_service_default.findPaymentByTransactionId(validation.tranId);
      if (!payment) {
        console.log("Payment not found for transaction ID:", validation.tranId);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Payment not found`);
      }
      if (payment.status === "SUCCESS") {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?session_id=${validation.tranId}`);
      }
      await payment_service_default.updatePaymentStatus(payment.id, "SUCCESS");
      const parcel = await prisma.parcel.findUnique({
        where: { id: payment.parcelId }
      });
      if (!parcel) {
        console.log("Parcel not found for payment:", payment.id);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Parcel not found`);
      }
      const metadata = {
        type: "parcel",
        parcelId: parcel.id,
        description: `Parcel Delivery - ${parcel.trackingId}`
      };
      const paymentType = metadata.type || "default";
      await payment_service_default.handleWebhookCallback(paymentType, metadata, validation.amount);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?session_id=${validation.tranId}`);
    } catch (error) {
      console.error("SSL Commerz success callback error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
);

// src/app/module/payment/routes/payment.route.ts
var router6 = Router6();
router6.post(
  "/initiate",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(paymentInitiateSchema),
  initiatePaymentController
);
router6.post("/sslcommerz/ipn", sslcommerzIPNController);
router6.post("/sslcommerz/success", sslcommerzSuccessController);
var PaymentRoutes = router6;

// src/app/module/analytics/routes/analytics.route.ts
import { Router as Router7 } from "express";

// src/app/module/analytics/controllers/revenue.controller.ts
import status78 from "http-status";

// src/app/module/analytics/services/revenue.service.ts
var getRevenueAnalyticsService = async (query) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 30));
  const endDate = query.endDate ? new Date(query.endDate) : /* @__PURE__ */ new Date();
  const dateFilter = {
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  };
  const cache = await getStatsCache();
  const summaryData = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  const totalRevenue = summaryData._sum.amount || 0;
  const totalPayments = summaryData._count;
  const averageOrderValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;
  const summary = {
    totalRevenue: cache.totalRevenue,
    // Use cache for overall revenue
    totalPayments,
    averageOrderValue,
    currency: "BDT"
  };
  const byPaymentMethodData = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  const byPaymentMethod = byPaymentMethodData.map((item) => ({
    paymentMethod: item.paymentMethod,
    totalRevenue: item._sum.amount || 0,
    paymentCount: item._count,
    percentage: totalRevenue > 0 ? (item._sum.amount || 0) / totalRevenue * 100 : 0
  }));
  const paymentsWithParcel = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter
    },
    include: {
      parcel: {
        select: {
          districtFrom: true
        }
      }
    }
  });
  const districtMap = /* @__PURE__ */ new Map();
  paymentsWithParcel.forEach((payment) => {
    const district = payment.parcel?.districtFrom || "Unknown";
    const current = districtMap.get(district) || { revenue: 0, count: 0 };
    current.revenue += payment.amount;
    current.count += 1;
    districtMap.set(district, current);
  });
  const byDistrict = Array.from(districtMap.entries()).map(([district, data]) => ({
    district,
    totalRevenue: data.revenue,
    parcelCount: data.count,
    averageOrderValue: data.count > 0 ? data.revenue / data.count : 0
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const overTimeData = await prisma.payment.groupBy({
    by: ["createdAt"],
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter
    },
    _sum: {
      amount: true
    },
    _count: true
  });
  const dateMap = /* @__PURE__ */ new Map();
  overTimeData.forEach((item) => {
    const date = item.createdAt.toISOString().split("T")[0];
    const current = dateMap.get(date) || { revenue: 0, count: 0 };
    current.revenue += item._sum.amount || 0;
    current.count += item._count;
    dateMap.set(date, current);
  });
  const overTime = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const data = dateMap.get(dateStr) || { revenue: 0, count: 0 };
    overTime.push({
      date: dateStr,
      revenue: data.revenue,
      paymentCount: data.count
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const response = {
    summary,
    byPaymentMethod,
    byDistrict,
    overTime
  };
  return response;
};

// src/app/module/analytics/controllers/revenue.controller.ts
var getRevenueAnalyticsController = catchAsync(
  async (req, res) => {
    const result = await getRevenueAnalyticsService(req.query);
    sendResponse(res, {
      httpStatusCode: status78.OK,
      success: true,
      message: "Revenue analytics fetched successfully",
      data: result
    });
  }
);

// src/app/module/analytics/controllers/dashboard.controller.ts
import status79 from "http-status";

// src/app/module/analytics/services/dashboard.service.ts
var getDashboardMetricsService = async () => {
  const cache = await getStatsCache();
  return {
    overview: {
      totalParcels: cache.totalParcels,
      totalPendingParcels: cache.totalPendingParcels,
      totalCompletedParcels: cache.totalCompletedParcels,
      totalUsers: cache.totalUsers,
      totalRiders: cache.totalRiders,
      totalCustomers: cache.totalCustomers
    },
    revenue: {
      totalRevenue: cache.totalRevenue,
      dailyRevenue: cache.dailyRevenue,
      weeklyRevenue: cache.weeklyRevenue,
      monthlyRevenue: cache.monthlyRevenue,
      platformRevenue: cache.platformRevenue,
      avgOrderValue: cache.avgOrderValue
    },
    riders: {
      totalRiders: cache.totalRiders,
      activeRiders: cache.activeRiders,
      onlineRiders: cache.onlineRiders
    },
    performance: {
      avgDeliveryTime: cache.avgDeliveryTime,
      deliverySuccessRate: cache.deliverySuccessRate
    },
    financial: {
      riderPayouts: cache.riderPayouts,
      pendingPayouts: cache.pendingPayouts
    },
    growth: {
      newUsersToday: cache.newUsersToday,
      newUsersThisWeek: cache.newUsersThisWeek,
      newUsersThisMonth: cache.newUsersThisMonth
    }
  };
};

// src/app/module/analytics/controllers/dashboard.controller.ts
var getDashboardMetricsController = catchAsync(
  async (req, res) => {
    const result = await getDashboardMetricsService();
    sendResponse(res, {
      httpStatusCode: status79.OK,
      success: true,
      message: "Dashboard metrics fetched successfully",
      data: result
    });
  }
);

// src/app/module/analytics/routes/analytics.route.ts
var router7 = Router7();
router7.get(
  "/revenue",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getRevenueAnalyticsController
);
router7.get(
  "/dashboard",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getDashboardMetricsController
);
var AnalyticsRoutes = router7;

// src/app/module/rating/routes/rating.route.ts
import { Router as Router8 } from "express";

// src/app/module/rating/controllers/rating.controller.ts
import status81 from "http-status";

// src/app/module/rating/services/rating.service.ts
import status80 from "http-status";
var submitRatingService = async (customerId, data) => {
  const parcel = await prisma.parcel.findUnique({
    where: { id: data.parcelId },
    include: { rider: true }
  });
  if (!parcel) {
    throw new AppError_default(status80.NOT_FOUND, "Parcel not found");
  }
  if (parcel.customerId !== customerId) {
    throw new AppError_default(status80.FORBIDDEN, "You can only rate your own parcels");
  }
  if (parcel.status !== ParcelStatus.DELIVERED) {
    throw new AppError_default(status80.BAD_REQUEST, "You can only rate delivered parcels");
  }
  if (!parcel.riderId) {
    throw new AppError_default(status80.BAD_REQUEST, "No rider assigned to this parcel");
  }
  const existingRating = await prisma.riderRating.findUnique({
    where: {
      parcelId_customerId: {
        parcelId: data.parcelId,
        customerId
      }
    }
  });
  if (existingRating) {
    throw new AppError_default(status80.CONFLICT, "You have already rated this parcel");
  }
  const rating = await prisma.riderRating.create({
    data: {
      riderId: parcel.riderId,
      customerId,
      parcelId: data.parcelId,
      rating: data.rating,
      comment: data.comment
    }
  });
  const rider = await prisma.rider.findUnique({
    where: { id: parcel.riderId }
  });
  if (rider) {
    const oldRating = rider.rating;
    const oldCount = rider.totalRatings;
    const newAverage = (oldRating * oldCount + data.rating) / (oldCount + 1);
    await prisma.rider.update({
      where: { id: parcel.riderId },
      data: {
        rating: newAverage,
        totalRatings: oldCount + 1
      }
    });
  }
  return rating;
};
var getRiderRatingsService = async (riderId, page, limit) => {
  const skip = (page - 1) * limit;
  const [ratings, total] = await Promise.all([
    prisma.riderRating.findMany({
      where: { riderId },
      include: {
        customer: {
          select: { id: true, name: true }
        },
        parcel: {
          select: { id: true, trackingId: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.riderRating.count({ where: { riderId } })
  ]);
  return {
    ratings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getRatingSummaryService = async (riderId) => {
  const rider = await prisma.rider.findUnique({
    where: { id: riderId }
  });
  if (!rider) {
    throw new AppError_default(status80.NOT_FOUND, "Rider not found");
  }
  const ratings = await prisma.riderRating.findMany({
    where: { riderId },
    select: { rating: true }
  });
  const ratingDistribution = {
    fiveStar: ratings.filter((r) => r.rating === 5).length,
    fourStar: ratings.filter((r) => r.rating === 4).length,
    threeStar: ratings.filter((r) => r.rating === 3).length,
    twoStar: ratings.filter((r) => r.rating === 2).length,
    oneStar: ratings.filter((r) => r.rating === 1).length
  };
  return {
    averageRating: rider.rating,
    totalRatings: rider.totalRatings,
    ratingDistribution
  };
};
var updateRatingService = async (ratingId, customerId, data) => {
  const rating = await prisma.riderRating.findUnique({
    where: { id: ratingId },
    include: { rider: true }
  });
  if (!rating) {
    throw new AppError_default(status80.NOT_FOUND, "Rating not found");
  }
  if (rating.customerId !== customerId) {
    throw new AppError_default(status80.FORBIDDEN, "You can only update your own ratings");
  }
  const hoursSinceCreation = (Date.now() - rating.createdAt.getTime()) / (1e3 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError_default(status80.BAD_REQUEST, "You can only edit ratings within 24 hours");
  }
  const oldRatingValue = rating.rating;
  const updatedRating = await prisma.riderRating.update({
    where: { id: ratingId },
    data: {
      rating: data.rating,
      comment: data.comment
    }
  });
  if (data.rating && data.rating !== oldRatingValue) {
    const rider = await prisma.rider.findUnique({
      where: { id: rating.riderId }
    });
    if (rider) {
      const allRatings = await prisma.riderRating.findMany({
        where: { riderId: rating.riderId },
        select: { rating: true }
      });
      const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = total / allRatings.length;
      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: newAverage }
      });
    }
  }
  return updatedRating;
};
var deleteRatingService = async (ratingId, customerId) => {
  const rating = await prisma.riderRating.findUnique({
    where: { id: ratingId },
    include: { rider: true }
  });
  if (!rating) {
    throw new AppError_default(status80.NOT_FOUND, "Rating not found");
  }
  if (rating.customerId !== customerId) {
    throw new AppError_default(status80.FORBIDDEN, "You can only delete your own ratings");
  }
  const hoursSinceCreation = (Date.now() - rating.createdAt.getTime()) / (1e3 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError_default(status80.BAD_REQUEST, "You can only delete ratings within 24 hours");
  }
  await prisma.riderRating.delete({
    where: { id: ratingId }
  });
  const rider = await prisma.rider.findUnique({
    where: { id: rating.riderId }
  });
  if (rider) {
    const allRatings = await prisma.riderRating.findMany({
      where: { riderId: rating.riderId },
      select: { rating: true }
    });
    if (allRatings.length === 0) {
      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: 0, totalRatings: 0 }
      });
    } else {
      const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = total / allRatings.length;
      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: newAverage, totalRatings: allRatings.length }
      });
    }
  }
  return { message: "Rating deleted successfully" };
};
var getMyRatingsService = async (customerId) => {
  const ratings = await prisma.riderRating.findMany({
    where: { customerId },
    include: {
      parcel: {
        select: {
          id: true,
          trackingId: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return ratings;
};
var getRecentReviewsService = async (limit) => {
  const reviews = await prisma.riderRating.findMany({
    include: {
      customer: {
        select: { name: true }
      },
      rider: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    customer: { name: review.customer.name },
    rider: { name: review.rider.user.name }
  }));
};

// src/app/module/rating/validations/rating.validation.ts
import { z as z7 } from "zod";
var submitRatingSchema = z7.object({
  parcelId: z7.string().uuid("Invalid parcel ID"),
  rating: z7.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z7.string().max(500, "Comment must be less than 500 characters").optional()
});
var updateRatingSchema = z7.object({
  rating: z7.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z7.string().max(500, "Comment must be less than 500 characters").optional()
}).refine((data) => data.rating !== void 0 || data.comment !== void 0, {
  message: "At least one field (rating or comment) must be provided"
});
var getRatingsSchema = z7.object({
  page: z7.string().optional().default("1"),
  limit: z7.string().optional().default("10")
});

// src/app/module/rating/controllers/rating.controller.ts
var submitRatingController = catchAsync(async (req, res) => {
  const validatedData = submitRatingSchema.parse(req.body);
  const rating = await submitRatingService(req.user.userId, validatedData);
  sendResponse(res, {
    httpStatusCode: status81.CREATED,
    success: true,
    message: "Rating submitted successfully",
    data: rating
  });
});
var getRiderRatingsController = catchAsync(async (req, res) => {
  const { riderId } = req.params;
  const validatedData = getRatingsSchema.parse(req.query);
  const page = parseInt(validatedData.page);
  const limit = parseInt(validatedData.limit);
  const result = await getRiderRatingsService(riderId, page, limit);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: "Rider ratings fetched successfully",
    data: result.ratings,
    meta: result.meta
  });
});
var getRatingSummaryController = catchAsync(async (req, res) => {
  const { riderId } = req.params;
  const summary = await getRatingSummaryService(riderId);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: "Rating summary fetched successfully",
    data: summary
  });
});
var updateRatingController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateRatingSchema.parse(req.body);
  const rating = await updateRatingService(id, req.user.userId, validatedData);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: "Rating updated successfully",
    data: rating
  });
});
var deleteRatingController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteRatingService(id, req.user.userId);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var getRecentReviewsController = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const reviews = await getRecentReviewsService(limit);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: "Recent reviews fetched successfully",
    data: reviews
  });
});
var getMyRatingsController = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const ratings = await getMyRatingsService(customerId);
  sendResponse(res, {
    httpStatusCode: status81.OK,
    success: true,
    message: "My ratings fetched successfully",
    data: ratings
  });
});

// src/app/module/rating/routes/rating.route.ts
var router8 = Router8();
router8.post(
  "/",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(submitRatingSchema),
  submitRatingController
);
router8.get("/rider/:riderId", getRiderRatingsController);
router8.get("/rider/:riderId/summary", getRatingSummaryController);
router8.get("/my", checkAuth(UserRole.CUSTOMER), getMyRatingsController);
router8.patch(
  "/:id",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(updateRatingSchema),
  updateRatingController
);
router8.delete("/:id", checkAuth(UserRole.CUSTOMER), deleteRatingController);
router8.get("/reviews/recent", getRecentReviewsController);
var RatingRoutes = router8;

// src/app/routes/index.ts
var router9 = Router9();
router9.use("/auth", AuthRoutes);
router9.use("/parcels", ParcelRoutes);
router9.use("/users", UserRoutes);
router9.use("/addresses", AddressRoutes);
router9.use("/rider", RiderRoutes);
router9.use("/payments", PaymentRoutes);
router9.use("/analytics", AnalyticsRoutes);
router9.use("/ratings", RatingRoutes);
var IndexRoutes = router9;

// src/app/middleware/globalErrorHandler.ts
import status84 from "http-status";
import z8 from "zod";

// src/app/errorHelper/handleZodError.ts
import status82 from "http-status";
var handleZodError = (error) => {
  const statusCode = status82.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  errorSources.push(...error.issues.map((issue) => ({
    path: issue.path.join(" "),
    message: issue.message
  })));
  return {
    success: false,
    message,
    statusCode,
    errorSources
  };
};

// src/app/errorHelper/handlePrismaErrors.ts
import status83 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status83.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status83.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status83.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status83.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status83.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status83.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status83.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status83.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status83.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status83.INTERNAL_SERVER_ERROR;
  }
  return status83.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status83.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status83.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status83.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status83.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (error, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Global Error Handler:", error);
  }
  let errorSources = [];
  let statusCode = status84.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(error);
    statusCode = simplifiedError.statusCode || status84.CONFLICT;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(error);
    statusCode = simplifiedError.statusCode || status84.INTERNAL_SERVER_ERROR;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(error);
    statusCode = simplifiedError.statusCode || status84.BAD_REQUEST;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode || status84.INTERNAL_SERVER_ERROR;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(error);
    statusCode = simplifiedError.statusCode || status84.SERVICE_UNAVAILABLE;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof z8.ZodError) {
    const simplifiedErrors = handleZodError(error);
    statusCode = simplifiedErrors.statusCode;
    message = simplifiedErrors.message;
    errorSources.push(...simplifiedErrors.errorSources);
  } else if (error instanceof AppError_default) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = status84.INTERNAL_SERVER_ERROR;
    message = error.message;
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? error.stack : void 0,
    error: envVars.NODE_ENV === "development" ? error instanceof Error ? error.message : "Unknown error" : "Internal Server Error"
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import path2 from "path";
var notFound = (req, res) => {
  if (req.headers.accept?.includes("application/json")) {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: `Route ${req.method} ${req.originalUrl} not found`,
      errorCode: "ROUTE_NOT_FOUND",
      method: req.method,
      path: req.originalUrl,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } else {
    res.status(404).sendFile(path2.join(__dirname, "../../../public/404.html"));
  }
};
var notFound_default = notFound;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
var app = express();
if (envVars.NODE_ENV === "production") {
  app.set("trust proxy", true);
}
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), "src/app/templates"));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      envVars.BACKEND_URL,
      "http://localhost:3000",
      "http://localhost:5000",
      "https://nex-drop-client.vercel.app",
      "https://sandbox.sslcommerz.com",
      "https://securepay.sslcommerz.com"
    ];
    if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));
app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), webhookController);
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path3.resolve(process.cwd(), "public")));
app.get("/", (_, res) => {
  res.sendFile(path3.resolve(process.cwd(), "public/index.html"));
});
app.use("/api/v1", IndexRoutes);
app.use(notFound_default);
app.use(globalErrorHandler);
var app_default = app;

// src/app/module/parcel/parcel.init.ts
payment_service_default.registerWebhookCallback("parcel", parcelPayment_service_default.handleParcelPaymentWebhook);

// src/server.ts
var server;
var bootStrap = async () => {
  try {
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootStrap();
var server_default = app_default;
export {
  server_default as default
};
