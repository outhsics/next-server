-- 1. 开启向量扩展 (如果尚未开启)
create extension if not exists vector;

-- 2. 确保 products 表有向量字段
alter table products 
add column if not exists embedding vector(768);

-- 3. 【重要】先删除旧函数，防止返回类型冲突报错
drop function if exists match_products;

-- 4. 创建核心搜索函数 match_products
create or replace function match_products (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  name text,
  description text,
  price numeric,
  image_url text,
  category text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    products.id,
    products.name,
    products.description,
    products.price,
    products.image_url,
    products.category,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;
