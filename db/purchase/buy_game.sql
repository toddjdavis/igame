insert into buy_game(
    game_id,
    user_id
) values (
    $1, $2
),
returing *;