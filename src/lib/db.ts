
// import { db, eq,  Appointment, User } from "astro:db";

const dbInstance = () => {

    const getAppointmentById = async (id: string) => {
        //  return db.select().from(Appointment).where(eq(Appointment.id, appointmentId));
        return [{id:"1"}]
    }

    const getAllAppointments = async () => {
        // return db.select().from(Appointment);
        return [] as any
    }

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
    }

    const createAppointment = async (appointment: Appointment) => {
        const { id, userId, name, pronouns, instagram, email, tattooDescription, tattooPlacement, tattooSize, availability, miscellaneous } = appointment;
        // return db.insert(Appointment).values([
        //     {
        //       id,
        //       userId,
        //       name,
        //       pronouns,
        //       instagram,
        //       email,
        //       tattooDescription,
        //       tattooPlacement,
        //       tattooSize,
        //       availability,
        //       miscellaneous,
        //       imageSrc: instagram,
        //       createdAt: new Date(),
        //     },
        //   ]);
    }

    type User = {
        name: string;
        email: string;
        instagram: string;
    }
    const createUser = async (user: User) => {
        const { name, email, instagram } = user;
        // db.insert(User).values([{ name, email, instagram, phoneNumber: "" }])
    }

    const getUserByEmail = async (email: string) => {
        // return db.select().from(User).where(eq(User.email, email));
        return [{id:1}]
    
    }

    const getAllUsers = async () => {
        // return db.select().from(User);
        return []
    }

    return {getAppointmentById, getAllAppointments, createAppointment, getUserByEmail, getAllUsers, createUser}
}

export default dbInstance()