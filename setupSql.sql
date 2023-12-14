-- there queries are not in active use but the ones i used to set up the database on the server. 
create table customers (
    customers_id serial primary key,
    first_name varchar(50)NOT NULL,
    last_name varchar(50)NOT NULL,
    email varchar(255) unique,
    street1 varchar(50) NOT NULL,
    street2 varchar(50),
    postcode varchar(9) NOT NULL,
    city varchar(50) NOT NULL,
    country_code varchar(2) NOT NULL,
    password_hash varchar(255)
);
create table items (
    item_id serial primary key,
    name varchar (50),
    description text,
    category varchar(50),
    price money
);
create table order_state (
  state_id integer primary key,
  state_name varchar(50)
  );

create table orders (
    order_id integer primary key,
    total money,
    customers_id integer references customers(customers_id),
    state_id integer references order_state(state_id),
    shipping_first_name varchar(50),
    shipping_last_name varchar(50),
    shipping_street1 varchar(50) ,
    shipping_street2 varchar(50),
    shipping_postcode varchar(9) ,
    shipping_city varchar(50),
    shipping_country_code varchar(2)
);
-- set up many to many releationship tables
create table item_orders (
    item_id integer references items(item_id),
    order_id integer references orders(order_id),
    volume integer,  -- amount ordered
    primary key (item_id,order_id)
);

CREATE TABLE "cart" (
  "customer_id" integer,
  "item_id" integer,
  "volume" integer,
  PRIMARY KEY ("customer_id", "item_id")
);



-- adding fixed data such as items 
insert into items(
    name,
    description,
    category
)
values 
    ('ACME Rocket','Embark on an Elevated Journey! The ACME Rocket: A Refined Approach to Soaring Heights. Elevate Your Travels with Ease.','Travel'),
    ('ACME Dynamite', 'A Controlled Burst of Energy! ACME Dynamite, Precision Explosives for Discerning Users.', 'Hardware'),
    ('ACME Anvil', 'Solidity Redefined! The ACME Anvil, A Sturdy Marvel for Your Daily Load. A Weighted Companion to Anchor Your Day.', 'Hardware'),
    ('ACME Giant Slingshot', 'A Subtle Propel to Excitement! ACME Giant Slingshot, Gracefully Navigate Distances. A Delicate Leap into Levity.','Travel'),
    ('ACME Portable Hole', 'Create Space at Your Fingertips! ACME Portable Hole, A Neat Solution for Instant Access. Simplify, Don''t Mystify.', 'Hardware'),
    ('ACME Earthquake Pills', 'A Subtle Shift in Perspective! ACME Earthquake Pills, Gently Realign Your Outlook. Embrace Terrific Tremors.', 'Nature'),
    ('ACME Jet-Propelled Roller Skates', 'Move Smoothly into Momentum! ACME Jet-Propelled Roller Skates, An Elegant Glide into Velocity. Gracefully Navigate the Path Ahead.','Travel'),
    ('ACME Giant Magnet', 'Magnetic Precision for Orderly Attraction! ACME Giant Magnet, A Controlled Force for Harmonious Interaction. Let Order Prevail.', 'Hardware'),
    ('ACME Tornado Seeds', 'Cultivate a Whispering Wind! ACME Tornado Seeds, A Gentle Gust of Nature. Nourish Your Surroundings with a Breath of Freshness.', 'Nature'),
    ('ACME Super Outfit', 'Elevate Your Presence! ACME Super Outfit, A Tailored Ensemble for a Dash of Panache. Enhance Your Persona with Subtle Sophistication.','Travel'),
    ('ACME Invisible Paint', 'See Beyond the Surface! ACME Invisible Paint, A Transparent Coating for Subtle Refinement. A Clear Perspective for Discerning Tastes.', 'Hardware'),
    ('ACME Burmese Tiger Trap', 'Capture Elegance in Every Moment! ACME Burmese Tiger Trap, A Graceful Approach to Your Surroundings. An Artful Display of Presence.', 'Pets'),
    ('ACME Wildcat', 'Graceful Companion for Refined Pursuits! ACME Wildcat, An Elegant Choice for Discerning Activities. Move with Feline Finesse.', 'Pets'),
    ('ACME Dehydrated Boulders', 'Effortless Presence, Effortless Rocks! ACME Dehydrated Boulders, Compact, Refined, and Ready. A Solid Touch for Your Environment.', 'Hardware')

UPDATE items set price = (floor(random() * (9) + 1)*5-0.01)::NUMERIC::MONEY -- sets the pice to some random multiple of 5 then removes a penny to make them look relistic