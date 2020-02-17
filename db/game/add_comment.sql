insert into comments(
    user_id,
    game_id,
    comment
) values (
    $1, $2, $3
);
select * from comments c
join users u on c.user_id = u.user_id
where c.game_id = $2
order by comment_id desc;