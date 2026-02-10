import { prisma } from '../lib/prisma';

async function findUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: { username, isActive: true },
  });
}

const userRepository = {
  findUserByUsername,
};

export default userRepository;
