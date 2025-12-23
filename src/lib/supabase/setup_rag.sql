-- ============================================
-- 知识库问答 (RAG) 数据库配置脚本
-- 适配 Google Gemini text-embedding-004 (768 维度)
-- ============================================

-- 1. 如果已存在旧表，先删除它（确保维度更新为 768）
drop table if exists documents cascade;

-- 2. 创建知识库文档表
create table documents (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector(768),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 创建核心搜索函数 (使用 OR REPLACE 防止已存在时报错)
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
