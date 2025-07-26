import prisma from "../lib/prismadb.js";

export const favAddRemove = async (req, res) => {
  const id = parseInt(req.params.id);
  const clerkUserId = req.auth().userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findFirst({ where: { clerkUserId } });

  if (!user) {
    return res.status(403).json({ error: "Forbidden" });
  }

  let myFavorite = await prisma.favorite.findFirst({
    where: { userId: user.id },
  });

  if (!myFavorite) {
    myFavorite = await prisma.favorite.create({
      data: {
        userId: user.id,
      },
    });
  }

  const favProduct = await prisma.favoriteItem.findFirst({
    where: {
      productId: id,
      favoriteId: myFavorite.id,
    },
  });

  if (favProduct) {
    await prisma.favoriteItem.delete({
      where: {
        id: favProduct.id,
      },
    });

    return res.status(200).json({ message: "Removed from favorites" });
  } else {
    await prisma.favoriteItem.create({
      data: {
        productId: id,
        favoriteId: myFavorite.id,
      },
    });

    return res.status(200).json({ message: "Added to favorites" });
  }
};
export const getFavorites = async (req, res) => {
  const clerkUserId = req.auth?.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findFirst({
    where: { clerkUserId },
  });

  if (!user) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const myFavorite = await prisma.favorite.findFirst({
    where: { userId: user.id },
  });

  // If user has no favorite record yet, return empty list
  if (!myFavorite) {
    return res.status(200).json([]);
  }

  // Fetch *all* favorite items for that favorite list
  const favItems = await prisma.favoriteItem.findMany({
    where: { favoriteId: myFavorite.id },
    include: { product: true },
  });
  const favoriteProducts = favItems.map((item) => item.product);
  return res.status(200).json(favoriteProducts);
};
