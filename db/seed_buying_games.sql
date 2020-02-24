create table buy_game(
    buy_game_id serial primary key,
    game_id int REFERENCES games(game_id),
    user_id int REFERENCES users(user_id)
);
create table purchase(
    purchase_id serial primary key,
    game_id int REFERENCES games(game_id),
    price int,
    shipping varchar(200)
)