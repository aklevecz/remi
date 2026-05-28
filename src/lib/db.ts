// Cloudflare D1 data layer. The D1 binding is only available per-request via
// `Astro.locals.runtime.env.DB`, so this is a factory rather than a singleton:
// call `getDb(Astro.locals.runtime.env.DB)` at each call site.

export type AppointmentRow = {
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
  imageSrc: string;
  createdAt: Date;
};

export type PaintingRow = {
  key: string;
  title: string;
  material: string;
  dimensions: string;
  rank: number;
  year: number;
  updatedAt: Date;
};

export type TattooRow = {
  key: string;
  name: string;
};

type NewAppointment = {
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

type NewUser = {
  name: string;
  email: string;
  instagram: string;
};

type NewPainting = {
  key: string;
  title: string;
  material: string;
  dimensions: string;
  rank: number;
  year: number;
  updatedAt: Date;
};

type NewTattoo = {
  key: string;
  name: string;
};

export const getDb = (DB: D1Database) => {
  const getAppointmentById = async (id: string): Promise<AppointmentRow[]> => {
    const { results } = await DB.prepare("SELECT * FROM Appointment WHERE id = ?").bind(id).all();
    return (results as any[]).map(toAppointment);
  };

  const getAllAppointments = async (): Promise<AppointmentRow[]> => {
    const { results } = await DB.prepare("SELECT * FROM Appointment").all();
    return (results as any[]).map(toAppointment);
  };

  const createAppointment = async (appointment: NewAppointment) => {
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
    return DB.prepare(
      `INSERT INTO Appointment
        (id, userId, name, pronouns, instagram, email, tattooDescription, tattooPlacement, tattooSize, availability, miscellaneous, imageSrc, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
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
        now.toISOString()
      )
      .run();
  };

  const createUser = async (user: NewUser) => {
    const { name, email, instagram } = user;
    return DB.prepare("INSERT INTO User (name, email, instagram, phoneNumber) VALUES (?, ?, ?, ?)")
      .bind(name, email, instagram, "")
      .run();
  };

  const getUserByEmail = async (email: string) => {
    const { results } = await DB.prepare("SELECT * FROM User WHERE email = ?").bind(email).all();
    return results as { id: number; name: string; email: string; instagram: string; phoneNumber: string }[];
  };

  const getAllUsers = async () => {
    const { results } = await DB.prepare("SELECT * FROM User").all();
    return results;
  };

  const getPainting = async (key: string): Promise<PaintingRow[]> => {
    const { results } = await DB.prepare("SELECT * FROM Painting WHERE key = ?").bind(key).all();
    return (results as any[]).map(toPainting);
  };

  const getAllPaintings = async (): Promise<PaintingRow[]> => {
    const { results } = await DB.prepare("SELECT * FROM Painting").all();
    return (results as any[]).map(toPainting);
  };

  const addOrUpdatePainting = async (painting: NewPainting) => {
    const { key, title, material, dimensions, rank, year, updatedAt } = painting;
    return DB.prepare(
      `INSERT INTO Painting (key, title, material, dimensions, rank, year, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         title = excluded.title,
         material = excluded.material,
         dimensions = excluded.dimensions,
         rank = excluded.rank,
         year = excluded.year,
         updatedAt = excluded.updatedAt`
    )
      .bind(key, title, material, dimensions, rank, year, updatedAt.toISOString())
      .run();
  };

  const deletePainting = async (key: string) => {
    return DB.prepare("DELETE FROM Painting WHERE key = ?").bind(key).run();
  };

  const getAllTattoos = async (): Promise<TattooRow[]> => {
    const { results } = await DB.prepare("SELECT * FROM Tattoo").all();
    return results as TattooRow[];
  };

  const addOrUpdateTattoo = async (tattoo: NewTattoo) => {
    const { key, name } = tattoo;
    return DB.prepare(
      `INSERT INTO Tattoo (key, name) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET name = excluded.name`
    )
      .bind(key, name)
      .run();
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

// D1 stores dates as ISO strings; rehydrate to Date so callers can use
// `.getTime()` / `.toLocaleString()` as before.
function toAppointment(row: any): AppointmentRow {
  return { ...row, createdAt: new Date(row.createdAt) };
}

function toPainting(row: any): PaintingRow {
  return { ...row, updatedAt: new Date(row.updatedAt) };
}

export default getDb;
