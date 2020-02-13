insert into rating(
    user_id,
    game_id,
    rating
) values (
    $1,
    $2,
    $3
);
select avg(rating) from rating
where game_id = $2;