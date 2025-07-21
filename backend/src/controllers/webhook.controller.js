import { Webhook } from "svix";
import prisma from "../lib/prismadb.js";
export const webhookController = async (req, res) => {
  const payload = req.body;
  const headers = req.headers;
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("webhook secret needed");
  }
  const wh = new Webhook(secret);
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({ message: "webhook verification failed" });
  }

  // Do something with the message...
  if (evt.type === "user.created") {
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: evt.data.id,
        username:
          evt.data.username || evt.data.email_addresses[0].email_address,
        email: evt.data.email_addresses[0].email_address,
        img: evt.data.profile_image_url,
      },
    });
    res.status(201).json(newUser);
  }
  if (evt.type === "user.deleted") {
    const deletedUser = await prisma.user.findFirst({
      where: {
        clerkUserId: evt.data.id,
      },
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "no user found to delete" });
    }

    await prisma.user.delete({ where: { id: deletedUser.id } });
    return res.status(200).json({ message: "user deleted" });
  }
  if (evt.type === "user.updated") {
    const updatedUser = await prisma.user.findFirst({
      where: {
        clerkUserId: evt.data.id,
      },
    });
    await prisma.user.update({
      where: {
        id: updatedUser.id,
      },
      data: {
        username:
          evt.data.username || evt.data.email_addresses[0].email_address,
        email: evt.data.email_addresses[0].email_address,
        img: evt.data.profile_image_url,
      },
    });
    res.status(200).json("User updated successfully");
  }
};
