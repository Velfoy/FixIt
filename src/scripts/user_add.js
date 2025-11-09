const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "alice@example.com";
  const plain = "Alice"; // change to desired password
  const name = "Alice";
  const phone = null; // or set phone string
  const role = "CLIENT"; // adjust role if needed

  const existing = await prisma.users.findFirst({ where: { email } });
  if (existing) {
    console.log("User already exists with email:", email);
    await prisma.$disconnect();
    return;
  }

  const hashed = await bcrypt.hash(plain, 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: hashed,
      name,
      phone,
      role,
    },
  });

  console.log("Created user id:", user.id, "email:", user.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
