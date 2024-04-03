import { db, User, Appointment } from "astro:db";
import { generateUUID } from "../src/lib/utils";

// https://astro.build/db/seed
export default async function seed() {
  // TODO
  await db
    .insert(User)
    .values([{ name: "Alice", email: "alice@gmail.com", instagram: "alice", phoneNumber: "123456789" }]);

  const users = await db.select().from(User);
  console.log(users);

  await db
    .insert(Appointment)
    .values([
      {
		id: generateUUID(),
        userId: 1,
        name: "Alice",
        pronouns: "she/her",
        instagram: "alice",
        email: "alice@gmail.com",
        tattooDescription: "a tattoo",
        tattooPlacement: "arm",
        tattooSize: "small",
        availability: "weekends",
        miscellaneous: "none",
        imageSrc: "alice",
        createdAt: new Date(),
      },
    ]);

	const appointments = await db.select().from(Appointment);
	console.log(appointments)
}
