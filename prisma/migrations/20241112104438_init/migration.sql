-- CreateTable
CREATE TABLE "Client" (
    "idClient" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "telephone" TEXT
);

-- CreateTable
CREATE TABLE "Reservation" (
    "idReserv" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "arrivalDate" TEXT NOT NULL,
    "departureDate" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "idClient" INTEGER NOT NULL,
    "idRoom" INTEGER NOT NULL,
    CONSTRAINT "Reservation_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client" ("idClient") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_idRoom_fkey" FOREIGN KEY ("idRoom") REFERENCES "Room" ("idRoom") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "idRoom" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL
);
