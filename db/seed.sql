create table users(
    user_id serial primary key,
    email varchar(250),
    password varchar(250),
    user_picture varchar(250)
);
create table games(
    game_id serial primary key,
    user_id int references users(user_id),
    title varchar(150),
    description varchar(1000),
    game_picture varchar(250)
);
create table liked(
    liked_id serial primary key,
    user_id int references users(user_id),
    game_id int references games(game_id)
);
create table rating(
    rating_id serial primary key,
    user_id int references users(user_id),
    game_id int references games(game_id),
    rating int
);
create table comments(
    comment_id serial primary key,
    user_id int references users(user_id),
    game_id int references games(game_id),
    comment varchar(500)
)