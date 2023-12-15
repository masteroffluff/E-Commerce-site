-- there queries are not in active use but the ones i used to set up the database on the server. 
CREATE TABLE customers (
    customers_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50)NOT NULL,
    last_name VARCHAR(50)NOT NULL,
    email VARCHAR(255) UNIQUE,
    street1 VARCHAR(50) NOT NULL,
    street2 VARCHAR(50),
    postcode VARCHAR(9) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    password_hash VARCHAR(255)
);
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR (50),
    description text,
    category VARCHAR(50),
    price MONEY
);
CREATE TABLE order_state (
  state_id INTEGER PRIMARY KEY,
  state_name VARCHAR(50)
  );

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    total MONEY,
    customers_id INTEGER REFERENCES customers(customers_id),
    state_id INTEGER REFERENCES order_state(state_id),
    shipping_first_name VARCHAR(50),
    shipping_last_name VARCHAR(50),
    shipping_street1 VARCHAR(50) ,
    shipping_street2 VARCHAR(50),
    shipping_postcode VARCHAR(9) ,
    shipping_city VARCHAR(50),
    shipping_country_code VARCHAR(2)
);
-- set up many to many releationship tables
CREATE TABLE item_orders (
    item_id INTEGER REFERENCES items(item_id),
    order_id INTEGER REFERENCES orders(order_id),
    volume INTEGER,  -- amount ordered
    PRIMARY KEY (item_id,order_id)
);

CREATE TABLE "cart" (
  "cart_id" INTEGER PRIMARY KEY,  
  "customer_id" INTEGER UNIQUE,
  "sub_total" MONEY
);
CREATE TABLE cart_items(
  cart_id INTEGER,
  item_id INTEGER,
  volume INTEGER,
	PRIMARY KEY (cart_id,item_id)
);


-- adding fixed data such as items 
INSERT INTO items(
    name,
    description,
    category
)
VALUES 
    ('ACME Rocket','Embark on an Elevated Journey! The ACME Rocket: A Refined Approach to Soaring Heights. Elevate Your Travels with Ease.','Travel'),
    ('ACME Dynamite', 'A Controlled Burst of Energy! ACME Dynamite, Precision Explosives for Discerning Users.', 'Hardware'),
    ('ACME Anvil', 'Solidity Redefined! The ACME Anvil, A Sturdy Marvel for Your Daily Load. A Weighted Companion to Anchor Your Day.', 'Hardware'),
    ('ACME Giant Slingshot', 'A Subtle Propel to Excitement! ACME Giant Slingshot, Gracefully Navigate Distances. A Delicate Leap into Levity.','Travel'),
    ('ACME Portable Hole', 'CREATE Space at Your Fingertips! ACME Portable Hole, A Neat Solution for Instant Access. Simplify, Don''t Mystify.', 'Hardware'),
    ('ACME Earthquake Pills', 'A Subtle Shift in Perspective! ACME Earthquake Pills, Gently Realign Your Outlook. Embrace Terrific Tremors.', 'Nature'),
    ('ACME Jet-Propelled Roller Skates', 'Move Smoothly into Momentum! ACME Jet-Propelled Roller Skates, An Elegant Glide into Velocity. Gracefully Navigate the Path Ahead.','Travel'),
    ('ACME Giant Magnet', 'Magnetic Precision for Orderly Attraction! ACME Giant Magnet, A Controlled Force for Harmonious Interaction. Let Order Prevail.', 'Hardware'),
    ('ACME Tornado Seeds', 'Cultivate a Whispering Wind! ACME Tornado Seeds, A Gentle Gust of Nature. Nourish Your Surroundings with a Breath of Freshness.', 'Nature'),
    ('ACME Super Outfit', 'Elevate Your Presence! ACME Super Outfit, A Tailored Ensemble for a Dash of Panache. Enhance Your Persona with Subtle Sophistication.','Travel'),
    ('ACME Invisible Paint', 'See Beyond the Surface! ACME Invisible Paint, A Transparent Coating for Subtle Refinement. A Clear Perspective for Discerning Tastes.', 'Hardware'),
    ('ACME Burmese Tiger Trap', 'Capture Elegance in Every Moment! ACME Burmese Tiger Trap, A Graceful Approach to Your Surroundings. An Artful Display of Presence.', 'Pets'),
    ('ACME Wildcat', 'Graceful Companion for Refined Pursuits! ACME Wildcat, An Elegant Choice for Discerning Activities. Move with Feline Finesse.', 'Pets'),
    ('ACME Dehydrated Boulders', 'Effortless Presence, Effortless Rocks! ACME Dehydrated Boulders, Compact, Refined, and Ready. A Solid Touch for Your Environment.', 'Hardware')
;
UPDATE items SET price = (floor(random() * (9) + 1)*5-0.01)::NUMERIC::MONEY -- sets the pice to some random multiple of 5 then removes a penny to make them look relistic