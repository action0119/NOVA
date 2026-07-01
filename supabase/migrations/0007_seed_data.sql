-- Brands (featured_product_id filled in after products are seeded, phase 2 below)
insert into public.brand (brand_name, brand_description, brand_image, brand_mood, brand_logo) values
  ('RECTO', '절제된 실루엣과 현대적인 감성을 기반으로 일상 속 세련된 스타일을 제안합니다.', 'https://picsum.photos/seed/nova-recto/800/600', 'Minimal', 'https://picsum.photos/seed/nova-recto-logo/200/80'),
  ('NOTHING WRITTEN', '편안한 소재와 미니멀한 디자인을 중심으로 자연스러운 여성스러움을 표현합니다.', 'https://picsum.photos/seed/nova-nothingwritten/800/600', 'Casual', 'https://picsum.photos/seed/nova-nothingwritten-logo/200/80'),
  ('OUR LEGACY', '클래식한 무드와 실험적인 디테일을 결합해 개성 있는 스타일을 보여줍니다.', 'https://picsum.photos/seed/nova-ourlegacy/800/600', 'Vintage', 'https://picsum.photos/seed/nova-ourlegacy-logo/200/80'),
  ('INSILENCE', '미니멀한 구조와 차분한 컬러를 기반으로 도시적인 감성을 전달합니다.', 'https://picsum.photos/seed/nova-insilence/800/600', 'Minimal', 'https://picsum.photos/seed/nova-insilence-logo/200/80');

-- Categories: top-level then children referencing parent by name
insert into public.category (category_name, parent_category_id) values
  ('Women', null),
  ('Men', null);

insert into public.category (category_name, parent_category_id)
select 'Outer', category_id from public.category where category_name = 'Women'
union all select 'Top', category_id from public.category where category_name = 'Women'
union all select 'Bottom', category_id from public.category where category_name = 'Women'
union all select 'Knit', category_id from public.category where category_name = 'Women'
union all select 'Outer', category_id from public.category where category_name = 'Men'
union all select 'Top', category_id from public.category where category_name = 'Men'
union all select 'Bottom', category_id from public.category where category_name = 'Men'
union all select 'Knit', category_id from public.category where category_name = 'Men';

