-- ============================================
-- 知识库问答 (RAG) 数据库配置脚本
-- 适配 Google Gemini text-embedding-004 (768 维度)
-- ============================================

-- 0. 启用向量扩展 (如果尚未启用)
create extension if not exists vector;

-- 1. 如果已存在旧表，先删除它（确保维度更新为 768）
-- 注意：这会清空知识库！
drop table if exists documents cascade;

-- 2. 创建知识库文档表
create table documents (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector(768),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 创建核心搜索函数 (用于文档知识库)
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 4. 创建商品搜索函数 (用于 AI 导购)
-- 先删除旧函数，防止因返回类型不一致导致 "cannot change return type of existing function" 错误
drop function if exists match_products(vector, float, int);
drop function if exists match_products(vector, double precision, int);

create or replace function match_products (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  name text,
  price numeric,
  description text,
  image_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    products.id,
    products.name,
    products.price,
    products.description,
    products.image_url,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;
