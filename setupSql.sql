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
    weight_kg numeric(6,3),
    dimensions_mm_l integer,
    dimensions_mm_w integer,
    dimensions_mm_h integer,
    age_restricted boolean
);
create table seasons (
    season_id serial primary key,
    season_code varchar(5) unique,
    name varchar(50),
    date_from date,
    date_to date
);

create table suppliers (
    supplier_id serial primary key,
    name varchar (50) NOT NULL,
    address text,
    email varchar (255),
    accounts_email varchar (255)
);

create table products (
    product_id serial primary key,
    price money,
    season_id integer references seasons(season_id),
    item_id integer references items(item_id),
    unique (season_id,item_id)
);

create table orders (
    order_id serial primary key,
    total money,
    customers_id integer references customers(customers_id),
    shipping_first_name varchar(50),
    shipping_last_name varchar(50),
    shipping_street1 varchar(50) ,
    shipping_street2 varchar(50),
    shipping_postcode varchar(9) ,
    shipping_city varchar(50),
    shipping_country_code varchar(2)
);
-- set up many to many releationship tables
create table product_orders (
    product_id integer references products(product_id),
    order_id integer references orders(order_id),
    volume integer,  -- amount ordered
    primary key (product_id,order_id)
);

create table item_suppliers (
    supplier_id integer references suppliers(supplier_id),
    item_id integer references items(item_id),
    cost money,
    supplier_code varchar(50),
    primary key (supplier_id,item_id)
);

-- added after the fact
alter table products 
add column category varchar(50);

create table order_state (
  state_id integer primary key,
  state_name varchar(50)
  );

alter table orders 
add column state_id integer references order_state(state_id);
