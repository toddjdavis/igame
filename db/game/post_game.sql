insert into games(
    user_id,
    title,
    description,
    game_picture,
    available
) values (
    $1,
    $2,
    $3,
    $4,
    false
);