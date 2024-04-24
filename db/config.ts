import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.number({primaryKey: true}),
    name: column.text(),
    email: column.text(),
    instagram: column.text(),
    phoneNumber: column.text(),
  }

})

const Appointment = defineTable({
  columns: {
    id: column.text({primaryKey: true}),
    userId: column.number({references: () => User.columns.id}),
    name: column.text(),
    pronouns: column.text(),
    instagram: column.text(),
    email: column.text(),
    tattooDescription: column.text(),
    tattooPlacement: column.text(),
    tattooSize: column.text(),
    availability: column.text(),
    miscellaneous: column.text(),
    imageSrc: column.text(),
    createdAt: column.date(),
  }
})

const Painting = defineTable({
  columns: {
    key: column.text({primaryKey: true}),
    title: column.text(),
    material : column.text(),
    dimensions: column.text(),
    rank: column.number(),
    year: column.number(),
  }
})
const Tattoo = defineTable({
  columns: {
    key: column.text({primaryKey: true}),
    name: column.text(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {User, Appointment, Painting, Tattoo}
});
