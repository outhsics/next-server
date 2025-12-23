import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// 处理 BigInt 序列化
// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString()
}

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