-- Products: 20 total across the 5 moods, referencing brand/category by name (no hardcoded ids)
insert into public.product (product_name, product_price, brand_id, category_id, product_description, product_image, mood, color, size, stock, product_tag, discount_rate)
values
  ('Loose Fit Wind Jacket', 189000,
    (select brand_id from public.brand where brand_name = 'NOTHING WRITTEN'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Outer'),
    '루즈핏 실루엣의 바람막이 자켓입니다.', 'https://picsum.photos/seed/nova-p1/700/900', 'Casual', array['Black','Beige'], array['S','M','L'], 25, 'NEW', 0),
  ('Minimal Half Knit', 129000,
    (select brand_id from public.brand where brand_name = 'INSILENCE'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Knit'),
    '차분한 컬러의 미니멀 하프 니트입니다.', 'https://picsum.photos/seed/nova-p2/700/900', 'Minimal', array['Ivory','Black'], array['S','M','L'], 30, 'BEST', 0),
  ('Volume Shirt', 159000,
    (select brand_id from public.brand where brand_name = 'RECTO'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Top'),
    '볼륨감 있는 실루엣의 셔츠입니다.', 'https://picsum.photos/seed/nova-p3/700/900', 'Minimal', array['White','Black'], array['S','M','L'], 20, 'AI PICK', 0),
  ('Linen Blend Jacket', 269000,
    (select brand_id from public.brand where brand_name = 'OUR LEGACY'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Outer'),
    '리넨 혼방 소재의 자켓입니다.', 'https://picsum.photos/seed/nova-p4/700/900', 'Vintage', array['Beige','Navy'], array['M','L','XL'], 15, 'NEW', 0),
  ('Basic Logo T-Shirt', 69000,
    (select brand_id from public.brand where brand_name = 'INSILENCE'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Top'),
    '베이직 로고 반팔 티셔츠입니다.', 'https://picsum.photos/seed/nova-p5/700/900', 'Minimal', array['White','Black','Grey'], array['S','M','L'], 50, 'BEST', 0),
  ('Wide Straight Denim', 139000,
    (select brand_id from public.brand where brand_name = 'RECTO'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Bottom'),
    '와이드 스트레이트 핏 데님입니다.', 'https://picsum.photos/seed/nova-p6/700/900', 'Minimal', array['Blue','Black'], array['S','M','L'], 22, 'NEW', 0),
  ('Oversized Hoodie', 99000,
    (select brand_id from public.brand where brand_name = 'NOTHING WRITTEN'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Top'),
    '오버사이즈 후드 스웨트셔츠입니다.', 'https://picsum.photos/seed/nova-p7/700/900', 'Street', array['Black','Grey'], array['M','L','XL'], 35, 'BEST', 0),
  ('Cargo Utility Pants', 149000,
    (select brand_id from public.brand where brand_name = 'OUR LEGACY'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Bottom'),
    '유틸리티 카고 팬츠입니다.', 'https://picsum.photos/seed/nova-p8/700/900', 'Street', array['Khaki','Black'], array['M','L','XL'], 18, 'NEW', 0),
  ('Graphic Print Tee', 59000,
    (select brand_id from public.brand where brand_name = 'NOTHING WRITTEN'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Top'),
    '그래픽 프린트 반팔 티셔츠입니다.', 'https://picsum.photos/seed/nova-p9/700/900', 'Street', array['White','Black'], array['S','M','L'], 40, 'SALE', 20),
  ('Vintage Washed Denim Jacket', 219000,
    (select brand_id from public.brand where brand_name = 'OUR LEGACY'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Outer'),
    '빈티지 워싱 데님 자켓입니다.', 'https://picsum.photos/seed/nova-p10/700/900', 'Vintage', array['Blue'], array['M','L','XL'], 12, 'NEW', 0),
  ('Corduroy Shirt', 119000,
    (select brand_id from public.brand where brand_name = 'OUR LEGACY'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Top'),
    '코듀로이 셔츠입니다.', 'https://picsum.photos/seed/nova-p11/700/900', 'Vintage', array['Brown','Green'], array['M','L'], 20, 'BEST', 0),
  ('Retro Knit Vest', 89000,
    (select brand_id from public.brand where brand_name = 'INSILENCE'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Knit'),
    '레트로 무드의 니트 베스트입니다.', 'https://picsum.photos/seed/nova-p12/700/900', 'Vintage', array['Brown','Ivory'], array['S','M'], 16, 'AI PICK', 0),
  ('Relaxed Fit Cardigan', 109000,
    (select brand_id from public.brand where brand_name = 'NOTHING WRITTEN'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Knit'),
    '릴렉스핏 가디건입니다.', 'https://picsum.photos/seed/nova-p13/700/900', 'Casual', array['Beige','Grey'], array['S','M','L'], 24, 'BEST', 0),
  ('Daily Cotton Shirt', 79000,
    (select brand_id from public.brand where brand_name = 'RECTO'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Top'),
    '데일리 코튼 셔츠입니다.', 'https://picsum.photos/seed/nova-p14/700/900', 'Casual', array['White','Skyblue'], array['M','L','XL'], 28, 'NEW', 0),
  ('Easy Jogger Pants', 89000,
    (select brand_id from public.brand where brand_name = 'NOTHING WRITTEN'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Bottom'),
    '이지 조거 팬츠입니다.', 'https://picsum.photos/seed/nova-p15/700/900', 'Casual', array['Black','Grey'], array['S','M','L'], 32, 'BEST', 0),
  ('Tailored Blazer', 259000,
    (select brand_id from public.brand where brand_name = 'RECTO'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Outer'),
    '테일러드 블레이저입니다.', 'https://picsum.photos/seed/nova-p16/700/900', 'Office', array['Black','Navy'], array['S','M','L'], 14, 'AI PICK', 0),
  ('Slim Fit Trousers', 129000,
    (select brand_id from public.brand where brand_name = 'INSILENCE'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Men' and c.category_name = 'Bottom'),
    '슬림핏 정장 팬츠입니다.', 'https://picsum.photos/seed/nova-p17/700/900', 'Office', array['Black','Grey','Navy'], array['M','L','XL'], 20, 'NEW', 0),
  ('Classic Collar Shirt', 99000,
    (select brand_id from public.brand where brand_name = 'RECTO'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Top'),
    '클래식 카라 셔츠입니다.', 'https://picsum.photos/seed/nova-p18/700/900', 'Office', array['White','Skyblue'], array['S','M','L'], 26, 'BEST', 0),
  ('Wool Blend Coat', 329000,
    (select brand_id from public.brand where brand_name = 'OUR LEGACY'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Outer'),
    '울 혼방 롱 코트입니다.', 'https://picsum.photos/seed/nova-p19/700/900', 'Office', array['Camel','Black'], array['S','M','L'], 10, 'NEW', 0),
  ('Structured Midi Skirt', 119000,
    (select brand_id from public.brand where brand_name = 'INSILENCE'),
    (select c.category_id from public.category c join public.category p on c.parent_category_id = p.category_id where p.category_name = 'Women' and c.category_name = 'Bottom'),
    '구조적인 실루엣의 미디 스커트입니다.', 'https://picsum.photos/seed/nova-p20/700/900', 'Office', array['Black','Beige'], array['S','M','L'], 18, 'SALE', 20);

-- Phase 2 of brand seeding: point each brand at one of its own products (circular FK)
update public.brand set featured_product_id = (
  select product_id from public.product where product_name = 'Volume Shirt'
) where brand_name = 'RECTO';

update public.brand set featured_product_id = (
  select product_id from public.product where product_name = 'Loose Fit Wind Jacket'
) where brand_name = 'NOTHING WRITTEN';

update public.brand set featured_product_id = (
  select product_id from public.product where product_name = 'Linen Blend Jacket'
) where brand_name = 'OUR LEGACY';

update public.brand set featured_product_id = (
  select product_id from public.product where product_name = 'Minimal Half Knit'
) where brand_name = 'INSILENCE';
