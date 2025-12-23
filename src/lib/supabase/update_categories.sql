-- 将英文分类更新为中文
UPDATE products SET category = '鞋类' WHERE category ILIKE 'shoes';
UPDATE products SET category = '数码' WHERE category ILIKE 'electronics';
UPDATE products SET category = '家具' WHERE category ILIKE 'furniture';
UPDATE products SET category = '家居' WHERE category ILIKE 'home';

-- 验证更新结果
SELECT id, name, category FROM products;
