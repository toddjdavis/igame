select * from comments c
join users u on c.user_id = u.user_id
where game_id = $1