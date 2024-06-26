import { db, eq, Appointment, User, Painting, Tattoo } from "astro:db";

const dbInstance = () => {
  const getAppointmentById = async (id: string) => {
    return db.select().from(Appointment).where(eq(Appointment.id, id));
  };

  const getAllAppointments = async () => {
    return db.select().from(Appointment);
  };

  type Appointment = {
    id: string;
    userId: number;
    name: string;
    pronouns: string;
    instagram: string;
    email: string;
    tattooDescription: string;
    tattooPlacement: string;
    tattooSize: string;
    availability: string;
    miscellaneous: string;
    imgFileName: string;
    now: Date;
  };

  const createAppointment = async (appointment: Appointment) => {
    const {
      id,
      userId,
      name,
      pronouns,
      instagram,
      email,
      tattooDescription,
      tattooPlacement,
      tattooSize,
      availability,
      miscellaneous,
      imgFileName,
      now,
    } = appointment;
    return db.insert(Appointment).values([
      {
        id,
        userId,
        name,
        pronouns,
        instagram,
        email,
        tattooDescription,
        tattooPlacement,
        tattooSize,
        availability,
        miscellaneous,
        imageSrc: imgFileName,
        createdAt: now,
      },
    ]);
  };

  type User = {
    name: string;
    email: string;
    instagram: string;
  };
  const createUser = async (user: User) => {
    const { name, email, instagram } = user;
    return db.insert(User).values([{ name, email, instagram, phoneNumber: "" }]);
  };

  const getUserByEmail = async (email: string) => {
    return db.select().from(User).where(eq(User.email, email));
  };

  const getAllUsers = async () => {
    return db.select().from(User);
  };

  type Painting = {
    key: string;
    title: string;
    material: string;
    dimensions: string;
    rank: number;
    year: number;
    updatedAt:Date;
  };

  const getPainting = async (key:string) => {
    return db.select().from(Painting).where(eq(Painting.key, key));
  }

  const getAllPaintings = async () => {
    return db.select().from(Painting);
  };

  const addOrUpdatePainting = async (painting: Painting) => {
    const { key, title, material, dimensions, rank, year, updatedAt } = painting;
    return db.insert(Painting).values([{ key, title, material, dimensions, rank, year }]).onConflictDoUpdate({
      target: Painting.key,
      set: { title, material, dimensions, rank, year, updatedAt },
    });
  };

  const deletePainting = async (key: string) => {
    return db.delete(Painting).where(eq(Painting.key, key));
  };

  type Tattoo = {
    key: string;
    name: string;
  };

  const getAllTattoos = async () => {
    return db.select().from(Tattoo);
  }

  const addOrUpdateTattoo = async (tattoo: Tattoo) => {
    const { key, name } = tattoo;
    return db.insert(Tattoo).values([{ key, name }]).onConflictDoUpdate({
      target: Tattoo.key,
      set: { name },
    });
  };

  return {
    getAppointmentById,
    getAllAppointments,
    createAppointment,
    getUserByEmail,
    getAllUsers,
    createUser,
    getPainting,
    getAllPaintings,
    addOrUpdatePainting,
    deletePainting,
    getAllTattoos,
    addOrUpdateTattoo,
  };
};

export default dbInstance();
