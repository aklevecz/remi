import { db, eq, Appointment, User } from "astro:db";

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
      now
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

  return { getAppointmentById, getAllAppointments, createAppointment, getUserByEmail, getAllUsers, createUser };
};

export default dbInstance();
