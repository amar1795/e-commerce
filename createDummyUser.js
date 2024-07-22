const faker = require('@faker-js/faker');
const prismadb = require("@/lib/db");

 async function createDummyUserHandler(req, res) {
  try {
    // Create 10 dummy users
    const dummyUsers = [];
    for (let i = 0; i < 10; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = await prismadb.user.create({
        data: {
          name: name,
          email: email,
          emailVerified: faker.date.past(), // Simulating past date for email verification
          image: faker.image.avatar(),
          password: password,
          role: 'USER',
          isTwoFactorEnabled: false,
          // You may add more fields if required
        },
      });
      dummyUsers.push(user);
    }

    res.status(200).json({ message: 'Dummy users created successfully', users: dummyUsers });
  } catch (error) {
    console.error('Error creating dummy users:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prismadb.$disconnect();
  }
}


createDummyUserHandler();