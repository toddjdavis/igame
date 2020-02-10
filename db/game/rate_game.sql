insert into rating(
    user_id,
    game_id,
    rating
) values (
    $1,
    $2,
    $3
);
select * from rating
where game_id = $2;