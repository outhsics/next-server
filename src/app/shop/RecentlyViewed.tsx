import Link from 'next/link'
import Image from 'next/image'
import { getBrowseHistory } from './actions'

export default async function RecentlyViewed() {
    const products = await getBrowseHistory()

    if (!products || products.length === 0) {
        return null
    }

    return (
        <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">最近浏览</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <Link
                        key={product.id.toString()}
                        href={`/shop/product/${product.id}`}
                        className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-all border border-transparent hover:border-gray-200"
                    >
                        <div className="aspect-square relative bg-gray-100">
                            <Image
                                src={product.image_url || '/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{product.name}</h3>
                            <span className="text-blue-600 font-bold text-sm">¥{Number(product.price)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
