import { PrismaClient } from '@prisma/client'

// 处理 BigInt 序列化
// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString()
}

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL not set, Prisma features will be disabled')
        // Return a proxy that logs warnings for any operation
        return new Proxy({} as PrismaClient, {
            get: (_target, prop) => {
                if (prop === 'then' || prop === 'catch') return undefined
                return new Proxy(() => Promise.resolve(null), {
                    get: () => () => Promise.resolve(null),
                    apply: () => Promise.resolve(null)
                })
            }
        }) as unknown as PrismaClient
    }
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
